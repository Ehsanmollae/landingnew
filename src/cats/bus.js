// Tiny shared channel between the page and the cats.
// `progress` is where the cats look: 0 = left edge of the screen, 1 = right edge.
const listeners = new Set()

export const catBus = {
  progress: 0.5,
  on(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  emit(type, data) {
    listeners.forEach((fn) => fn(type, data))
  },
}
