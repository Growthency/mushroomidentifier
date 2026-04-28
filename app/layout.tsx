import './globals.css'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import LayoutShell from '@/components/layout/LayoutShell'
import ScrollToTop from '@/components/ui/ScrollToTop'
import { getEnabledScripts, groupByPosition } from '@/lib/site-scripts'
import { getMenus } from '@/lib/menus'
import { getSiteContent } from '@/lib/site-content'
import { buildThemeCSS } from '@/lib/theme-colors'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['700'],          // only weight used in headings — 2 files instead of 6
})

export const metadata: Metadata = {
  metadataBase: new URL('https://mushroomidentifiers.com'),
  title: 'Mushroom Identifier - Free Mushroom Identification App by Picture',
  description: 'Is it poisonous? Our free mushroom identification app tells you in seconds! AI mushroom identifier for 10,000+ species. Upload a photo, know instantly 🍄',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Mushroom Identifier - Free Mushroom Identification App by Picture',
    description: 'Is it poisonous? Our free mushroom identification app tells you in seconds! AI mushroom identifier for 10,000+ species. Upload a photo, know instantly 🍄',
    url: 'https://mushroomidentifiers.com',
    siteName: 'Mushroom Identifier',
    type: 'website',
    images: [
      {
        url: 'https://mushroomidentifiers.com/mushroom-fungi-identifier.webp',
        width: 1200,
        height: 630,
        alt: 'Mushroom Identifier - Free AI Fungi Identification Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mushroom Identifier - Free Mushroom Identification App by Picture',
    description: 'Is it poisonous? Our free mushroom identification app tells you in seconds! AI mushroom identifier for 10,000+ species. Upload a photo, know instantly 🍄',
    images: ['https://mushroomidentifiers.com/mushroom-fungi-identifier.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://mushroomidentifiers.com',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch admin-managed scripts (Google Analytics, Search Console, Meta Pixel, etc.)
  const siteScripts = await getEnabledScripts()
  const { head: headScripts, bodyStart: bodyStartScripts, bodyEnd: bodyEndScripts } = groupByPosition(siteScripts)

  // Fetch admin-managed header + footer menu items
  const menus = await getMenus()

  // Fetch admin-managed site content (logo, brand, CTA, social icons, payment badges, etc.)
  const siteContent = await getSiteContent()

  // Build admin-managed theme-color overrides (<style> block that wins over globals.css)
  const themeCSS = buildThemeCSS(siteContent.settings)

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="dipMWRMeOiWrrLH32OCvAQS-wR14IzCVSCLFUt9mH-0" />
        {/* Bing Webmaster Tools — hardcoded so the verifier sees it before <body>.
            (Admin Header Scripts wraps in a <span>, which browsers move out of <head>,
             causing Bing's "tag not found before <body>" error.) */}
        <meta name="msvalidate.01" content="0C530F1527CEB9BE4C78DF0D4F59A866" />
        {/* RSS Feed for search engine auto-discovery */}
        <link rel="alternate" type="application/rss+xml" title="Mushroom Identifiers RSS Feed" href="/feed.xml" />
        {/* Preconnect to external origins — saves DNS+TCP+TLS time */}
        <link rel="preconnect" href="https://i.pravatar.cc" />
        <link rel="dns-prefetch" href="https://i.pravatar.cc" />
        <link rel="dns-prefetch" href="https://analytics.ahrefs.com" />
        {/* Hint browser to give max priority to the critical CSS chunk on the critical path */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Critical inline CSS — paints body background instantly, before
            globals.css finishes downloading. Without this, every full-page
            load (including admin → homepage navigation) flashes a white
            screen for the few hundred ms it takes the external CSS chunk
            to land. The colors mirror --body-bg in globals.css. */}
        <style dangerouslySetInnerHTML={{ __html: `html,body{margin:0;padding:0;background:linear-gradient(145deg,#eaf8f2 0%,#e3ecf8 42%,#f2e9f9 73%,#f8f0e5 100%);color:#0b1912;min-height:100vh}html[data-theme="dark"],html[data-theme="dark"] body{background:linear-gradient(145deg,#0b1912 0%,#0d1623 43%,#190e28 73%,#0b1912 100%);color:#eaf8f2}` }} />
        {/* Inline theme script — defaults to light (public site only has
            light mode). Still honours a previously-saved dark preference
            so admins don't get flipped mid-session. Runs synchronously
            before any paint to prevent flash of wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('mi-theme');document.documentElement.setAttribute('data-theme',(t==='light'||t==='dark')?t:'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();` }} />
        {/* Site-wide identity schema — single Organization + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://mushroomidentifiers.com/#organization",
                  "name": "Mushroom Identifiers",
                  "url": "https://mushroomidentifiers.com/",
                  "logo": "https://mushroomidentifiers.com/logo-512.png",
                  "email": "support@mushroomidentifiers.com",
                  "description": "AI-powered mushroom identification app. Upload photos for instant fungi identification, toxicity warnings, and species guides.",
                  "sameAs": [
                    "https://www.instagram.com/mushroomidentifiers/",
                    "https://x.com/MIdentifiers",
                    "https://www.facebook.com/mushroomidentifiers/",
                    "https://www.linkedin.com/company/mushroom-identifiers/"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://mushroomidentifiers.com/#website",
                  "url": "https://mushroomidentifiers.com/",
                  "name": "Mushroom Identifier",
                  "description": "Free mushroom identifier tool to identify fungi by picture using AI and image recognition.",
                  "publisher": { "@id": "https://mushroomidentifiers.com/#organization" }
                }
              ]
            })
          }}
        />
        {/* Admin-managed scripts — <head> position (GA, Search Console, Meta Pixel init, etc.) */}
        {headScripts.map((s) => (
          <span key={s.id} dangerouslySetInnerHTML={{ __html: s.code }} />
        ))}
        {/* Admin-managed theme colors — overrides CSS variables from globals.css per data-theme */}
        {themeCSS && (
          <style
            data-site-theme-colors=""
            dangerouslySetInnerHTML={{ __html: themeCSS }}
          />
        )}
        {/* Admin-managed global Custom CSS — injected LAST so rules win by source-order specificity (WordPress "Additional CSS" behavior) */}
        {siteContent.settings.global_custom_css && (
          <style
            data-site-custom-css=""
            dangerouslySetInnerHTML={{ __html: siteContent.settings.global_custom_css }}
          />
        )}
      </head>
      <body suppressHydrationWarning>
        {/* Admin-managed scripts — body start (GTM noscript, etc.) */}
        {bodyStartScripts.map((s) => (
          <span key={s.id} dangerouslySetInnerHTML={{ __html: s.code }} />
        ))}

        <ThemeProvider>
          <LayoutShell menus={menus} siteContent={siteContent}>{children}</LayoutShell>
          <ScrollToTop />
        </ThemeProvider>

        {/* Ahrefs Web Analytics */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="RrRJnzuHOLbcnlHd/xuO9g"
          strategy="lazyOnload"
        />

        {/* Google Analytics — lazyOnload so it never blocks main thread */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-X00VE6WCX6"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X00VE6WCX6');
          `}
        </Script>

        {/* Admin-managed scripts — body end (chat widgets, deferred analytics, etc.) */}
        {bodyEndScripts.map((s) => (
          <span key={s.id} dangerouslySetInnerHTML={{ __html: s.code }} />
        ))}
      </body>
    </html>
  )
}
