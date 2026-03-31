import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/api/'],
      },
    ],
    sitemap: 'https://mushroomidentifiers.com/sitemap.xml',
    host: 'https://mushroomidentifiers.com',
  }
}
