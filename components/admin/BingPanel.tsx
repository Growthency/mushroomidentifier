'use client'
/**
 * "Bing Webmaster" tab of the admin Dashboard.
 * Data: GET /api/admin/analytics?source=bing&period=…
 */
import { CheckCircle2, MousePointerClick, Eye, Activity, XCircle } from 'lucide-react'
import { useAdminData } from '@/hooks/useAdminData'

interface Row { clicks: number; impressions: number; ctr: number; position: number }
interface BingData {
  configured: boolean
  connected: boolean
  siteUrl: string
  error?: string
  site?: {
    inAccount: boolean
    verified: boolean
    otherSites: string[]
    sitemaps: { url: string; status: string; urlCount: number; lastCrawled: string }[]
  } | null
  totals?: { clicks: number; impressions: number; ctr: number }
  daily?: { date: string; clicks: number; impressions: number }[]
  topKeywords?: (Row & { keyword: string })[]
  topPages?: (Row & { page: string })[]
}

export default function BingPanel({ period, periodLabel, dark }: { period: string; periodLabel: string; dark: boolean }) {
  const { data, isInitialLoading } = useAdminData<BingData>(`/api/admin/analytics?source=bing&period=${period}`)

  const cardBg = dark ? '#1e293b' : '#fff'
  const cardBorder = dark ? '#334155' : '#e2e8f0'
  const text = dark ? '#fff' : '#0f172a'
  const muted = dark ? '#94a3b8' : '#64748b'

  if (isInitialLoading || !data) {
    return <div className="rounded-xl border p-8 mb-6 text-sm text-center" style={{ background: cardBg, borderColor: cardBorder, color: muted }}>Loading Bing data…</div>
  }

  if (!data.configured) {
    return (
      <div className="rounded-xl border p-6 mb-6 text-sm" style={{ background: cardBg, borderColor: cardBorder, color: text }}>
        <h2 className="font-semibold mb-3">Connect Bing Webmaster Tools</h2>
        <ol className="list-decimal pl-5 space-y-1.5" style={{ color: muted }}>
          <li>Open bing.com/webmasters and make sure {data.siteUrl} is added and verified.</li>
          <li>Settings → API access → copy the API key.</li>
          <li>Paste it in Coolify → Mushroom Identifiers → Environment Variables as BING_WEBMASTER_API_KEY, then redeploy.</li>
        </ol>
      </div>
    )
  }

  const site = data.site
  const daily = data.daily || []
  const max = Math.max(...daily.map((d) => d.clicks), 1)

  return (
    <div>
      {data.error && (
        <div className="rounded-xl border p-4 mb-6 text-sm break-words" style={{ background: dark ? 'rgba(239,68,68,0.1)' : '#fef2f2', borderColor: dark ? 'rgba(239,68,68,0.3)' : '#fecaca', color: dark ? '#fca5a5' : '#b91c1c' }}>
          {data.error} — check BING_WEBMASTER_API_KEY and that {data.siteUrl} is verified in Bing Webmaster Tools.
        </div>
      )}

      {site && (
        <div className="rounded-xl border p-5 mb-6 text-sm" style={{ background: cardBg, borderColor: cardBorder }}>
          <h2 className="font-semibold mb-3" style={{ color: text }}>Bing setup check</h2>
          <Check ok={site.inAccount} label={site.inAccount ? `${data.siteUrl} is in this Bing account` : `${data.siteUrl} is not in this Bing account`} />
          <Check ok={site.verified} label={site.verified ? 'Site verified' : 'Site not verified yet'} />
          <Check ok={site.sitemaps.length > 0} label={site.sitemaps.length ? `${site.sitemaps.length} sitemap(s) known to Bing` : 'No sitemap yet — use Indexing Report → Submit Sitemap'} />
          {site.sitemaps.map((f) => (
            <p key={f.url} className="text-xs mt-1 ml-6" style={{ color: muted }}>
              {f.url} — {f.status || 'pending'}, {f.urlCount} URLs{f.lastCrawled ? `, crawled ${f.lastCrawled}` : ''}
            </p>
          ))}
        </div>
      )}

      {data.connected && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Stat icon={MousePointerClick} label="Clicks" value={data.totals?.clicks ?? 0} dark={dark} />
            <Stat icon={Eye} label="Impressions" value={data.totals?.impressions ?? 0} dark={dark} />
            <Stat icon={Activity} label="CTR %" value={data.totals?.ctr ?? 0} dark={dark} />
          </div>

          <div className="rounded-xl border p-5 mb-6" style={{ background: cardBg, borderColor: cardBorder }}>
            <h2 className="font-semibold text-sm mb-4" style={{ color: text }}>Daily clicks — {periodLabel}</h2>
            {daily.length > 0 ? (
              <div className="flex items-end gap-[3px] h-44">
                {daily.map((d) => (
                  <div key={d.date} title={`${d.date}: ${d.clicks} clicks, ${d.impressions} impressions`} className="flex-1 rounded-t" style={{ height: `${Math.max((d.clicks / max) * 100, 3)}%`, background: d.clicks ? 'rgba(59,130,246,0.7)' : dark ? 'rgba(71,85,105,0.3)' : 'rgba(203,213,225,0.4)', minHeight: 2 }} />
                ))}
              </div>
            ) : (
              <p className="h-44 flex items-center justify-center text-sm" style={{ color: muted }}>No data for this period</p>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Table title="Top search keywords" rows={(data.topKeywords || []).map((r) => ({ ...r, label: r.keyword }))} dark={dark} />
            <Table title="Top search pages" rows={(data.topPages || []).map((r) => ({ ...r, label: r.page }))} dark={dark} />
          </div>
        </>
      )}
    </div>
  )
}

function Check({ ok, label }: { ok: boolean; label: string }) {
  const Icon = ok ? CheckCircle2 : XCircle
  return (
    <p className={`flex items-center gap-2 mb-1 ${ok ? 'text-emerald-500' : 'text-red-400'}`}>
      <Icon className="w-4 h-4 shrink-0" /> {label}
    </p>
  )
}

function Stat({ icon: Icon, label, value, dark }: { icon: any; label: string; value: number; dark: boolean }) {
  return (
    <div className="p-5 rounded-xl border" style={{ background: dark ? '#1e293b' : '#fff', borderColor: dark ? '#334155' : '#e2e8f0' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{label}</span>
        <Icon className="w-4 h-4 text-blue-400" />
      </div>
      <p className="text-2xl font-bold" style={{ color: dark ? '#fff' : '#0f172a' }}>{value.toLocaleString()}</p>
    </div>
  )
}

function Table({ title, rows, dark }: { title: string; rows: (Row & { label: string })[]; dark: boolean }) {
  const cardBorder = dark ? '#334155' : '#e2e8f0'
  const muted = dark ? '#94a3b8' : '#64748b'
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: dark ? '#1e293b' : '#fff', borderColor: cardBorder }}>
      <h2 className="px-5 py-4 font-semibold text-sm" style={{ color: dark ? '#fff' : '#0f172a', borderBottom: `1px solid ${cardBorder}` }}>{title}</h2>
      <div style={{ maxHeight: 480, overflowY: 'auto' }}>
        {rows.length > 0 ? (
          <table className="w-full text-xs">
            <thead>
              <tr style={{ color: muted }}>
                <th className="text-left px-5 py-2.5 font-medium">Name</th>
                <th className="text-right px-2 py-2.5 font-medium">Clicks</th>
                <th className="text-right px-2 py-2.5 font-medium">Impr.</th>
                <th className="text-right px-5 py-2.5 font-medium">Pos.</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} style={{ borderTop: `1px solid ${cardBorder}` }}>
                  <td className="px-5 py-2.5 truncate max-w-[220px]" style={{ color: dark ? '#fff' : '#0f172a' }}>{r.label}</td>
                  <td className="px-2 py-2.5 text-right text-emerald-500 font-semibold">{r.clicks.toLocaleString()}</td>
                  <td className="px-2 py-2.5 text-right" style={{ color: muted }}>{r.impressions.toLocaleString()}</td>
                  <td className="px-5 py-2.5 text-right" style={{ color: muted }}>{r.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-5 py-8 text-sm text-center" style={{ color: muted }}>No data yet</p>
        )}
      </div>
    </div>
  )
}
