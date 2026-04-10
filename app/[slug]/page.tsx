import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import AuthorBlock from '@/components/blog/AuthorBlock'
import BlogSidebar from '@/components/blog/BlogSidebar'
import BlogComments from '@/components/blog/BlogComments'
import ArticleViewCount from '@/components/blog/ArticleViewCount'

/* ── Supabase admin client (service role reads all rows including drafts for preview) ── */
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
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

/* ── Dynamic metadata for SEO ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || '',
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || '',
      images: post.featured_image ? [post.featured_image] : [],
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

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Draft'

  /* Build Article + FAQ schema */
  const schemaData: Record<string, unknown> = {
    '@context': 'https://schema.org',
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
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div
        className="min-h-screen pt-24 pb-20"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-10 items-start">
            <article className="min-w-0 flex-1 max-w-4xl">
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
                <ArticleViewCount views={post.views || 0} className="mb-2" />

                {/* Excerpt */}
                {post.excerpt && (
                  <p
                    className="text-base leading-relaxed mt-4"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {post.excerpt}
                  </p>
                )}
              </div>

              {/* Featured Image */}
              {post.featured_image && (
                <figure
                  className="mb-10 rounded-2xl overflow-hidden"
                  style={{ border: '1px solid var(--border)' }}
                >
                  <div className="relative w-full" style={{ maxHeight: '480px' }}>
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      width={800}
                      height={530}
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="w-full object-cover"
                      style={{
                        maxHeight: '480px',
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                      priority
                    />
                  </div>
                </figure>
              )}

              {/* ── Main Content (HTML from rich editor) ── */}
              <div
                className="rich-content prose prose-sm sm:prose-base max-w-none
                  prose-headings:font-playfair prose-headings:font-bold
                  prose-h1:text-2xl prose-h1:md:text-3xl prose-h1:mt-8 prose-h1:mb-4
                  prose-h2:text-xl prose-h2:md:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-lg prose-h3:md:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:leading-relaxed prose-p:mb-4
                  prose-li:leading-relaxed
                  prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl prose-img:mx-auto prose-img:max-w-full prose-img:h-auto
                  prose-table:text-sm prose-table:w-full prose-table:border-collapse
                  prose-th:p-3 prose-th:text-left prose-td:p-3
                  prose-blockquote:rounded-xl prose-blockquote:px-5 prose-blockquote:py-3
                  prose-pre:rounded-xl prose-pre:p-4
                  prose-hr:my-8
                "
                style={{
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
                }}
                dangerouslySetInnerHTML={{ __html: stripInlineStyles(post.content || '') }}
              />

              <hr
                className="my-10 border-0 border-t"
                style={{ borderColor: 'var(--border)' }}
              />

              <BlogComments slug={post.slug} />
            </article>

            {/* Sidebar */}
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
