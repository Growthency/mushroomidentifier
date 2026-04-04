import Image from 'next/image'

interface AuthorBlockProps {
  updatedAt?: string
}

export default function AuthorBlock({ updatedAt }: AuthorBlockProps = {}) {
  return (
    <div
      className="flex items-center gap-3 my-6 px-4 py-3 rounded-xl"
      style={{ background: 'var(--accent-bg)', border: '1px solid var(--border-hover)' }}
    >
      <div className="flex-shrink-0 rounded-full overflow-hidden" style={{ width: 48, height: 48 }}>
        <Image
          src="/author-avatar.webp"
          alt="Dr. Didier Borgarino - Mycologist & Field Expert"
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
          Dr. Didier Borgarino
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Field Mycologist · Author · Fungi Expert
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
