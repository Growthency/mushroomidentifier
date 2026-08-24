import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { isAdminEmail } from '@/lib/admin'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return null
  return user
}

/** Build an Adsterra "iframe" snippet VERBATIM (never modified). */
function adsterra(key: string, width: number, height: number): string {
  return `<script>
  atOptions = {
    'key' : '${key}',
    'format' : 'iframe',
    'height' : ${height},
    'width' : ${width},
    'params' : {}
  };
</script>
<script src="https://beseechpositiverightful.com/${key}/invoke.js"></script>`
}

/**
 * The 5 Adsterra units from the account, each mapped to an optimal placement.
 * Devices are chosen so wide desktop banners never overflow a phone and the
 * narrow anchor/rectangle carry mobile.
 */
const SEED = [
  {
    name: 'Leaderboard 728×90 — Header',
    code: adsterra('54f214214a733d10127ed0028c035945', 728, 90),
    width: 728, height: 90,
    placement: 'header',
    page_types: ['all'],
    show_desktop: true, show_mobile: false,
    sort_order: 1,
  },
  {
    name: 'Rectangle 300×250 — In-content',
    code: adsterra('8927ad05987862ccbe851574bc876df5', 300, 250),
    width: 300, height: 250,
    placement: 'in_content',
    paragraph_number: 3,
    page_types: ['all'],
    show_desktop: true, show_mobile: true,
    sort_order: 2,
  },
  {
    name: 'Half-page 160×300 — Sidebar',
    code: adsterra('c3c3d5336e0a18ce8a47bd82b7743ccd', 160, 300),
    width: 160, height: 300,
    placement: 'sidebar',
    page_types: ['all'],
    show_desktop: true, show_mobile: false,
    sort_order: 3,
  },
  {
    name: 'Banner 468×60 — End of article',
    code: adsterra('801e71cf06ce179334e3163f547e8c6c', 468, 60),
    width: 468, height: 60,
    placement: 'content_bottom',
    page_types: ['all'],
    show_desktop: true, show_mobile: false,
    sort_order: 4,
  },
  {
    name: 'Mobile Anchor 320×50 — Sticky',
    code: adsterra('68a3222edb2024bb4b000dc32e146b2a', 320, 50),
    width: 320, height: 50,
    placement: 'sticky',
    page_types: ['all'],
    show_desktop: false, show_mobile: true,
    sort_order: 5,
  },
]

// POST — seed the default Adsterra units (only when none exist yet).
export async function POST() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { count, error: countErr } = await admin
    .from('ad_units')
    .select('id', { count: 'exact', head: true })

  if (countErr) return NextResponse.json({ error: countErr.message }, { status: 500 })

  if ((count ?? 0) > 0) {
    return NextResponse.json({
      seeded: false,
      message: `You already have ${count} ad unit(s). Quick Setup only runs on an empty list — add or edit units manually instead.`,
    })
  }

  const rows = SEED.map((s) => ({
    name: s.name,
    code: s.code,
    width: s.width,
    height: s.height,
    placement: s.placement,
    paragraph_number: s.paragraph_number ?? 3,
    page_types: s.page_types,
    show_desktop: s.show_desktop,
    show_mobile: s.show_mobile,
    lazy_load: true,
    enabled: true,
    sort_order: s.sort_order,
  }))

  const { data, error } = await admin.from('ad_units').insert(rows).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    seeded: true,
    count: data?.length ?? 0,
    message: `Seeded ${data?.length ?? 0} Adsterra ad units across optimal placements.`,
  })
}
