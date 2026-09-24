import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { catBus } from './bus'
import { catsConfig } from './cats.config'
import { useGaze, useVideoScrub } from './useVideoScrub'
import PlaceholderCats from './PlaceholderCats'

// Placeholder animation used for each event when no reaction video exists.
const placeholderMoves = {
  click: 'hop',
  scroll: 'startle',
  about: 'hop',
  skills: 'nod',
  projects: 'spin',
  experience: 'nod',
  contact: 'hop',
}

export default function CatStage({ mirrored }) {
  useGaze()

  const lookRef = useRef(null)
  const reactRef = useRef(null)
  const missing = useRef(new Set())
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [srcIndex, setSrcIndex] = useState(0)
  const [reactVisible, setReactVisible] = useState(false)
  const [move, setMove] = useState(null)

  const sources = useMemo(() => {
    const small = window.matchMedia('(max-width: 767px)').matches
    return small ? [catsConfig.look.mobile, catsConfig.look.desktop] : [catsConfig.look.desktop]
  }, [])

  useVideoScrub(lookRef, { mirrored, active: videoReady })

  const react = useCallback(
    (event, clip) => {
      if (videoReady) {
        const v = reactRef.current
        if (!clip || !v || missing.current.has(clip)) return
        v.src = clip
        v.currentTime = 0
        v.play()
          .then(() => setReactVisible(true))
          .catch(() => missing.current.add(clip))
      } else {
        setMove({ name: placeholderMoves[event] ?? 'hop', key: performance.now() })
      }
    },
    [videoReady],
  )
  const reactLatest = useRef(react)
  reactLatest.current = react

  // Page events -> reactions
  useEffect(() => {
    const react = (...args) => reactLatest.current(...args)
    const { reactions, clickCooldownMs, scrollCooldownMs, fastScrollPx } = catsConfig
    let lastClick = 0
    let lastScroll = 0
    let lastY = window.scrollY
    let currentSection = null

    const onClick = () => {
      const now = performance.now()
      if (now - lastClick < clickCooldownMs) return
      lastClick = now
      react('click', reactions.click)
    }

    const onScroll = () => {
      const dy = window.scrollY - lastY
      lastY = window.scrollY
      const now = performance.now()
      if (Math.abs(dy) > fastScrollPx && now - lastScroll > scrollCooldownMs) {
        lastScroll = now
        react('scroll', reactions.scroll)
      }
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const id = e.target.id
          if (!e.isIntersecting || id === currentSection) return
          currentSection = id
          if (id === 'top') return
          react(id, reactions.section[id])
          catBus.emit('section', id)
        }),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    document.querySelectorAll('main section[id]').forEach((s) => io.observe(s))

    const offBus = catBus.on((type, data) => type === 'react' && react(data, reactions[data]))

    window.addEventListener('click', onClick)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      offBus()
      window.removeEventListener('click', onClick)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const onLookLoaded = () => {
    const v = lookRef.current
    // iOS Safari only paints seeked frames after the video has played once
    v?.play()
      .then(() => v.pause())
      .catch(() => {})
    setVideoReady(true)
  }

  const onLookError = () => {
    if (srcIndex + 1 < sources.length) setSrcIndex(srcIndex + 1)
    else setVideoFailed(true)
  }

  const videoClass = 'absolute inset-0 h-full w-full object-cover'

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0b0a1f]"
      style={mirrored ? { transform: 'scaleX(-1)' } : undefined}
    >
      {!videoReady && <PlaceholderCats mirrored={mirrored} move={move} />}

      {!videoFailed && (
        <video
          ref={lookRef}
          key={sources[srcIndex]}
          src={sources[srcIndex]}
          muted
          playsInline
          preload="auto"
          onLoadedData={onLookLoaded}
          onError={onLookError}
          className={videoClass}
          style={{ objectPosition: catsConfig.objectPosition, opacity: videoReady ? 1 : 0 }}
        />
      )}

      <video
        ref={reactRef}
        muted
        playsInline
        preload="none"
        onEnded={() => setReactVisible(false)}
        className={`${videoClass} transition-opacity duration-150`}
        style={{ objectPosition: catsConfig.objectPosition, opacity: reactVisible ? 1 : 0 }}
      />

      {/* Darkens the text side so hero copy stays readable over any video */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent md:bg-gradient-to-r md:from-black/60 md:via-black/20" />
    </div>
  )
}
