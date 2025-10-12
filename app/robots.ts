import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/ahnaf/', '/api/'],
    },
    sitemap: 'https://paperpatch.vercel.app/sitemap.xml',
  }
}
