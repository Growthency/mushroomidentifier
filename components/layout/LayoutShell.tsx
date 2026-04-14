'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import type { MenuGroups } from '@/lib/menus'
import type { SiteContent } from '@/lib/site-content'

export default function LayoutShell({
  children,
  menus,
  siteContent,
}: {
  children: React.ReactNode
  menus?: MenuGroups
  siteContent?: SiteContent
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
        settings={siteContent?.settings}
        socialLinks={siteContent?.socialLinks}
        paymentMethods={siteContent?.paymentMethods}
        exploreBadges={siteContent?.footerBadges.footerExplore}
        companyBadges={siteContent?.footerBadges.footerCompany}
      />
    </>
  )
}
