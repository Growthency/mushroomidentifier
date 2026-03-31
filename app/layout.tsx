import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/ui/ScrollToTop'

export const metadata: Metadata = {
  title: 'Mushroom Identifier - Free Fungi Identification Tool By Picture',
  description: 'Free Mushroom Identifier tool to identify wild fungi by picture. Upload a photo to detect mushroom species using AI image recognition and a detailed mushroom ID chart.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍄</text></svg>',
  },
  openGraph: {
    title: 'Mushroom Identifier - Free Fungi Identification Tool By Picture',
    description: 'Free Mushroom Identifier tool to identify wild fungi by picture. Upload a photo to detect mushroom species using AI image recognition and a detailed mushroom ID chart.',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mushroom Identifier - Free Fungi Identification Tool By Picture',
    description: 'Free Mushroom Identifier tool to identify wild fungi by picture. Upload a photo to detect mushroom species using AI image recognition and a detailed mushroom ID chart.',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="dipMWRMeOiWrrLH32OCvAQS-wR14IzCVSCLFUt9mH-0" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍄</text></svg>" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-X00VE6WCX6"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-X00VE6WCX6');
            `,
          }}
        />
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
          <Navbar />
          <main>{children}</main>
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
