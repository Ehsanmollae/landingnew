// Things the cats do to the page itself.

// Knock an element off its shelf: it falls, fades, then quietly comes back.
export function knockOff(el, dir) {
  if (el.dataset.falling) return
  el.dataset.falling = '1'
  el.style.transition = 'transform 0.9s cubic-bezier(0.55, 0, 0.85, 0.35), opacity 0.9s ease-in'
  el.style.transform = `translate(${dir * 60}px, 420px) rotate(${dir * 80}deg)`
  el.style.opacity = '0'
  setTimeout(() => {
    el.style.transition = 'none'
    el.style.transform = 'translateY(-14px)'
    void el.offsetHeight
    el.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease'
    el.style.transform = ''
    el.style.opacity = ''
    setTimeout(() => {
      el.style.transition = ''
      delete el.dataset.falling
    }, 600)
  }, 2600)
}

const STAR = '<svg viewBox="0 0 20 20"><path d="M10 0 L12.4 7.6 L20 10 L12.4 12.4 L10 20 L7.6 12.4 L0 10 L7.6 7.6 Z" fill="currentColor"/></svg>'
const HEART = '<svg viewBox="0 0 20 18"><path d="M10 18 C 4 13, 0 10, 0 5.5 A 5 5 0 0 1 10 3.5 A 5 5 0 0 1 20 5.5 C 20 10, 16 13, 10 18 Z" fill="currentColor"/></svg>'

// Little particles (Zzz, stars, hearts) that float out of a cat and remove themselves.
export function spawnParticle(container, type, S) {
  const el = document.createElement('span')
  el.className = `cat-fx cat-fx-${type}`
  if (type === 'z') el.textContent = Math.random() < 0.5 ? 'z' : 'Z'
  else el.innerHTML = type === 'star' ? STAR : HEART
  const angle = type === 'star' ? Math.random() * Math.PI * 2 : 0
  el.style.setProperty('--dx', `${type === 'star' ? Math.cos(angle) * S * 0.6 : (Math.random() - 0.3) * S * 0.3}px`)
  el.style.setProperty('--dy', `${type === 'star' ? Math.sin(angle) * S * 0.5 - S * 0.2 : -S * 0.6}px`)
  el.style.setProperty('--s', `${Math.max(10, S * 0.14)}px`)
  el.addEventListener('animationend', () => el.remove())
  container.appendChild(el)
}
