'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import type { MenuGroups } from '@/lib/menus'

export default function LayoutShell({
  children,
  menus,
}: {
  children: React.ReactNode
  menus?: MenuGroups
}) {
  const pathname = usePathname()
  const hideShell = pathname?.startsWith('/dashboard') || pathname?.startsWith('/search-results') || pathname?.startsWith('/admin')

  if (hideShell) return <main>{children}</main>

  return (
    <>
      <Navbar menuItems={menus?.header} />
      <main>{children}</main>
      <Footer
        footerExplore={menus?.footerExplore}
        footerCompany={menus?.footerCompany}
        footerBottom={menus?.footerBottom}
      />
    </>
  )
}
