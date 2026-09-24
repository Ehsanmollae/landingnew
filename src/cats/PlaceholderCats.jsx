import { useEffect, useRef, useState } from 'react'
import { catBus } from './bus'

// Stand-in cats drawn in SVG, driven by the same gaze value as the video.
// Shown until public/cats/look.mp4 exists.

const cats = [
  {
    id: 'midnight',
    fur: '#3f4470', belly: '#c7cbef', ear: '#f9a8d4', iris: '#fbbf24', dark: '#23264a', whisker: '#e0e7ff',
    accessory: 'hat', width: '31%', delay: '0.08s', blink: '0.7s',
  },
  {
    id: 'ginger',
    fur: '#f4a259', belly: '#fff4e6', ear: '#ffb4a2', iris: '#34d399', dark: '#b45309', whisker: '#7c4a21',
    accessory: 'collar', stripes: true, width: '38%', delay: '0s', blink: '2.1s',
  },
  {
    id: 'snow',
    fur: '#f3efe8', belly: '#ffffff', ear: '#fbcfe8', iris: '#60a5fa', dark: '#94a3b8', whisker: '#94a3b8',
    accessory: 'bow', width: '30%', delay: '0.16s', blink: '3.4s',
  },
]

// Deterministic star field
const stars = Array.from({ length: 60 }, (_, i) => {
  const r = (n) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1
  return { left: `${r(1) * 100}%`, top: `${r(2) * 70}%`, size: 1 + r(3) * 2.5, delay: `${r(4) * 4}s` }
})

function Eye({ cx, c }) {
  return (
    <>
      <ellipse cx={cx} cy="86" rx="12" ry="14" fill="#fff" />
      <g className="cat-pupil">
        <ellipse cx={cx} cy="87" rx="8.5" ry="11" fill={c.iris} />
        <ellipse cx={cx} cy="87" rx="4" ry="8.5" fill="#111827" />
        <circle cx={cx + 3} cy="82" r="2.4" fill="#fff" />
      </g>
    </>
  )
}

function Cat({ c }) {
  return (
    <div className="cat" style={{ width: c.width, '--d': c.delay, '--blink': c.blink }}>
      <svg viewBox="0 0 200 232" className="block w-full overflow-visible">
        <ellipse cx="100" cy="226" rx="70" ry="6" fill="#000" opacity="0.25" />
        <g className="cat-body">
          <path className="cat-tail" d="M140 204 C 196 204, 202 146, 172 120" stroke={c.fur} strokeWidth="16" strokeLinecap="round" fill="none" />
          <ellipse cx="100" cy="168" rx="58" ry="56" fill={c.fur} />
          <ellipse cx="100" cy="182" rx="30" ry="40" fill={c.belly} />
          <ellipse cx="78" cy="220" rx="17" ry="10" fill={c.fur} />
          <ellipse cx="122" cy="220" rx="17" ry="10" fill={c.fur} />
          {c.accessory === 'collar' && (
            <>
              <path d="M66 132 q34 18 68 0" stroke="#ef4444" strokeWidth="7" fill="none" strokeLinecap="round" />
              <circle cx="100" cy="143" r="6" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            </>
          )}
        </g>
        <g className="cat-head">
          <g className="cat-ear cat-ear-l">
            <path d="M56 74 L62 20 L98 50 Z" fill={c.fur} strokeLinejoin="round" stroke={c.fur} strokeWidth="6" />
            <path d="M66 64 L68 36 L88 52 Z" fill={c.ear} />
          </g>
          <g className="cat-ear cat-ear-r">
            <path d="M144 74 L138 20 L102 50 Z" fill={c.fur} strokeLinejoin="round" stroke={c.fur} strokeWidth="6" />
            <path d="M134 64 L132 36 L112 52 Z" fill={c.ear} />
          </g>
          <ellipse cx="100" cy="88" rx="54" ry="47" fill={c.fur} />
          {c.stripes && (
            <path d="M90 45 l3 15 M100 43 v17 M110 45 l-3 15" stroke={c.dark} strokeWidth="4" strokeLinecap="round" />
          )}
          <ellipse cx="100" cy="108" rx="25" ry="15" fill={c.belly} />
          <g className="cat-eyes">
            <Eye cx={79} c={c} />
            <Eye cx={121} c={c} />
          </g>
          <path d="M94 100 h12 l-6 7 z" fill="#f472b6" />
          <path d="M100 107 q-5 7 -11 3 M100 107 q5 7 11 3" stroke={c.dark} strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx="63" cy="104" rx="9" ry="5" fill="#fb7185" opacity="0.35" />
          <ellipse cx="137" cy="104" rx="9" ry="5" fill="#fb7185" opacity="0.35" />
          <path
            d="M74 106 L40 99 M74 110 L40 113 M126 106 L160 99 M126 110 L160 113"
            stroke={c.whisker} strokeWidth="1.5" strokeLinecap="round"
          />
          {c.accessory === 'hat' && (
            <g>
              <path d="M68 50 L104 -14 L130 44 Z" fill="#7c3aed" />
              <ellipse cx="99" cy="48" rx="42" ry="8" fill="#6d28d9" />
              <path d="M104 12 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1 z" fill="#fde047" />
            </g>
          )}
          {c.accessory === 'bow' && (
            <g transform="translate(134 50) rotate(20)">
              <path d="M0 0 L-16 -10 L-16 10 Z M0 0 L16 -10 L16 10 Z" fill="#f472b6" strokeLinejoin="round" stroke="#f472b6" strokeWidth="3" />
              <circle r="4.5" fill="#db2777" />
            </g>
          )}
        </g>
      </svg>
    </div>
  )
}

export default function PlaceholderCats({ mirrored, move }) {
  const rootRef = useRef(null)
  const [active, setActive] = useState(null)

  // Feed the gaze into a CSS variable every frame (no React re-render)
  useEffect(() => {
    let raf
    const tick = () => {
      const p = mirrored ? 1 - catBus.progress : catBus.progress
      rootRef.current?.style.setProperty('--g', (p * 2 - 1).toFixed(3))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [mirrored])

  useEffect(() => {
    if (!move) return
    setActive(move)
    const t = setTimeout(() => setActive(null), 1300)
    return () => clearTimeout(t)
  }, [move])

  return (
    <div ref={rootRef} className="absolute inset-0" data-move={active?.name ?? ''}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_15%,#5b21b6_0%,#1e1b4b_45%,#0b0a1f_100%)]" />
      {stars.map((s, i) => (
        <span
          key={i}
          className="twinkle absolute rounded-full bg-white"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }}
        />
      ))}
      <div className="absolute top-[10%] right-[16%] h-16 w-16 rounded-full bg-amber-100 shadow-[0_0_80px_24px_rgba(254,243,199,0.35)] md:h-24 md:w-24" />
      <div className="float-orb absolute top-[30%] right-[45%] h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_20px_6px_rgba(103,232,249,0.7)]" />
      <div className="float-orb absolute top-[55%] right-[8%] h-2 w-2 rounded-full bg-pink-300 shadow-[0_0_16px_6px_rgba(249,168,212,0.7)] [animation-delay:1.5s]" />

      <svg className="absolute inset-x-0 bottom-0 h-[38%] w-full" viewBox="0 0 1440 400" preserveAspectRatio="none">
        <path d="M0 220 C 240 140, 480 260, 760 190 S 1200 120, 1440 200 V400 H0 Z" fill="#2e1065" />
        <path d="M0 290 C 300 230, 560 320, 880 270 S 1260 230, 1440 280 V400 H0 Z" fill="#1e1b4b" />
      </svg>

      <div className="absolute top-[11%] left-1/2 flex w-[92vw] max-w-[520px] -translate-x-1/2 items-end justify-center md:top-auto md:right-[5%] md:bottom-[9%] md:left-auto md:w-[min(640px,52vw)] md:max-w-none md:translate-x-0">
        {cats.map((c) => (
          <Cat key={c.id} c={c} />
        ))}
      </div>
    </div>
  )
}
