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
                  "email": "support@mushroomidentifiers.com"
                },
                {
                  "@type": "WebSite",
                  "@id": "https://mushroomidentifiers.com/#website",
                  "url": "https://mushroomidentifiers.com/",
                  "name": "Mushroom Identifier",
                  "description": "Free mushroom identifier tool to identify fungi by picture using AI and image recognition.",
                  "publisher": { "@id": "https://mushroomidentifiers.com/#organization" }
                },
                {
                  "@type": "WebApplication",
                  "@id": "https://mushroomidentifiers.com/#app",
                  "name": "Mushroom Identifier",
                  "url": "https://mushroomidentifiers.com/",
                  "applicationCategory": "EducationalApplication",
                  "operatingSystem": "All",
                  "description": "AI mushroom identifier to identify wild mushrooms by picture using computer vision, cap, gills, pores, stem, and habitat analysis.",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "ratingCount": "128"
                  },
                  "publisher": { "@id": "https://mushroomidentifiers.com/#organization" }
                },
                {
                  "@type": "Article",
                  "@id": "https://mushroomidentifiers.com/#article",
                  "headline": "Mushroom Identifier - Free Fungi Identification Tool by Picture",
                  "description": "Identify mushrooms by picture using AI. Upload photos to detect fungal species, gills, pores, and habitat instantly.",
                  "author": {
                    "@type": "Organization",
                    "name": "Mushroom Identifier",
                    "url": "https://mushroomidentifiers.com/"
                  },
                  "publisher": { "@id": "https://mushroomidentifiers.com/#organization" },
                  "mainEntityOfPage": "https://mushroomidentifiers.com/"
                },
                {
                  "@type": "BreadcrumbList",
                  "@id": "https://mushroomidentifiers.com/#breadcrumbs",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": "https://mushroomidentifiers.com/"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Mushroom Identifier",
                      "item": "https://mushroomidentifiers.com/mushrooms/"
                    }
                  ]
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://mushroomidentifiers.com/#faq",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What type of mushroom is this?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Observe cap shape, gills, pores, stem, and habitat. A mushroom identifier uses AI to compare these traits with fungal species."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How does a mushroom identifier work?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "It uses AI and computer vision to analyze mushroom images and match cap, gills, pores, and stem with labeled fungal databases."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Is there a free mushroom identifier app?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, this is a free web-based mushroom identifier that works in your browser without installation."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Can a wild mushroom be identified from a picture?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, AI analyzes cap texture, gill pattern, stem, and habitat, but results should be verified by a mycologist."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Can a mushroom identifier tell if a mushroom is edible?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "No, it suggests species only. Toxic mushrooms like Amanita phalloides can resemble edible ones."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Why does habitat matter in mushroom identification?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Fungi grow in specific environments like soil, moss, hardwood, or conifer wood, helping narrow species identification."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Do I need to create an account?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "No, the tool works instantly without signup."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How does the AI identify mushrooms?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "It uses machine learning on fungal images to analyze cap, gills, stem, and habitat for species matching."
                      }
                    }
                  ]
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
