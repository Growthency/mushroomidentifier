import type { Metadata } from 'next'
import Link from 'next/link'
import PremiumGate from '@/components/PremiumGate'
import BlogSidebar from '@/components/blog/BlogSidebar'
import AuthorBlock from '@/components/blog/AuthorBlock'
import ArticleViewCount from '@/components/blog/ArticleViewCount'
import QuizClient from './QuizClient'

export const metadata: Metadata = {
  title: 'Mushroom Identification Quiz — Test Your Fungi Knowledge | Mushroom Identifier',
  description:
    'Take our free mushroom identification quiz with 50 expert questions. Test your knowledge of toxic, edible, and look-alike mushroom species. 30-second timer per question!',
}

export default function MushroomQuizPage() {
  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-10 items-start">
          <article className="min-w-0 flex-1 max-w-4xl">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs mb-8 flex-wrap" style={{ color: 'var(--text-faint)' }}>
              <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:underline" style={{ color: 'var(--accent)' }}>Blog</Link>
              <span>/</span>
              <span>Mushroom Identification Quiz</span>
            </nav>

            {/* Category badges + Title */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                  Interactive Quiz
                </span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#f59e0b20', color: '#f59e0b' }}>
                  Premium
                </span>
              </div>
              <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                Mushroom Identification Quiz — 50 Expert Questions
              </h1>
              <AuthorBlock updatedAt="Apr 4, 2026" />
              <ArticleViewCount views={1540} className="mb-2" />
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Test your knowledge of mushroom identification with 50 expert-curated questions covering toxic species, edible mushrooms, look-alike dangers, and fungal anatomy. Each question has a 30-second timer. How well do you know your fungi?
              </p>
            </div>

            {/* Premium-gated quiz content */}
            <PremiumGate inline>
              <QuizClient />
            </PremiumGate>

          </article>
          <BlogSidebar />
        </div>
      </div>
    </div>
  )
}
