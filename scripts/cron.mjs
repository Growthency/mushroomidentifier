// Runs next to the Next.js server in the container (see Dockerfile) and
// calls the scheduled-publish endpoint every 5 minutes — what a Vercel cron
// would have done. Needs CRON_SECRET; does nothing without it.
const secret = process.env.CRON_SECRET
const port = process.env.PORT || 3000
const EVERY_MS = 5 * 60 * 1000

if (!secret) {
  console.log('[cron] CRON_SECRET not set — scheduled publishing is off.')
} else {
  const tick = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/cron/publish-scheduled`, {
        headers: { authorization: `Bearer ${secret}` },
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok || body.published) console.log(`[cron] publish-scheduled → ${res.status}`, JSON.stringify(body))
    } catch (err) {
      console.log('[cron] publish-scheduled failed:', err.message)
    }
  }
  // First run 1 minute after start (server warm-up), then every 5 minutes.
  setTimeout(() => {
    tick()
    setInterval(tick, EVERY_MS)
  }, 60 * 1000)
}
