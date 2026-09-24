import data from './frames.json'

// The user's hand-drawn animations: one strip of frames per animation.
// The engine (brain.js) toggles `.on` and moves background-position to pick the frame.
// Each strip is placed so its foot line sits at the bottom-centre of the cat box,
// scaled so the sitting cat is exactly --cat-size tall.
const base = import.meta.env.BASE_URL

export default function FrameCat({ cat }) {
  const { size } = data
  const { anims, ref } = data.cats[cat]
  const k = (v) => `calc(var(--cat-size) * ${v.toFixed(4)})`
  return (
    <div className="anim-stack">
      {Object.entries(anims).map(([name, a]) => (
        <div
          key={name}
          data-anim={name}
          data-n={a.n}
          className={`anim${name === 'sitting' ? ' on' : ''}`}
          style={{
            width: k(size / ref),
            height: k(size / ref),
            left: k(0.5 - size / 2 / ref),
            top: k(1 - a.foot / ref),
            backgroundImage: `url(${base}cats/${cat}/${name}.webp)`,
            backgroundSize: `${a.n * 100}% 100%`,
          }}
        />
      ))}
    </div>
  )
}
