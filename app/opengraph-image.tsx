import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Mushroom Identifier - Free AI Fungi Identification Tool'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #061209 0%, #0a2a12 50%, #061209 100%)',
          padding: '60px',
          fontFamily: 'serif',
        }}
      >
        {/* Glow circle */}
        <div
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(126,200,138,0.15) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Mushroom emoji */}
        <div style={{ fontSize: 96, marginBottom: 24 }}>🍄</div>

        {/* Brand */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#7ec88a',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          MushroomIdentifiers.com
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: '#f5f0e8',
            textAlign: 'center',
            lineHeight: 1.1,
            maxWidth: '900px',
            marginBottom: 24,
          }}
        >
          Free AI Mushroom Identifier
        </div>

        {/* Sub */}
        <div
          style={{
            fontSize: 26,
            color: 'rgba(245,240,232,0.65)',
            textAlign: 'center',
            maxWidth: '760px',
            lineHeight: 1.4,
            marginBottom: 40,
          }}
        >
          Upload a photo to identify wild fungi species instantly using AI image recognition
        </div>

        {/* Badge row */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['10K+ Species', '95% Accuracy', '3 Free Scans', 'Instant Results'].map((badge) => (
            <div
              key={badge}
              style={{
                background: 'rgba(126,200,138,0.12)',
                border: '1px solid rgba(126,200,138,0.3)',
                borderRadius: '100px',
                padding: '10px 22px',
                fontSize: 18,
                color: '#7ec88a',
                fontWeight: 600,
              }}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
