export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
// next/image no longer needed here — featured-image hero was removed
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ArrowRight } from 'lucide-react'
import AuthorBlock from '@/components/blog/AuthorBlock'
import BlogSidebar from '@/components/blog/BlogSidebar'
import BlogComments from '@/components/blog/BlogComments'
import LiveViewCount from '@/components/blog/LiveViewCount'
import ArticleContent from '@/components/blog/ArticleContent'
import PremiumGate from '@/components/PremiumGate'
import ViewTracker from '@/components/blog/ViewTracker'
import { BLOG_HIDDEN_SLUGS } from '@/lib/blog-hidden-slugs'

/* ── Supabase admin client — no-store ensures deleted posts return 404 immediately ── */
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { global: { fetch: (url: any, init: any) => fetch(url, { ...init, cache: 'no-store' }) } }
  )
}

/* ── Strip inline styles from rich-editor HTML so Tailwind prose classes apply ── */
function stripInlineStyles(html: string): string {
  return html
    // Remove all style="..." attributes (handles single and double quotes)
    .replace(/\s*style="[^"]*"/gi, '')
    .replace(/\s*style='[^']*'/gi, '')
}

/* ── Fetch one post by slug ── */
async function getPost(slug: string) {
  const supabase = getSupabase()
  const fullSlug = slug.startsWith('/') ? slug : `/${slug}`
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', fullSlug)
    .eq('status', 'published')
    .single()
  return data
}

/* ── Fetch related posts (same category preferred, else random published) ── */
async function getRelatedPosts(currentSlug: string, category?: string) {
  const supabase = getSupabase()
  const fullSlug = currentSlug.startsWith('/') ? currentSlug : `/${currentSlug}`

  // Helper: drop policy / meta posts so they don't appear as "related"
  // alongside species + foraging articles. Pull a few extras then filter
  // so the visible count still hits the cap of 3.
  const stripHidden = (rows: any[] | null | undefined) =>
    (rows ?? []).filter((p) => !BLOG_HIDDEN_SLUGS.has(p.slug)).slice(0, 3)

  // Try same category first
  if (category) {
    const { data } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, featured_image, category, risk_level')
      .eq('status', 'published')
      .eq('category', category)
      .neq('slug', fullSlug)
      .order('published_at', { ascending: false })
      .limit(6) // pull extra so we still fill 3 after filtering
    const visible = stripHidden(data)
    if (visible.length >= 2) return visible
  }

  // Fallback: any published posts
  const { data } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, featured_image, category, risk_level')
    .eq('status', 'published')
    .neq('slug', fullSlug)
    .order('published_at', { ascending: false })
    .limit(6)
  return stripHidden(data)
}

/* ── Dynamic metadata for SEO ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Not Found' }
  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt || ''
  const url = `https://mushroomidentifiers.com${post.slug}`
  const image = post.featured_image
    ? { url: `https://mushroomidentifiers.com${post.featured_image}`, width: 1200, height: 630 }
    : null

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at || post.published_at || post.created_at,
      images: image ? [image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image.url] : [],
    },
  }
}

/* ── Page component ── */
export default async function DynamicPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const relatedPosts = await getRelatedPosts(slug, post.category)

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Draft'

  /* Build Article schema */
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.meta_title || post.title,
        description: post.meta_description || post.excerpt || '',
        image: post.featured_image
          ? `https://mushroomidentifiers.com${post.featured_image}`
          : undefined,
        author: {
          '@type': 'Organization',
          name: 'Mushroom Identifiers',
          url: 'https://mushroomidentifiers.com/',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Mushroom Identifiers',
          url: 'https://mushroomidentifiers.com/',
        },
        mainEntityOfPage: `https://mushroomidentifiers.com${post.slug}`,
        datePublished: post.published_at || post.created_at,
        dateModified: post.updated_at || post.published_at || post.created_at,
        ...(post.is_premium && { isAccessibleForFree: false }),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mushroomidentifiers.com/' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://mushroomidentifiers.com/blog' },
          { '@type': 'ListItem', position: 3, name: post.title },
        ],
      },
    ],
  }

  const articleContentClasses = `rich-content prose prose-sm sm:prose-base max-w-none
    prose-headings:font-playfair prose-headings:font-bold
    prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-10 prose-h2:mb-4
    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
    prose-p:leading-relaxed prose-p:mb-4
    prose-li:leading-relaxed
    prose-a:font-medium prose-a:no-underline hover:prose-a:underline
    prose-img:rounded-xl prose-img:mx-auto prose-img:max-w-full prose-img:h-auto
    prose-table:text-sm prose-table:w-full prose-table:border-collapse
    prose-th:p-3 prose-th:text-left prose-td:p-3
    prose-blockquote:rounded-xl prose-blockquote:px-5 prose-blockquote:py-3
    prose-pre:rounded-xl prose-pre:p-4
    prose-hr:my-8`

  const articleContentStyles = {
    color: 'var(--text-muted)',
    ['--tw-prose-headings' as string]: 'var(--text-primary)',
    ['--tw-prose-links' as string]: 'var(--accent)',
    ['--tw-prose-bold' as string]: 'var(--text-primary)',
    ['--tw-prose-bullets' as string]: 'var(--accent)',
    ['--tw-prose-counters' as string]: 'var(--accent)',
    ['--tw-prose-th-borders' as string]: 'var(--border)',
    ['--tw-prose-td-borders' as string]: 'var(--border)',
    ['--tw-prose-hr' as string]: 'var(--border)',
    ['--tw-prose-quote-borders' as string]: 'var(--accent)',
    ['--tw-prose-code' as string]: 'var(--accent)',
    ['--tw-prose-pre-bg' as string]: 'var(--bg-secondary)',
    ['--tw-prose-pre-code' as string]: 'var(--text-muted)',
  }

  // Per-post custom JSON-LD schema overrides the default Article + BreadcrumbList
  // schema. Only ONE <script type="application/ld+json"> is ever rendered so we
  // never accidentally emit duplicates (which Google flags as a structured-data
  // error). Admins can paste FAQPage, HowTo, Recipe, Product, etc. schema and it
  // replaces the auto-generated Article schema for this single page.
  let schemaToRender: string
  if (post.custom_schema && post.custom_schema.trim()) {
    try {
      // Re-stringify so whitespace is normalized and any parse errors are caught
      // at render-time rather than shipping broken JSON to Google.
      schemaToRender = JSON.stringify(JSON.parse(post.custom_schema))
    } catch {
      // Invalid JSON — fall back to default so the page still gets valid schema.
      schemaToRender = JSON.stringify(schemaData)
    }
  } else {
    schemaToRender = JSON.stringify(schemaData)
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToRender }}
      />

      {/* Per-post custom CSS from the editor's "Custom CSS" sidebar field.
          Injected inline after global CSS so author rules take precedence —
          same model as WordPress's Additional CSS. */}
      {post.custom_css && (
        <style
          data-post-custom-css={post.slug}
          dangerouslySetInnerHTML={{ __html: post.custom_css }}
        />
      )}

      <div
        className="min-h-screen pt-24 pb-20"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`flex gap-10 items-start${post.layout === 'full-page' ? ' justify-center' : ''}`}>
            <article className={`min-w-0 flex-1 ${post.layout === 'full-page' ? 'max-w-5xl mx-auto' : 'max-w-4xl'}`}>
              {/* Breadcrumb */}
              <nav
                className="flex items-center gap-2 text-xs mb-8 flex-wrap"
                style={{ color: 'var(--text-faint)' }}
              >
                <Link
                  href="/"
                  className="hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  Home
                </Link>
                <span>/</span>
                <Link
                  href="/blog"
                  className="hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  Blog
                </Link>
                <span>/</span>
                <span>{post.title}</span>
              </nav>

              {/* Badges */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.category && (
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: 'var(--accent-bg)',
                        color: 'var(--accent)',
                      }}
                    >
                      {post.category}
                    </span>
                  )}
                  {post.risk_level && post.risk_level !== 'General' && (
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background:
                          post.risk_level === 'Toxic'
                            ? '#ef444420'
                            : post.risk_level === 'High Risk'
                            ? '#f9731620'
                            : '#22c55e20',
                        color:
                          post.risk_level === 'Toxic'
                            ? '#ef4444'
                            : post.risk_level === 'High Risk'
                            ? '#f97316'
                            : '#22c55e',
                      }}
                    >
                      {post.risk_level}
                    </span>
                  )}
                  {post.is_premium && (
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: '#eab30820', color: '#eab308' }}
                    >
                      Premium
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1
                  className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {post.title}
                </h1>

                <AuthorBlock updatedAt={publishedDate} />
                <LiveViewCount slug={post.slug} className="mb-2" />
                {/* Excerpt + featured-image hero intentionally removed
                    from the individual article page — both were
                    duplicating the article's own opening paragraph and
                    inline images. The blog listing card still uses
                    excerpt + featured_image (those are admin-managed and
                    auto-derived from content where empty). */}
              </div>

              {/* ── Main Content (HTML from rich editor) + auto TOC ── */}
              {post.is_premium ? (
                <PremiumGate inline>
                  <ArticleContent
                    html={stripInlineStyles(post.content || '')}
                    className={articleContentClasses}
                    style={articleContentStyles}
                  />
                </PremiumGate>
              ) : (
                <ArticleContent
                  html={stripInlineStyles(post.content || '')}
                  className={articleContentClasses}
                  style={articleContentStyles}
                />
              )}

              <hr
                className="my-10 border-0 border-t"
                style={{ borderColor: 'var(--border)' }}
              />

              <ViewTracker slug={post.slug} />
              <BlogComments slug={post.slug} />

              {/* Related Articles */}
              {relatedPosts.length > 0 && (
                <div className="mt-16 pt-12 not-prose" style={{ borderTop: '2px solid var(--border)' }}>
                  <div className="flex items-center gap-3 mb-8">
                    <div
                      className="w-1 h-8 rounded-full flex-shrink-0"
                      style={{ background: 'var(--accent)' }}
                    />
                    <div
                      className="font-playfair font-bold"
                      style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.5rem, 3vw, 1.875rem)' }}
                    >
                      Related Articles
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {relatedPosts.map((article: any) => {
                      const riskColor = article.risk_level === 'Deadly' || article.risk_level === 'Toxic'
                        ? '#ef4444'
                        : article.risk_level === 'High Risk'
                        ? '#f97316'
                        : '#7ec88a'
                      return (
                        <Link
                          key={article.slug}
                          href={article.slug}
                          className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            textDecoration: 'none',
                            boxShadow: '0 2px 12px var(--shadow)',
                          }}
                        >
                          <div
                            className="relative flex-shrink-0 overflow-hidden"
                            style={{ height: '180px', background: 'var(--bg-secondary)' }}
                          >
                            {article.featured_image && (
                              <img
                                src={article.featured_image}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            )}
                            {article.risk_level && article.risk_level !== 'General' && (
                              <span
                                className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                                style={{ background: riskColor }}
                              >
                                {article.risk_level}
                              </span>
                            )}
                            {article.category && (
                              <span
                                className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold"
                                style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(4px)' }}
                              >
                                {article.category}
                              </span>
                            )}
                          </div>

                          <div className="p-4 flex flex-col flex-1">
                            <div
                              className="font-playfair text-base font-bold mb-2 leading-snug line-clamp-2"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {article.title}
                            </div>
                            {article.excerpt && (
                              <p
                                className="text-xs leading-relaxed flex-1 line-clamp-2 mb-3"
                                style={{ color: 'var(--text-muted)' }}
                              >
                                {article.excerpt}
                              </p>
                            )}
                            <div
                              className="flex items-center gap-1 text-xs font-semibold mt-auto transition-gap group-hover:gap-2"
                              style={{ color: 'var(--accent)' }}
                            >
                              Read Article <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar — hidden for full-page layout */}
            {post.layout !== 'full-page' && <BlogSidebar />}
          </div>
        </div>
      </div>
    </>
  )
}
