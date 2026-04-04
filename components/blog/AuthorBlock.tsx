import Image from 'next/image'

export default function AuthorBlock() {
  return (
    <div
      className="flex items-center gap-3 my-6 px-4 py-3 rounded-xl"
      style={{ background: 'var(--accent-bg)', border: '1px solid var(--border-hover)' }}
    >
      <div className="flex-shrink-0 rounded-full overflow-hidden" style={{ width: 48, height: 48 }}>
        <Image
          src="/author-paul-stamets.webp"
          alt="Paul Stamets - Mycologist & Author"
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
          Paul Stamets
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Mycologist · Author · Fungi Expert
        </p>
      </div>
    </div>
  )
}
