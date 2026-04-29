/**
 * Route-level loading fallback for /admin/*. Next.js shows this UNDER
 * the admin shell while a freshly-navigated page chunk is still being
 * loaded — turning the previously-blank "spinner only" gap into a
 * structured skeleton that hints at the destination's layout.
 *
 * Each individual page also renders its own first-visit skeleton (via
 * useAdminData's `isInitialLoading`) so subsequent revisits are instant.
 * This file is the safety net for the very first request to a chunk
 * that hasn't been downloaded yet.
 */
export default function AdminLoading() {
  const pulse = '#e2e8f0'
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-56 rounded animate-pulse" style={{ background: pulse }} />
          <div className="h-3 w-72 rounded animate-pulse" style={{ background: pulse }} />
        </div>
        <div className="h-9 w-36 rounded-xl animate-pulse" style={{ background: pulse }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl"
            style={{ background: '#fff', border: '1px solid #e2e8f0' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 w-20 rounded animate-pulse" style={{ background: pulse }} />
              <div className="w-8 h-8 rounded-xl animate-pulse" style={{ background: pulse }} />
            </div>
            <div className="h-7 w-16 rounded animate-pulse" style={{ background: pulse }} />
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl"
        style={{ background: '#fff', border: '1px solid #e2e8f0', height: 360 }}
      >
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <div className="h-4 w-40 rounded animate-pulse" style={{ background: pulse }} />
        </div>
        <div className="p-5 space-y-3">
          {Array.from({ length: 6 }).map((_, j) => (
            <div key={j} className="flex items-center justify-between">
              <div className="h-3 w-2/3 rounded animate-pulse" style={{ background: pulse }} />
              <div className="h-3 w-16 rounded animate-pulse" style={{ background: pulse }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
