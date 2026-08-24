'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import AdifyProvider from '@/components/adify/AdifyProvider'
import AdSlot from '@/components/adify/AdSlot'
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
    <AdifyProvider>
      <Navbar menuItems={menus?.header} />
      {/* Adify — header strip (below the navbar; follows scroll when the
          unit's admin-controlled Sticky flag is on) */}
      <AdSlot placement="header" className="px-4" allowSticky />
      <main>{children}</main>
      {/* Adify — footer strip (above the site footer) */}
      <AdSlot placement="footer" className="px-4" />
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
      {/* Adify — sticky bottom anchor (dismissible) */}
      <AdSlot placement="sticky" />
    </AdifyProvider>
  )
}
