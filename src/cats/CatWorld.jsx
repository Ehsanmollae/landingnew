import { useEffect, useRef, useState } from 'react'
import { catsConfig } from './cats.config'
import { createWorld } from './brain'
import CatSprite from './CatSprite'
import Laser from './Laser'
import FrameCat from './FrameCat'

export default function CatWorld() {
  const rootRef = useRef(null)
  // 'frames' = the hand-drawn animations, 'svg' = fallback if they can't be loaded
  const [mode, setMode] = useState(null)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setMode('frames')
    img.onerror = () => setMode('svg')
    img.src = `${import.meta.env.BASE_URL}cats/black/sitting.webp`
  }, [])

  useEffect(() => {
    if (!mode) return
    const world = createWorld(rootRef.current)
    return () => world.destroy()
  }, [mode])

  return (
    <div ref={rootRef} aria-hidden="true" className="cat-world pointer-events-none fixed inset-0 z-20 overflow-hidden">
      <div className="sunbeam" />
      {mode &&
        catsConfig.cats.map((def) => (
          <div key={def.id} className="cat" data-cat={def.id} data-pose="sit">
            <div className="cat-inner">{mode === 'frames' ? <FrameCat cat={def.id} /> : <CatSprite c={def.colors} />}</div>
            <div className="cat-fxs" />
          </div>
        ))}
      <Laser />
    </div>
  )
}
