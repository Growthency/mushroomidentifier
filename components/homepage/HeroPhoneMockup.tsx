import NextImage from 'next/image'
import { Camera, ChevronRight, Globe, Image as ImageIcon, MessageCircle, TriangleAlert } from 'lucide-react'

const TEAL = '#0fae8c'
const INK = '#10231c'
const MUTED = '#64756e'
const LINE = '#dfe9e4'

const ANGLES = [
  { src: '/mushroom-top-view-cap-surface-1.webp', label: 'Cap' },
  { src: '/mushroom-side-profile-stem-view-2.webp', label: 'Stipe' },
  { src: '/mushroom-underside-gills-spores-3.webp', label: 'Gills' },
]

function FloatingCard({ icon: Icon, title, text, className }: { icon: any; title: string; text: string; className: string }) {
  return (
    <div
      className={`absolute z-20 hidden xl:flex items-center gap-2.5 px-3 py-2.5 rounded-2xl ${className}`}
      style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', border: `1px solid ${LINE}`, boxShadow: '0 14px 30px rgba(16,35,28,0.14)' }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#e4f7f1', color: TEAL }}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="leading-tight">
        <div className="block text-sm font-semibold" style={{ color: INK }}>{title}</div>
        <div className="block text-xs" style={{ color: MUTED }}>{text}</div>
      </div>
    </div>
  )
}

/** Hero phone: the first screen of the mobile app, drawn in HTML so it stays sharp. */
export default function HeroPhoneMockup() {
  return (
    <div className="relative w-[270px] sm:w-[300px] mx-auto" aria-hidden="true">
      <div className="absolute -inset-10 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(15,174,140,0.3), transparent 68%)' }} />

      <FloatingCard icon={Globe} title="Edible &amp; toxic species" text="AI identification" className="-left-40 top-10" />
      <FloatingCard icon={TriangleAlert} title="Toxicity warnings" text="On every result" className="-right-28 bottom-10" />

      <div
        className="relative rounded-[46px] p-[9px] lg:rotate-2"
        style={{ background: '#0b1912', boxShadow: '0 34px 70px rgba(11,25,18,0.34), inset 0 0 0 2px #2c3b35' }}
      >
        <div className="relative rounded-[38px] overflow-hidden" style={{ background: '#f7faf8' }}>
          <div className="flex items-center justify-between px-6 pt-3 pb-2 text-[11px] font-semibold" style={{ color: INK }}>
            <div>7:23</div>
            <div className="w-3.5 h-3.5 rounded-full" style={{ background: '#0b1912' }} />
            <div>5G 72%</div>
          </div>

          <div className="px-4 pb-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#1b6b5a', color: '#fff' }}>
                <Camera className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 leading-tight">
                <div className="block text-[12px] font-bold lg:whitespace-nowrap" style={{ color: INK }}>Upload Mushroom Photos</div>
                <div className="block text-[11px]" style={{ color: MUTED }}>Multi-angle analysis</div>
              </div>
              <div className="px-2 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap" style={{ background: '#dff5ee', color: '#1b6b5a' }}>
                Up to 4
              </div>
            </div>

            <div className="rounded-2xl py-6 text-center mb-3" style={{ border: `1.5px dashed #b8d4ca`, background: '#fff' }}>
              <Camera className="w-7 h-7 mx-auto mb-1.5" style={{ color: MUTED }} />
              <div className="text-[13px] font-bold" style={{ color: INK }}>Tap to upload</div>
              <div className="text-[10px]" style={{ color: MUTED }}>0/4 photos · JPG, PNG · Max 10MB each</div>
            </div>

            <div className="text-[10px] font-semibold mb-1.5" style={{ color: MUTED }}>For best results, capture these angles:</div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {ANGLES.map(({ src, label }) => (
                <div key={label} className="text-center">
                  <NextImage src={src} alt="" width={120} height={90} sizes="84px" priority className="w-full h-14 object-cover rounded-xl" />
                  <div className="block text-[10px] font-semibold mt-1" style={{ color: INK }}>{label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-bold mb-2" style={{ background: TEAL, color: '#fff' }}>
              <Camera className="w-4 h-4" /> Take a Photo
            </div>
            <div className="flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-bold mb-3" style={{ background: '#fff', border: `1px solid ${LINE}`, color: INK }}>
              <ImageIcon className="w-4 h-4" /> Choose from Gallery
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-2xl" style={{ background: '#fff', border: `1px solid ${LINE}` }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#e4f7f1', color: '#1b6b5a' }}>
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 leading-tight">
                <div className="block text-[12px] font-bold" style={{ color: INK }}>Ask the AI</div>
                <div className="block text-[10px]" style={{ color: MUTED }}>Chat about mushrooms and fungi</div>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: MUTED }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
