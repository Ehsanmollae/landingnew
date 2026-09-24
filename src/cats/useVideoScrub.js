import { useEffect } from 'react'
import { catBus } from './bus'
import { catsConfig } from './cats.config'

// Turns pointer / touch position into catBus.progress (0..1), smoothed every frame.
export function useGaze() {
  useEffect(() => {
    let target = 0.5
    let lastInput = performance.now()
    let raf

    const setX = (x) => {
      target = Math.min(1, Math.max(0, x / window.innerWidth))
      lastInput = performance.now()
    }
    const onPointer = (e) => setX(e.clientX)
    const onTouch = (e) => e.touches[0] && setX(e.touches[0].clientX)

    const tick = (now) => {
      if (now - lastInput > catsConfig.idleReturnMs) target += (0.5 - target) * 0.02
      catBus.progress += (target - catBus.progress) * catsConfig.followSmoothing
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('pointerdown', onPointer, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])
}

// Seeks the video so its current frame matches catBus.progress.
// A new seek is only issued after the previous one finished (`seeked`), so seeks never pile up.
export function useVideoScrub(videoRef, { mirrored, active }) {
  useEffect(() => {
    const video = videoRef.current
    if (!video || !active) return
    let seeking = false
    let raf

    const onSeeked = () => {
      seeking = false
    }
    video.addEventListener('seeked', onSeeked)

    const tick = () => {
      const d = video.duration
      if (d && !seeking) {
        const p = mirrored ? 1 - catBus.progress : catBus.progress
        const targetTime = Math.min(d - 0.001, Math.max(0, p * d))
        if (Math.abs(video.currentTime - targetTime) > 1 / 60) {
          seeking = true
          video.currentTime = targetTime
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      video.removeEventListener('seeked', onSeeked)
    }
  }, [videoRef, mirrored, active])
}
