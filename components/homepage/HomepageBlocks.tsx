import NextImage from 'next/image'
import Link from 'next/link'
import { AlertTriangle, CheckCircle, Info, Sparkles } from 'lucide-react'
import type { HomepageBlock } from '@/lib/homepage-blocks'

/**
 * Renders an ordered list of admin-managed homepage blocks.
 *
 * Each block_type has its own section wrapper so admins get a consistent look
 * (same max-width, same vertical rhythm) regardless of which block they pick.
 *
 * For `rich-text` we pass the HTML straight to dangerouslySetInnerHTML — the
 * RichEditor is the only thing writing to this field and the admin auth gate
 * is the authority. Inline <script> tags are stripped client-side by the
 * editor, so this is the same trust model as blog post content.
 */
export default function HomepageBlocks({ blocks }: { blocks: HomepageBlock[] }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </>
  )
}

function BlockRenderer({ block }: { block: HomepageBlock }) {
  const { block_type, data } = block

  switch (block_type) {
    case 'heading':
      return <HeadingBlock data={data} />
    case 'rich-text':
      return <RichTextBlock data={data} />
    case 'image':
      return <ImageBlock data={data} />
    case 'two-column':
      return <TwoColumnBlock data={data} />
    case 'visual-break':
      return <VisualBreakBlock data={data} />
    case 'cta-box':
      return <CtaBoxBlock data={data} />
    case 'feature-grid':
      return <FeatureGridBlock data={data} />
    default:
      return null
  }
}

/* ─── heading ───────────────────────────────────────────────────────── */
function HeadingBlock({ data }: { data: any }) {
  const align = data.align === 'left' ? 'text-left' : 'text-center'
  const level = data.level === 'h3' ? 'h3' : 'h2'
  const sizeCls =
    level === 'h3'
      ? 'text-2xl sm:text-3xl'
      : 'text-3xl sm:text-4xl'

  // Tight top padding (heading flows into prev content with breathing room)
  // + smaller bottom padding (heading should feel connected to whatever
  // block comes right after, not floating in the middle of whitespace).
  return (
    <section className="pt-10 pb-2 sm:pt-14 sm:pb-3 px-6">
      <div className={`max-w-4xl mx-auto ${align}`}>
        {data.eyebrow && (
          <p
            className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3"
            style={{ color: 'var(--accent)' }}
          >
            {data.eyebrow}
          </p>
        )}
        {level === 'h2' ? (
          <h2
            className={`font-playfair ${sizeCls} font-bold leading-tight`}
            style={{ color: 'var(--text-primary)' }}
          >
            {data.title || ''}
          </h2>
        ) : (
          <h3
            className={`font-playfair ${sizeCls} font-bold leading-tight`}
            style={{ color: 'var(--text-primary)' }}
          >
            {data.title || ''}
          </h3>
        )}
        {data.subtitle && (
          <p
            className="mt-3 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            {data.subtitle}
          </p>
        )}
      </div>
    </section>
  )
}

/* ─── rich-text ─────────────────────────────────────────────────────── */
function RichTextBlock({ data }: { data: any }) {
  const html = data.html || ''
  if (!html) return null
  // Tight padding top/bottom — the [&>*:first-child]:mt-0 / last-child:mb-0
  // ensures prose's default first/last margins don't stack on top of our
  // section padding (was a major source of empty whitespace).
  return (
    <section className="py-4 sm:py-6 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className="rich-content prose prose-base sm:prose-lg max-w-none
            [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
            prose-headings:font-playfair prose-headings:font-bold
            prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-6 prose-h2:mb-3
            prose-h3:text-xl prose-h3:mt-5 prose-h3:mb-2
            prose-p:leading-relaxed prose-p:my-3
            prose-ul:my-3 prose-ol:my-3 prose-li:my-1
            prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:mx-auto prose-img:max-w-full prose-img:h-auto prose-img:my-4
            prose-table:text-sm prose-table:w-full prose-table:border-collapse prose-table:my-4
            prose-th:p-3 prose-th:text-left prose-td:p-3
            prose-blockquote:rounded-xl prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:my-4
            prose-pre:rounded-xl prose-pre:p-4 prose-pre:my-4
            prose-hr:my-6"
          style={{
            color: 'var(--text-muted)',
            ['--tw-prose-headings' as string]: 'var(--text-primary)',
            ['--tw-prose-links' as string]: 'var(--accent)',
            ['--tw-prose-bold' as string]: 'var(--text-primary)',
            ['--tw-prose-bullets' as string]: 'var(--accent)',
            ['--tw-prose-counters' as string]: 'var(--accent)',
            ['--tw-prose-th-borders' as string]: 'var(--border)',
            ['--tw-prose-td-borders' as string]: 'var(--border)',
            ['--tw-prose-hr' as string]: 'var(--border)',
            ['--tw-prose-quote-borders' as string]: 'var(--accent)',
            ['--tw-prose-code' as string]: 'var(--accent)',
            ['--tw-prose-pre-bg' as string]: 'var(--bg-secondary)',
            ['--tw-prose-pre-code' as string]: 'var(--text-muted)',
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  )
}

/* ─── image ─────────────────────────────────────────────────────────── */
function ImageBlock({ data }: { data: any }) {
  if (!data.src) return null
  const rounded = data.rounded !== false
  const maxH = data.maxHeight ? Number(data.maxHeight) : 500
  return (
    <section className="py-4 sm:py-6 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className={`relative overflow-hidden ${rounded ? 'rounded-2xl' : ''}`}
          style={{ border: '1px solid var(--border)' }}
        >
          <NextImage
            src={data.src}
            alt={data.alt || ''}
            width={1200}
            height={maxH}
            loading="lazy"
            className="w-full h-auto"
            style={{ display: 'block', maxHeight: `${maxH}px`, objectFit: 'cover' }}
          />
          {data.credit && (
            <div
              className="absolute bottom-0 left-0 right-0 px-4 py-3"
              style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}
            >
              <p className="text-xs text-white/70 m-0">{data.credit}</p>
            </div>
          )}
        </div>
        {data.caption && (
          <p
            className="text-sm mt-3 text-center italic"
            style={{ color: 'var(--text-muted)' }}
          >
            {data.caption}
          </p>
        )}
      </div>
    </section>
  )
}

/* ─── two-column ────────────────────────────────────────────────────── */
function TwoColumnBlock({ data }: { data: any }) {
  const reverse = !!data.reverse
  const hasImage = !!data.imageSrc
  const html = data.html || ''
  return (
    <section className="py-6 sm:py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className={`grid gap-6 sm:gap-10 items-center ${
            hasImage ? 'md:grid-cols-2' : ''
          } ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}
        >
          <div
            className="rich-content prose prose-base max-w-none
              [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
              prose-headings:font-playfair prose-headings:font-bold
              prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-0 prose-h2:mb-3
              prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
              prose-p:leading-relaxed prose-p:my-2
              prose-ul:my-2 prose-ol:my-2 prose-li:my-1
              prose-a:no-underline hover:prose-a:underline"
            style={{
              color: 'var(--text-muted)',
              ['--tw-prose-headings' as string]: 'var(--text-primary)',
              ['--tw-prose-links' as string]: 'var(--accent)',
              ['--tw-prose-bold' as string]: 'var(--text-primary)',
              ['--tw-prose-bullets' as string]: 'var(--accent)',
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
          {hasImage && (
            <div className="relative">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ border: '1px solid var(--border)' }}
              >
                <NextImage
                  src={data.imageSrc}
                  alt={data.imageAlt || ''}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="w-full h-auto"
                  style={{ display: 'block' }}
                />
              </div>
              {data.imageCaption && (
                <p
                  className="text-xs mt-2 text-center italic"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {data.imageCaption}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ─── visual-break ──────────────────────────────────────────────────── */
function VisualBreakBlock({ data }: { data: any }) {
  if (!data.src) return null
  return (
    <section className="py-4 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >
          <NextImage
            src={data.src}
            alt={data.alt || ''}
            width={1400}
            height={Number(data.height) || 400}
            loading="lazy"
            className="w-full h-auto"
            style={{
              display: 'block',
              maxHeight: `${Number(data.height) || 400}px`,
              objectFit: 'cover',
            }}
          />
          {data.credit && (
            <div
              className="absolute bottom-0 left-0 right-0 px-4 py-3"
              style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}
            >
              <p className="text-xs text-white/70 m-0">{data.credit}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ─── cta-box ───────────────────────────────────────────────────────── */
const CTA_VARIANTS: Record<string, { bg: string; border: string; textColor: string; icon: any }> = {
  info: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', textColor: '#3b82f6', icon: Info },
  success: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', textColor: '#10b981', icon: CheckCircle },
  warning: { bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.3)', textColor: '#eab308', icon: AlertTriangle },
  danger: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', textColor: '#ef4444', icon: AlertTriangle },
  accent: { bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.25)', textColor: '#10b981', icon: Sparkles },
}

function CtaBoxBlock({ data }: { data: any }) {
  const variant = CTA_VARIANTS[data.variant] || CTA_VARIANTS.info
  const Icon = variant.icon
  return (
    <section className="py-6 sm:py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className="p-6 sm:p-8 rounded-xl"
          style={{ background: variant.bg, border: `2px solid ${variant.border}` }}
        >
          <div className="flex items-start gap-4">
            <Icon className="w-8 h-8 flex-shrink-0" style={{ color: variant.textColor }} />
            <div className="flex-1">
              {data.heading && (
                <h3 className="font-semibold text-xl mb-3" style={{ color: variant.textColor }}>
                  {data.heading}
                </h3>
              )}
              {data.text && (
                <p
                  className="text-base leading-relaxed mb-4 last:mb-0"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {data.text}
                </p>
              )}
              {data.buttonText && data.buttonHref && (
                <Link
                  href={data.buttonHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white text-sm transition hover:scale-105"
                  style={{ background: variant.textColor }}
                >
                  {data.buttonText} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── feature-grid ──────────────────────────────────────────────────── */
function FeatureGridBlock({ data }: { data: any }) {
  const items = Array.isArray(data.items) ? data.items : []
  const cols = Number(data.columns) || 3
  const gridCls = cols === 2
    ? 'md:grid-cols-2'
    : cols === 4
      ? 'md:grid-cols-2 lg:grid-cols-4'
      : 'md:grid-cols-2 lg:grid-cols-3'

  if (items.length === 0) return null

  return (
    <section className="py-6 sm:py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {data.title && (
          <h2
            className="font-playfair text-2xl sm:text-3xl font-bold mb-6 text-center leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {data.title}
          </h2>
        )}
        <div className={`grid gap-5 sm:gap-6 ${gridCls}`}>
          {items.map((item: any, i: number) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-2xl transition hover:scale-[1.02] flex flex-col"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              {item.image && (
                <div className="mb-4 rounded-xl overflow-hidden" style={{ aspectRatio: '16/10' }}>
                  <NextImage
                    src={item.image}
                    alt={item.title || ''}
                    width={400}
                    height={250}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {item.title && (
                <h3
                  className="font-semibold text-lg mb-2 leading-snug"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.title}
                </h3>
              )}
              {item.description && (
                // HTML rendering — admin can add interlinks, bold, italic,
                // lists via the RichEditor in the feature-grid card editor.
                // prose-sm keeps the card compact; first/last margin reset
                // prevents a blank first line above the first paragraph.
                <div
                  className="text-sm leading-relaxed prose prose-sm max-w-none
                    [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                    prose-p:my-2 prose-p:leading-relaxed
                    prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5
                    prose-strong:font-semibold
                    prose-a:font-medium prose-a:no-underline hover:prose-a:underline"
                  style={{
                    color: 'var(--text-muted)',
                    ['--tw-prose-body' as string]: 'var(--text-muted)',
                    ['--tw-prose-headings' as string]: 'var(--text-primary)',
                    ['--tw-prose-links' as string]: 'var(--accent)',
                    ['--tw-prose-bold' as string]: 'var(--text-primary)',
                    ['--tw-prose-bullets' as string]: 'var(--accent)',
                  }}
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
