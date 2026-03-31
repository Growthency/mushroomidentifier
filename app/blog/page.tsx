import type { Metadata } from 'next'
import BlogPageClient from './BlogPageClient'

export const metadata: Metadata = {
  title: 'Blog | Mushroom Identifier',
  description: 'Expert guides, safety tips, regional foraging insights, and AI-powered mushroom identification knowledge from our mycology experts.',
}

export default function BlogPage() {
  return <BlogPageClient />
}
