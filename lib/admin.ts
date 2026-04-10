// Admin access control
// Only these emails can access /admin routes

const ADMIN_EMAILS = [
  'itsinjamul@gmail.com',
]

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
