import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const ALL_ARTICLES = [
  {
    slug: '/why-are-mushrooms-growing-in-my-yard',
    title: 'Why Are Mushrooms Growing in My Yard? (Expert Investigation Guide)',
    excerpt: 'Mushrooms grow in your yard because underground fungi (mycelium) are actively breaking down organic matter in moist, shaded soil.',
    image: '/why-are-mushrooms-growing-in-my-yard-fairy-ring-lawn.webp',
    category: 'Yard Guide',
    risk: 'General',
    riskColor: '#7ec88a',
  },
  {
    slug: '/how-to-get-rid-of-mushrooms-in-grass',
    title: 'How Do I Get Rid of Mushrooms in My Grass? (Complete Lawn Guide)',
    excerpt: 'Remove lawn mushrooms fast by fixing moisture, drainage, and organic matter. Full step-by-step guide to stop mushrooms coming back.',
    image: '/how-to-get-rid-of-mushrooms-in-grass-fairy-ring-lawn.webp',
    category: 'Lawn Guide',
    risk: 'General',
    riskColor: '#7ec88a',
  },
  {
    slug: '/mushroom-identifier-book',
    title: 'Mushroom Identifier Book: Best Field Guides, Edible Mushroom Books & Foraging Resources',
    excerpt: 'A mushroom identifier book helps you recognize fungi by cap shape, gills, habitat, season and spore print. Find the best field guide for your skill level.',
    image: '/mushroom-identifier-book-chanterelle-cantharellus-cibarius.webp',
    category: 'Guide',
    risk: 'General',
    riskColor: '#7ec88a',
  },
  {
    slug: '/amanita-phalloides-death-cap',
    title: 'Amanita phalloides (Death Cap): Identification, Features, Habitat & Safety Guide',
    excerpt: 'Learn death cap identification by cap color, white gills, ring, volva, and habitat. One of the world\'s most dangerous toxic mushrooms.',
    image: '/amanita-phalloides-death-cap-identification.webp',
    category: 'Safety',
    risk: 'Deadly',
    riskColor: '#ef4444',
  },
  {
    slug: '/death-cap-vs-destroying-angel',
    title: 'Death Cap vs Destroying Angel: Key Differences, Identification & Safety Guide',
    excerpt: 'Compare Death Cap and Destroying Angel side-by-side by cap, gills, volva, habitat, toxicity and look-alikes to stay safe in the wild.',
    image: '/death-cap-vs-destroying-angel-comparison.webp',
    category: 'Safety',
    risk: 'Toxic',
    riskColor: '#ef4444',
  },
  {
    slug: '/mushroom-parts-explained',
    title: 'Mushroom Parts Explained: Cap, Gills, Stem, Ring, Volva',
    excerpt: 'A complete guide to mushroom anatomy — understand every fungal structure to identify species accurately and forage safely.',
    image: '/parts-of-mushrooms.webp',
    category: 'Guide',
    risk: 'General',
    riskColor: '#7ec88a',
  },
  {
    slug: '/agaricus-arvensis-horse-mushroom',
    title: 'Horse Mushroom (Agaricus arvensis): Identification, Features, Habitat & Safety Guide',
    excerpt: 'The Horse Mushroom is a large edible grassland mushroom. Learn its cap, gills, ring, anise scent and how to avoid its toxic look-alikes.',
    image: '/agaricus-arvensis-horse-mushroom.webp',
    category: 'Species Guide',
    risk: 'High Risk',
    riskColor: '#f97316',
  },
  {
    slug: '/amanita-bisporigera-destroying-angel',
    title: 'Amanita bisporigera (Destroying Angel): Identification, Features, Habitat & Safety Guide',
    excerpt: 'Amanita bisporigera is one of the deadliest mushrooms in North America. Learn its pure white features and how to avoid misidentification.',
    image: '/amanita-bisporigera-destroying-angel-identification.webp',
    category: 'Safety',
    risk: 'Deadly',
    riskColor: '#ef4444',
  },
  {
    slug: '/amanita-virosa-mushroom',
    title: 'Amanita virosa (Destroying Angel): Identification, Features, Habitat & Safety Guide',
    excerpt: 'Amanita virosa is Europe\'s most deadly mushroom. Learn its cap, gills, ring, volva and the critical features that make it so dangerous.',
    image: '/amanita-virosa-mushroom-destroying-angel.webp',
    category: 'Safety',
    risk: 'Deadly',
    riskColor: '#ef4444',
  },
  {
    slug: '/mushroom-identification-quiz',
    title: 'Mushroom Identification Quiz — Test Your Fungi Knowledge (50 Questions)',
    excerpt: 'Test your mushroom ID skills with our free 50-question quiz featuring a 30-second timer, instant feedback and high score tracking.',
    image: '/mushroom-identification-quiz-various-species.webp',
    category: 'Quiz',
    risk: 'General',
    riskColor: '#7ec88a',
  },
]

interface Props {
  currentSlug: string
}

export default function RelatedPosts({ currentSlug }: Props) {
  const related = ALL_ARTICLES.filter(a => a.slug !== currentSlug).slice(0, 3)

  return (
    <div className="mt-16 pt-12 not-prose" style={{ borderTop: '2px solid var(--border)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-1 h-8 rounded-full flex-shrink-0"
          style={{ background: 'var(--accent)' }}
        />
        <h2
          className="font-playfair text-2xl md:text-3xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          Related Articles
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {related.map(article => (
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
            {/* Thumbnail */}
            <div
              className="relative flex-shrink-0 overflow-hidden"
              style={{ height: '180px', background: 'var(--bg-secondary)' }}
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Risk badge */}
              <span
                className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: article.riskColor }}
              >
                {article.risk}
              </span>
              {/* Category badge */}
              <span
                className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(4px)' }}
              >
                {article.category}
              </span>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1">
              <h3
                className="font-playfair text-base font-bold mb-2 leading-snug line-clamp-2"
                style={{ color: 'var(--text-primary)' }}
              >
                {article.title}
              </h3>
              <p
                className="text-xs leading-relaxed flex-1 line-clamp-2 mb-3"
                style={{ color: 'var(--text-muted)' }}
              >
                {article.excerpt}
              </p>
              <div
                className="flex items-center gap-1 text-xs font-semibold mt-auto transition-gap group-hover:gap-2"
                style={{ color: 'var(--accent)' }}
              >
                Read Article <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
