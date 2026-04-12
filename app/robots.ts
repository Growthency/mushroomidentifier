import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/admin', '/api/', '/login', '/signup', '/checkout/', '/account/'],
      },
    ],
    sitemap: 'https://mushroomidentifiers.com/sitemap.xml',
    host: 'https://mushroomidentifiers.com',
  }
}
