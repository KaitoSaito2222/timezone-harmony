import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Timezone Harmony - Compare time zones across the world';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PRIMARY = '#26c090';
const BG_FROM = '#0d1b2a';
const BG_TO = '#1a2e3f';
const TEXT_MUTED = '#94a3b8';

export default function Image() {
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
          background: `linear-gradient(135deg, ${BG_FROM} 0%, ${BG_TO} 100%)`,
          fontFamily: 'sans-serif',
          padding: '80px',
        }}
      >
        {/* Clock icon (Lucide Clock paths) */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          stroke={PRIMARY}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          style={{ marginBottom: '40px' }}
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>

        {/* Title */}
        <div
          style={{
            fontSize: '80px',
            fontWeight: 800,
            color: PRIMARY,
            letterSpacing: '-2px',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          Timezone Harmony
        </div>

        {/* Divider */}
        <div
          style={{
            width: '80px',
            height: '3px',
            background: PRIMARY,
            borderRadius: '2px',
            marginBottom: '32px',
            opacity: 0.6,
          }}
        />

        {/* Description */}
        <div
          style={{
            fontSize: '32px',
            color: TEXT_MUTED,
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.5,
          }}
        >
          Compare time zones across the world.{' '}
          Find optimal meeting times for your global team.
        </div>
      </div>
    ),
    { ...size }
  );
}
