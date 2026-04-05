import './globals.css'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import LayoutShell from '@/components/layout/LayoutShell'
import ScrollToTop from '@/components/ui/ScrollToTop'

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
  title: 'Mushroom Identifier - Fast Mushroom Identification App by Picture',
  description: 'Use our Free mushroom identifier by photo for fast mushrooms identification, accurate results with advanced mushroom identifier AI. Upload clear images from multiple angles to instantly identify fungi, detect key features, and receive toxicity warnings plus similar species alerts through our free mushroom identifier app.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍄</text></svg>',
  },
  openGraph: {
    title: 'Mushroom Identifier - Fast Mushroom Identification App by Picture',
    description: 'Use our Free mushroom identifier by photo for fast mushrooms identification, accurate results with advanced mushroom identifier AI. Upload clear images from multiple angles to instantly identify fungi, detect key features, and receive toxicity warnings plus similar species alerts through our free mushroom identifier app.',
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
    title: 'Mushroom Identifier - Fast Mushroom Identification App by Picture',
    description: 'Use our Free mushroom identifier by photo for fast mushrooms identification, accurate results with advanced mushroom identifier AI. Upload clear images from multiple angles to instantly identify fungi, detect key features, and receive toxicity warnings plus similar species alerts through our free mushroom identifier app.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="dipMWRMeOiWrrLH32OCvAQS-wR14IzCVSCLFUt9mH-0" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍄</text></svg>" />
        {/* Hint browser to give max priority to the critical CSS chunk on the critical path */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Inline theme script — runs synchronously before any paint to prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('mi-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();` }} />
        {/* Site-wide identity schema only — page-specific schemas live in each page component */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://mushroomidentifiers.com/#organization",
                  "name": "Mushroom Identifier",
                  "url": "https://mushroomidentifiers.com/",
                  "email": "support@mushroomidentifiers.com",
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
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <LayoutShell>{children}</LayoutShell>
          <ScrollToTop />
        </ThemeProvider>

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
      </body>
    </html>
  )
}
