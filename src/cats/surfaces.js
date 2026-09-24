// Everything a cat can stand on, recomputed each frame in viewport coordinates:
// the floor (bottom of the screen) plus the top edge of every visible [data-cat-surface].
const ids = new WeakMap()
let nextId = 1
const idOf = (el) => {
  if (!ids.has(el)) ids.set(el, `s${nextId++}`)
  return ids.get(el)
}

const NAV_CLEARANCE = 84

export function readSurfaces(W, H, S) {
  const list = [{ id: 'floor', kind: 'floor', el: null, rawLeft: 0, left: S * 0.4, right: W - S * 0.4, top: H - 2 }]
  document.querySelectorAll('[data-cat-surface]').forEach((el) => {
    if (el.dataset.falling) return
    const r = el.getBoundingClientRect()
    if (r.width < S * 1.1 || r.top < NAV_CLEARANCE || r.top > H - S * 0.5) return
    list.push({
      id: idOf(el),
      kind: el.dataset.catSurface,
      el,
      rawLeft: r.left,
      left: r.left + S * 0.35,
      right: r.right - S * 0.35,
      top: r.top,
    })
  })
  return list
}
