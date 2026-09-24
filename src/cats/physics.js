export const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
export const lerp = (a, b, t) => a + (b - a) * t
export const rand = (a, b) => a + Math.random() * (b - a)
export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

// Damped spring toward 1, used for squash & stretch (scaleY of the sprite).
export function springStep(s, dt) {
  const k = 260
  const damping = 16
  s.v += ((1 - s.value) * k - s.v * damping) * dt
  s.value += s.v * dt
}

export function pickWeighted(weights) {
  const entries = Object.entries(weights).filter(([, w]) => w > 0)
  let r = Math.random() * entries.reduce((sum, [, w]) => sum + w, 0)
  for (const [key, w] of entries) {
    r -= w
    if (r <= 0) return key
  }
  return entries[0]?.[0]
}
