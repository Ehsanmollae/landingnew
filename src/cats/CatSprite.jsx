// Flat, minimal cat drawn in SVG (viewBox 0 0 100 100, feet on y≈98).
// All poses are rendered once; CSS shows the one matching data-pose / data-mood
// on the parent .cat element, so the engine never re-renders React per frame.

function Eyes({ c, cx = [40, 60], cy = 36, r = 6.6 }) {
  return (
    <>
      <g className="eyes-open">
        {cx.map((x) => (
          <g key={x}>
            <circle cx={x} cy={cy} r={r} fill={c.iris} />
            <circle className="pupil" cx={x} cy={cy} r={r * 0.42} fill={c.pupil} />
          </g>
        ))}
      </g>
      <g className="eyes-happy" fill="none" stroke={c.iris} strokeWidth="2" strokeLinecap="round">
        {cx.map((x) => (
          <path key={x} d={`M${x - 5} ${cy + 1} q5 -6 10 0`} />
        ))}
      </g>
      <g className="eyes-closed" fill="none" stroke={c.lid} strokeWidth="1.8" strokeLinecap="round">
        {cx.map((x) => (
          <path key={x} d={`M${x - 5} ${cy} q5 4 10 0`} />
        ))}
      </g>
    </>
  )
}

function SitPose({ c }) {
  return (
    <g className="pose pose-sit">
      {/* tail wrapped around the feet (floor) */}
      <path className="tail-wrap" d="M70 95 C 86 99, 98 93, 95 80" stroke={c.fur} strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* tail hanging over a shelf edge */}
      <g className="tail-hang">
        <path d="M66 96 C 70 110, 62 122, 68 138" stroke={c.fur} strokeWidth="7" strokeLinecap="round" fill="none" />
      </g>
      <g className="ear ear-l">
        <path d="M28 32 L24 7 L45 19 Z" fill={c.fur} stroke={c.fur} strokeWidth="4" strokeLinejoin="round" />
      </g>
      <g className="ear ear-r">
        <path d="M72 32 L76 7 L55 19 Z" fill={c.fur} stroke={c.fur} strokeWidth="4" strokeLinejoin="round" />
      </g>
      <path
        className="silhouette"
        d="M22 98 C 10 98, 10 80, 16 66 C 21 54, 24 44, 25 34 C 26 22, 36 16, 50 16 C 64 16, 74 22, 75 34 C 76 44, 79 54, 84 66 C 90 80, 90 98, 78 98 Z"
        fill={c.fur}
      />
      {c.stripes && (
        <g stroke={c.stripe} strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M44 20 l1 6 M50 18.5 v7 M56 20 l-1 6" />
          <path d="M15 72 q6 2 9 -1 M14 80 q6 2 9 -1 M85 72 q-6 2 -9 -1 M86 80 q-6 2 -9 -1" />
        </g>
      )}
      <path d="M30 92 C 42 97, 58 97, 70 94" stroke={c.line} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <Eyes c={c} />
      <path d="M48.3 43.2 h3.4 l-1.7 1.8 z" fill={c.nose} />
      <g className="mouth-open">
        <ellipse cx="50" cy="48.5" rx="3.4" ry="4" fill="#3a1418" />
        <ellipse cx="50" cy="50.5" rx="2.4" ry="1.8" fill="#ff7a8a" />
      </g>
      {/* paws used by groom / swipe */}
      <ellipse className="paw paw-groom" cx="46" cy="50" rx="5" ry="6.5" fill={c.fur} stroke={c.line} strokeWidth="1" />
      <ellipse className="paw paw-swipe" cx="82" cy="62" rx="7" ry="5" fill={c.fur} stroke={c.line} strokeWidth="1" />
      <path className="tongue" d="M49 45.5 q1 4 2.4 0 z" fill="#ff7a8a" />
    </g>
  )
}

function LoafPose({ c }) {
  return (
    <g className="pose pose-loaf">
      <path d="M68 52 L67 35 L79 46 Z" fill={c.fur} stroke={c.fur} strokeWidth="4" strokeLinejoin="round" />
      <path d="M84 46 L93 35 L93 54 Z" fill={c.fur} stroke={c.fur} strokeWidth="4" strokeLinejoin="round" />
      <path
        className="silhouette"
        d="M10 98 C 2 98, 2 82, 10 74 C 18 66, 34 62, 50 62 C 58 62, 62 60, 64 56 C 66 50, 72 46, 80 46 C 90 46, 96 54, 96 64 C 96 74, 98 84, 96 92 C 95 97, 90 98, 84 98 Z"
        fill={c.fur}
      />
      {c.stripes && (
        <path d="M30 66 q2 6 -1 10 M40 64 q2 6 -1 10 M50 63 q2 6 -1 10" stroke={c.stripe} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      )}
      <path d="M8 93 C 26 100, 58 100, 74 95" stroke={c.line} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <g fill="none" stroke={c.lid} strokeWidth="1.8" strokeLinecap="round">
        <path d="M72 64 q3.5 2.8 7 0" />
        <path d="M85 64 q3.5 2.8 7 0" />
      </g>
      <path d="M81 69 h2.8 l-1.4 1.5 z" fill={c.nose} />
    </g>
  )
}

function WalkPose({ c }) {
  const leg = (x, far, delay, part) => (
    <g transform={`translate(${x} 70)`}>
      <rect
        className={`leg leg-${part}`}
        x="-3.6"
        y="0"
        width="7.2"
        height="28"
        rx="3.6"
        fill={far ? c.far : c.fur}
        style={{ animationDelay: delay }}
      />
    </g>
  )
  return (
    <g className="pose pose-walk">
      <g className="walk-body">
        <g className="walk-tail">
          <path d="M18 60 C 5 54, 4 34, 13 25" stroke={c.fur} strokeWidth="6.5" strokeLinecap="round" fill="none" />
        </g>
        {leg(27, true, '-0.3s', 'back')}
        {leg(59, true, '0s', 'front')}
        {leg(34, false, '0s', 'back')}
        {leg(66, false, '-0.3s', 'front')}
        <ellipse className="silhouette" cx="45" cy="63" rx="30" ry="15" fill={c.fur} />
        {c.stripes && (
          <path d="M34 50 q-2 7 1 12 M44 49 q-2 7 1 12 M54 50 q-2 7 1 12" stroke={c.stripe} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        )}
        <g className="walk-head">
          <path d="M66 44 L65 25 L78 37 Z" fill={c.fur} stroke={c.fur} strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M79 37 L90 25 L90 44 Z" fill={c.fur} stroke={c.fur} strokeWidth="3.5" strokeLinejoin="round" />
          <circle className="silhouette" cx="77" cy="50" r="15" fill={c.fur} />
          <g className="eyes-open">
            <circle cx="83" cy="48" r="4" fill={c.iris} />
            <circle className="pupil pupil-side" cx="83.6" cy="48" r="1.8" fill={c.pupil} />
          </g>
          <path className="eyes-closed" d="M79.5 48.5 q3.5 2.5 7 0" fill="none" stroke={c.lid} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M90.5 53.5 h2.6 l-1.3 1.4 z" fill={c.nose} />
        </g>
      </g>
    </g>
  )
}

export default function CatSprite({ c }) {
  return (
    <svg viewBox="0 0 100 100" className="cat-svg" style={{ '--outline': c.outline ?? 'none' }}>
      <SitPose c={c} />
      <LoafPose c={c} />
      <WalkPose c={c} />
    </svg>
  )
}
