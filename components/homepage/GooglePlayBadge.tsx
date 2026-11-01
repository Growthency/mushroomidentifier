export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.mushroomidentifiers.mushroomidentification'

/** "Get it on Google Play" download button for the Android app. */
export default function GooglePlayBadge() {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Mushroom Identifier on Google Play"
      className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl transition-transform hover:-translate-y-0.5"
      style={{ background: '#0b1912', color: '#fff', boxShadow: '0 10px 24px rgba(11,25,18,0.22)' }}
    >
      <svg width="28" height="31" viewBox="0 0 28 31" aria-hidden="true">
        <path d="M1.2 1.1C.8 1.6.5 2.2.5 3v25c0 .8.3 1.4.7 1.9L15 15.5 1.2 1.1Z" fill="#00d0ff" />
        <path d="m20 20.7-5-5.2 5-5.2 6 3.5c1.7 1 1.7 2.5 0 3.5l-6 3.4Z" fill="#ffd400" />
        <path d="M1.2 29.9c.7.7 1.8.8 3 .1L20 20.7l-5-5.2L1.2 29.9Z" fill="#ff3a44" />
        <path d="M1.2 1.1 15 15.5l5-5.2L4.2 1C3 .3 1.9 .4 1.2 1.1Z" fill="#00e676" />
      </svg>
      <div className="text-left leading-tight">
        <div className="block text-[11px] font-medium tracking-wide" style={{ color: '#cfe0d8' }}>GET IT ON</div>
        <div className="block text-lg font-semibold" style={{ color: '#fff' }}>Google Play</div>
      </div>
    </a>
  )
}
