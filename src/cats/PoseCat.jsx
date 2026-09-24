import poses from './poses.json'

// The user's hand-drawn poses, stacked; the engine (brain.js) toggles `.on` on the active one.
// Every image is placed so its feet anchor sits at the bottom-centre of the cat box,
// scaled so the sitting pose is exactly --cat-size tall.
const ORDER = ['sit', 'walk', 'run', 'crouch', 'stretch', 'hopAway', 'pounceUp', 'reach', 'groom', 'sleep', 'startled', 'roll']
const base = import.meta.env.BASE_URL

export default function PoseCat({ cat }) {
  const meta = poses[cat]
  const ref = meta.sit.ay
  const k = (v) => `calc(var(--cat-size) * ${v.toFixed(4)})`
  return (
    <div className="pose-stack">
      {ORDER.map((p) => {
        const m = meta[p]
        return (
          <img
            key={p}
            data-p={p}
            className={`pose-img${p === 'sit' ? ' on' : ''}`}
            src={`${base}cats/${cat}/${p}.webp`}
            alt=""
            draggable="false"
            decoding="async"
            style={{ width: k(m.w / ref), left: k(0.5 - m.ax / ref), top: k(1 - m.ay / ref) }}
          />
        )
      })}
    </div>
  )
}
