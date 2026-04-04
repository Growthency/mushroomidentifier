import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - Mushroom Identifier | AI Identification Credits & Plans',
  description:
    'Choose a mushroom identification plan that fits your needs. Get accurate AI-powered mushroom identification by photo — credits never expire, 3 free scans daily with no signup.',
  alternates: {
    canonical: 'https://mushroomidentifiers.com/pricing',
  },
  openGraph: {
    title: 'Pricing - Mushroom Identifier | AI Identification Credits & Plans',
    description:
      'Choose a mushroom identification plan that fits your needs. Get accurate AI-powered mushroom identification by photo — credits never expire, 3 free scans daily with no signup.',
    url: 'https://mushroomidentifiers.com/pricing',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
