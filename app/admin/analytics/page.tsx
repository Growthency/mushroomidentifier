import { redirect } from 'next/navigation'

/**
 * /admin/analytics now redirects to /admin.
 *
 * The old analytics surface was promoted to the admin landing page and
 * the sidebar entry was renamed to "Dashboard". This redirect keeps any
 * older bookmarks working without showing a 404.
 */
export default function AnalyticsRedirect() {
  redirect('/admin')
}
