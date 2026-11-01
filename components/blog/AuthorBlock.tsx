import Image from 'next/image'
import Link from 'next/link'

interface AuthorBlockProps {
  updatedAt?: string
  name?: string
  role?: string
}

export default function AuthorBlock({
  updatedAt,
  name = 'Mushroom Identifiers Editorial Team',
  role = 'Field Guides & Mushroom Safety',
}: AuthorBlockProps = {}) {
  return (
    <div
      className="flex items-center gap-3 my-6 px-4 py-3 rounded-xl"
      style={{ background: 'var(--accent-bg)', border: '1px solid var(--border-hover)' }}
    >
      <div className="flex-shrink-0 rounded-full overflow-hidden" style={{ width: 72, height: 72 }}>
        <Image
          src="/author-team.webp"
          alt="Basket of wild mushrooms in a forest"
          width={72}
          height={72}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <Link href="/editorial-policy" className="font-semibold text-sm leading-tight hover:underline" style={{ color: 'var(--text-primary)' }}>
          {name}
        </Link>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {role}
        </p>
      </div>
      {updatedAt && (
        <div className="text-right flex-shrink-0">
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Updated</p>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{updatedAt}</p>
        </div>
      )}
    </div>
  )
}
