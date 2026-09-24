import { useEffect, useRef } from 'react'
import { catsConfig } from './cats.config'
import { createWorld } from './brain'
import CatSprite from './CatSprite'
import Laser from './Laser'

export default function CatWorld() {
  const rootRef = useRef(null)

  useEffect(() => {
    const world = createWorld(rootRef.current)
    return () => world.destroy()
  }, [])

  return (
    <div ref={rootRef} aria-hidden="true" className="cat-world pointer-events-none fixed inset-0 z-20 overflow-hidden">
      <div className="sunbeam" />
      {catsConfig.cats.map((def) => (
        <div key={def.id} className="cat" data-cat={def.id} data-pose="sit">
          <div className="cat-inner">
            <CatSprite c={def.colors} />
          </div>
          <div className="cat-fxs" />
        </div>
      ))}
      <Laser />
    </div>
  )
}
