# Mushroom Identifiers — production image (Next.js standalone).
# Used by docker-compose.yml (Coolify on the Hetzner server). On start it
# applies db/schema.sql, starts the scheduled-publish cron, then serves the
# site on port 3000.

FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --legacy-peer-deps

FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_URL=https://mushroomidentifiers.com
# Public (browser) Paddle settings are baked into the client bundle at build.
ARG NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=""
ARG NEXT_PUBLIC_PADDLE_ENVIRONMENT=""
ARG NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID=""
ARG NEXT_PUBLIC_PADDLE_PRO_PRICE_ID=""
ARG NEXT_PUBLIC_PADDLE_EXPLORER_PRICE_ID=""
ARG NEXT_PUBLIC_PADDLE_LAUNCH_DISCOUNT_CODE=""
ENV NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=$NEXT_PUBLIC_PADDLE_CLIENT_TOKEN \
    NEXT_PUBLIC_PADDLE_ENVIRONMENT=$NEXT_PUBLIC_PADDLE_ENVIRONMENT \
    NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID=$NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID \
    NEXT_PUBLIC_PADDLE_PRO_PRICE_ID=$NEXT_PUBLIC_PADDLE_PRO_PRICE_ID \
    NEXT_PUBLIC_PADDLE_EXPLORER_PRICE_ID=$NEXT_PUBLIC_PADDLE_EXPLORER_PRICE_ID \
    NEXT_PUBLIC_PADDLE_LAUNCH_DISCOUNT_CODE=$NEXT_PUBLIC_PADDLE_LAUNCH_DISCOUNT_CODE
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The heap cap leaves room for the other sites running on the same server.
# The database isn't reachable while the image builds, so the pages that were
# pre-rendered here have no menus / settings / header scripts. Drop them: the
# running server renders each one from the database on its first request and
# keeps it fresh (revalidate) from then on.
# next/font downloads Google Fonts during the build; retry if that hiccups.
RUN export NODE_OPTIONS=--max-old-space-size=1800 \
 && (npx next build || (sleep 15 && npx next build) || (sleep 45 && npx next build)) \
 && find .next/standalone/.next/server/app -type f \( -name '*.html' -o -name '*.rsc' -o -name '*.meta' -o -name '*.body' \) \
      ! -path '*/_not-found*' -delete

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    UPLOAD_DIR=/app/uploads
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/db ./db
COPY --from=builder --chown=nextjs:nodejs /app/scripts/migrate.mjs /app/scripts/cron.mjs ./scripts/
RUN mkdir -p /app/uploads /app/.next/cache && chown -R nextjs:nodejs /app/uploads /app/.next

USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=5s --timeout=3s --start-period=60s --retries=6 \
  CMD wget -qO- http://127.0.0.1:3000/api/health >/dev/null 2>&1 || exit 1
CMD ["sh", "-c", "node scripts/migrate.mjs && (node scripts/cron.mjs &) && exec node server.js"]
