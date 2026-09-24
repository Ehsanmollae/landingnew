import { catBus } from './bus'
import { catsConfig as cfg } from './cats.config'
import { clamp, easeInOut, lerp, pickWeighted, rand, springStep } from './physics'
import { knockOff, spawnParticle } from './props'
import { readSurfaces } from './surfaces'

const TYPE_KEYS = 'fjdkfjjjfffkkd;'

// Which hand-drawn animation (public/cats/<cat>/<anim>.webp) matches the current body state
function pickAnim(pose, mood, gait) {
  if (pose === 'loaf') return 'sleeping'
  if (pose === 'roll') return 'rolling'
  if (pose === 'walk') {
    if (mood === 'crouch') return 'crouching'
    if (mood === 'stretch') return 'stretching'
    return gait === 'run' ? 'running' : 'walking'
  }
  return (
    { swipe: 'reaching', groom: 'licking', startled: 'startled', excited: 'pouncing', happy: 'rolling', yawn: 'stretching' }[mood] ??
    'sitting'
  )
}

// How each animation's frames are played.
//   stride: advance one frame per `stride * catSize` px walked (feet don't slide)
//   progress: frame chosen by the engine (jump progress)
//   seq/fps: looping frame sequence;  once: play through then hold `hold`
const PLAYBACK = {
  sitting: { fps: 2.5, seq: [0, 0, 0, 1, 1, 0, 0, 0, 3, 3, 0, 2, 0, 0] }, // frame 2 = blink
  walking: { stride: 0.2 },
  running: { stride: 0.42 },
  crouching: { fps: 8, pingpong: true },
  licking: { fps: 5, pingpong: true },
  reaching: { fps: 8 },
  rolling: { fps: 3, pingpong: true },
  sleeping: { fps: 2.5, once: true, hold: 2 }, // curls up, then stays a ball
  startled: { fps: 9, once: true },
  stretching: { fps: 2.4, once: true },
  leaping: { progress: true },
  pouncing: { progress: true },
}

// ---------------------------------------------------------------------------
// Behaviors. enter() sets things up (it may redirect with cat.go), update()
// returns true when the behavior is finished and the cat should pick another.
// ---------------------------------------------------------------------------
const STATES = {
  sit: {
    enter(c, d) {
      c.set('sit', d.mood ?? '')
      d.dur ??= rand(2.5, 6)
    },
    update(c, dt, d) {
      c.faceTarget()
      if (c.every(dt, 'check', 0.7) && (c.crowded() || c.coveringControl())) return c.go('walk', { away: true })
      return c.t > d.dur
    },
  },

  walk: {
    enter(c, d) {
      d.tx ??= d.toX ?? c.freeSpot(c.surface(), d.away)
      d.speed ??= cfg.speed.walk
      d.gait ??= 'walk'
    },
    update(c, dt, d) {
      return c.walkTo(d.tx, d.speed, d.gait, dt)
    },
  },

  trot: {
    enter(c) {
      c.go('walk', { speed: cfg.speed.trot, gait: 'trot', away: true })
    },
  },

  hop: {
    enter(c) {
      const here = c.surface()
      const options = c.world.surfaces.filter(
        (s) => s.id !== here?.id && !c.world.isCrowded(s, c) && Math.abs(s.top - c.y) < c.world.H * 0.75,
      )
      if (!options.length) return c.go('walk')
      const s = options[Math.floor(Math.random() * options.length)]
      c.jumpTo(s, c.freeSpot(s), 'sit')
    },
  },

  jump: {
    enter(c, d) {
      const s = c.world.byId.get(d.toId)
      const tx = s.rawLeft + d.toOffset
      const dist = Math.hypot(tx - d.fromX, s.top - d.fromY)
      d.dur ??= clamp(0.38 + dist / 1500, 0.4, 0.9)
      d.h ??= c.world.S * 0.4 + Math.max(0, d.fromY - s.top) * 0.25
      c.facing = tx >= d.fromX ? 1 : -1
      c.set('walk', 'leap')
      c.show(d.pounce ? 'pouncing' : 'leaping')
      c.squash.v = 3
    },
    update(c, dt, d) {
      let s = c.world.byId.get(d.toId)
      if (!s) {
        s = c.world.floor
        d.toId = s.id
        d.toOffset = clamp(c.x, s.left, s.right)
      }
      const tx = clamp(s.rawLeft + d.toOffset, s.left, s.right)
      const p = Math.min(1, c.t / d.dur)
      c.progress = p
      c.x = lerp(d.fromX, tx, easeInOut(p))
      c.y = lerp(d.fromY, s.top, p) - d.h * 4 * p * (1 - p)
      if (p < 1) return false
      c.place(s, tx)
      c.squash.v = -4.5
      return true
    },
  },

  chase: {
    enter(c) {
      c.set('walk', '', 'run')
    },
    update(c, dt) {
      const L = c.world.laser
      if (!L.active || c.t > 9) return true
      const target = c.world.surfaceUnder(L.x, L.y) ?? c.world.floor
      if (target.id !== c.surfaceId) {
        c.jumpTo(target, clamp(L.x, target.left, target.right), 'chase')
        return false
      }
      const s = c.surface()
      const tx = clamp(L.x, s.left, s.right)
      // another cat is already closer to the dot: sit and watch instead
      const rival = c.world.cats.find(
        (o) => o !== c && o.surfaceId === c.surfaceId && ['chase', 'stalk'].includes(o.state) && Math.abs(o.x - tx) < Math.abs(c.x - tx) && Math.abs(o.x - c.x) < c.world.S * 1.2,
      )
      if (rival) return c.go('sit', { dur: rand(2, 4) })
      if (Math.abs(tx - c.x) < c.world.S * 0.9) return c.go('stalk')
      c.walkTo(tx, cfg.speed.run, 'run', dt)
      return false
    },
  },

  stalk: {
    enter(c, d) {
      c.set('walk', 'crouch')
      d.dur = rand(0.6, 1.3)
    },
    update(c, dt, d) {
      const L = c.world.laser
      if (!L.active) return true
      c.facing = L.x >= c.x ? 1 : -1
      if (Math.abs(L.x - c.x) > c.world.S * 2.2) return c.go('chase')
      if (c.t > d.dur) {
        const s = c.surface()
        const tx = clamp(L.x, s.left, s.right)
        c.go('jump', { toId: s.id, toOffset: tx - s.rawLeft, fromX: c.x, fromY: c.y, h: c.world.S * 0.45, dur: 0.42, pounce: true, after: 'landPounce' })
      }
      return false
    },
  },

  landPounce: {
    enter(c) {
      const L = c.world.laser
      if (L.active && Math.abs(L.x - c.x) < c.world.S * 0.6) c.go('excited')
      else c.go('sit', { dur: rand(1, 2) })
    },
  },

  excited: {
    enter(c, d) {
      c.set('sit', 'excited')
      d.dur = 1.3
      for (let i = 0; i < 7; i++) c.particle('star')
    },
    update(c, dt, d) {
      c.hop = -Math.sin(Math.PI * Math.min(1, c.t / 0.45)) * c.world.S * 0.22
      c.progress = Math.min(1, c.t / 0.55)
      if (c.t > 0.6) c.show('sitting')
      return c.t > d.dur
    },
  },

  groom: {
    enter(c, d) {
      c.set('sit', 'groom')
      d.dur = rand(3, 5)
    },
    update(c, dt, d) {
      if (c.every(dt, 'check', 0.7) && c.coveringControl()) return c.go('walk', { away: true })
      return c.t > d.dur
    },
  },

  stretch: {
    enter(c, d) {
      c.set('walk', 'stretch')
      d.dur = 1.7
    },
    update: (c, dt, d) => c.t > d.dur,
  },

  yawn: {
    enter(c, d) {
      c.set('sit', 'yawn')
      d.dur = 1.3
    },
    update: (c, dt, d) => c.t > d.dur,
  },

  sleep: {
    enter(c, d) {
      c.set('loaf', 'sleep')
      d.idleSleep = c.world.idle
      d.dur = d.idleSleep ? Infinity : rand(10, 25)
    },
    update(c, dt, d) {
      if (c.every(dt, 'z', 1.5)) c.particle('z')
      if (d.idleSleep && !c.world.idle) {
        d.wakeAt ??= c.t + rand(0, 1.5)
        if (c.t > d.wakeAt) return c.go('yawn', { after: 'stretch' })
      }
      if (c.every(dt, 'check', 0.8) && c.coveringControl()) return c.go('walk', { away: true })
      return c.t > d.dur
    },
  },

  knock: {
    enter(c) {
      const chips = c.world.surfaces.filter((s) => s.kind === 'chip' && !c.world.isCrowded(s, c))
      if (!chips.length) return c.go('walk')
      const chip = chips[Math.floor(Math.random() * chips.length)]
      c.jumpTo(chip, (chip.left + chip.right) / 2, 'knockOff', { el: chip.el })
    },
  },

  knockOff: {
    enter(c, d) {
      c.set('sit', '')
      c.lookCamera = true // stare at the viewer first, like they do
      c.facing = Math.random() < 0.5 ? 1 : -1
    },
    update(c, dt, d) {
      if (c.t > 1.3 && !d.swiped) {
        d.swiped = true
        c.lookCamera = false
        c.set('sit', 'swipe')
      }
      if (d.swiped && !d.knocked && c.t > 1.65) {
        d.knocked = true
        knockOff(d.el, c.facing) // the chip vanishes from under the cat -> it jumps off
      }
      return c.t > 3
    },
  },

  box: {
    enter(c) {
      const box = c.world.surfaces.find((s) => s.kind === 'box' && !c.world.isCrowded(s, c))
      if (!box) return c.go('walk')
      c.jumpTo(box, lerp(box.left, box.right, rand(0.3, 0.7)), 'peek')
    },
  },

  peek: {
    enter(c, d) {
      c.set('sit', '')
      c.el.dataset.peek = '1'
      c.sinkTarget = c.world.S * 0.5
      d.dur = rand(6, 12)
    },
    update(c, dt, d) {
      c.faceTarget()
      return c.t > d.dur
    },
  },

  sunbathe: {
    enter(c, d) {
      if (c.surfaceId !== 'floor') return c.jumpTo(c.world.floor, clamp(c.world.sunX, c.world.floor.left, c.world.floor.right), 'sunbathe')
      d.dur = rand(12, 20)
    },
    update(c, dt, d) {
      if (Math.abs(c.world.sunX - c.x) > c.world.S * 0.6) {
        c.walkTo(clamp(c.world.sunX, c.world.floor.left, c.world.floor.right), cfg.speed.walk, 'walk', dt)
      } else {
        c.set('loaf', 'sleep')
        if (c.every(dt, 'z', 1.6)) c.particle('z')
      }
      return c.t > d.dur
    },
  },

  type: {
    enter(c, d) {
      const kb = c.world.surfaces.find((s) => s.kind === 'keyboard' && s.el.dataset.ready)
      if (!kb) return c.go('walk')
      if (c.surfaceId !== kb.id) return c.jumpTo(kb, kb.left, 'type')
      d.tx = c.x - kb.left < kb.right - c.x ? kb.right : kb.left
    },
    update(c, dt, d) {
      if (c.every(dt, 'key', 0.12)) catBus.emit('type', TYPE_KEYS[Math.floor(Math.random() * TYPE_KEYS.length)])
      if (c.walkTo(d.tx, cfg.speed.walk * 0.8, 'walk', dt)) return c.go('hop')
      return false
    },
  },

  zoomies: {
    enter(c, d) {
      if (c.surfaceId !== 'floor') return c.jumpTo(c.world.floor, clamp(c.x, c.world.floor.left, c.world.floor.right), 'zoomies')
      const f = c.world.floor
      d.legs = Math.random() < 0.5 ? 2 : 3
      d.tx = c.x - f.left > f.right - c.x ? f.left : f.right
    },
    update(c, dt, d) {
      const f = c.world.floor
      if (c.walkTo(d.tx, cfg.speed.zoomies, 'run', dt)) {
        if (--d.legs <= 0) return c.go('sit', { mood: 'excited', dur: 1.2 })
        d.tx = d.tx === f.left ? f.right : f.left
      }
      return false
    },
  },

  purr: {
    enter(c) {
      c.set('sit', 'happy')
    },
    update(c, dt) {
      c.petTime += dt
      if (c.every(dt, 'heart', 0.55)) c.particle('heart')
      if (c.petTime > 3.5) return c.go('swat')
      if (c.pet < 25 && c.t > 0.8) return Math.random() < 0.5 ? c.go('roll') : true
      return false
    },
  },

  roll: {
    enter(c, d) {
      c.set('roll')
      d.dur = rand(2.5, 4.5)
    },
    update(c, dt, d) {
      if (c.every(dt, 'heart', 0.9)) c.particle('heart')
      return c.t > d.dur
    },
  },

  swat: {
    enter(c, d) {
      c.set('sit', 'swipe')
      const p = c.world.pointer
      c.facing = p.x >= c.x ? 1 : -1
      c.pet = 0
      c.petTime = 0
      d.dur = 0.6
    },
    update(c, dt, d) {
      if (c.t > d.dur) return c.go('trot')
      return false
    },
  },

  startled: {
    enter(c, d) {
      c.set('sit', 'startled')
      c.squash.v = 4
      d.dur = 0.8
    },
    update(c, dt, d) {
      c.hop = -Math.sin(Math.PI * Math.min(1, c.t / 0.3)) * c.world.S * 0.15
      return c.t > d.dur
    },
  },
}

// Behaviors that are only possible in some situations
const AVAILABLE = {
  chase: (w) => w.laser.active,
  knock: (w) => w.surfaces.some((s) => s.kind === 'chip'),
  box: (w) => w.surfaces.some((s) => s.kind === 'box'),
  type: (w) => w.surfaces.some((s) => s.kind === 'keyboard' && s.el.dataset.ready),
  zoomies: (w) => w.W > 500,
}

const CALM = { sit: 3, groom: 1, sleep: 2, yawn: 0.5 }

// ---------------------------------------------------------------------------
class Cat {
  constructor(def, el, world) {
    this.def = def
    this.el = el
    this.inner = el.querySelector('.cat-inner')
    this.fx = el.querySelector('.cat-fxs')
    this.anims = Object.fromEntries([...el.querySelectorAll('.anim')].map((a) => [a.dataset.anim, a]))
    this.anim = 'sitting'
    this.animStart = 0
    this.frameIndex = -1
    this.progress = 0
    this.stride = 0 // px walked, drives the walk/run frames
    this.gait = ''
    this.seed = Math.random() * 10
    this.world = world
    this.x = 0
    this.y = 0
    this.facing = 1
    this.surfaceId = 'floor'
    this.offset = 0
    this.squash = { value: 1, v: 0 }
    this.sink = 0
    this.sinkTarget = 0
    this.hop = 0
    this.pet = 0
    this.petTime = 0
    this.look = { x: 0, y: 0 }
    this.lookCamera = false
    this.timers = {}
    this.state = ''
    this.t = 0
    this.data = {}
  }

  surface() {
    return this.world.byId.get(this.surfaceId)
  }

  place(s, x) {
    this.surfaceId = s.id
    this.offset = x - s.rawLeft
    this.x = x
    this.y = s.top
  }

  set(pose, mood = '', gait = '') {
    const ds = this.el.dataset
    if (ds.pose !== pose) ds.pose = pose
    if (ds.mood !== mood) ds.mood = mood
    if (ds.gait !== gait) ds.gait = gait
    this.gait = gait
    this.show(pickAnim(pose, mood, gait))
  }

  // switch to another animation, with a little "pop"
  show(anim) {
    if (anim === this.anim) return
    this.anims[this.anim]?.classList.remove('on')
    this.anims[anim]?.classList.add('on')
    this.anim = anim
    this.animStart = performance.now() / 1000
    this.progress = 0
    this.frameIndex = -1
    this.squash.v -= 1.2
  }

  // pick the frame of the current animation for this moment
  updateFrame(now) {
    const el = this.anims[this.anim]
    if (!el) return
    const n = Number(el.dataset.n)
    const play = PLAYBACK[this.anim] ?? { fps: 4 }
    const t = now - this.animStart
    let i
    if (play.progress) i = Math.floor(this.progress * n)
    else if (play.stride) i = Math.floor(this.stride / (this.world.S * play.stride))
    else if (play.seq) i = play.seq[Math.floor(t * play.fps) % play.seq.length]
    else if (play.once) i = Math.min(play.hold ?? n - 1, Math.floor(t * play.fps))
    else if (play.pingpong) {
      const k = Math.floor(t * play.fps) % (2 * n - 2)
      i = k < n ? k : 2 * n - 2 - k
    } else i = Math.floor(t * play.fps)
    i = ((i % n) + n) % n
    if (i === this.frameIndex) return
    this.frameIndex = i
    el.style.backgroundPositionX = n > 1 ? `${(i / (n - 1)) * 100}%` : '0%'
  }

  go(name, data = {}) {
    if (this.el.dataset.peek) {
      delete this.el.dataset.peek
      this.sinkTarget = 0
    }
    this.lookCamera = false
    this.hop = 0
    this.state = name
    this.t = 0
    this.data = data
    this.timers = {}
    STATES[name].enter?.(this, data)
    return false
  }

  jumpTo(s, x, after = 'sit', afterData = {}) {
    const fromY = this.y + this.sink
    this.sink = 0
    this.go('jump', { toId: s.id, toOffset: x - s.rawLeft, fromX: this.x, fromY, after, afterData })
  }

  next() {
    const { after, afterData } = this.data
    if (after) return this.go(after, afterData)
    const w = this.world
    if (w.idle) return this.go('sleep')
    const weights = w.reduced
      ? CALM
      : Object.fromEntries(Object.entries(this.def.weights).filter(([k]) => !AVAILABLE[k] || AVAILABLE[k](w)))
    let pick = pickWeighted(weights)
    if (pick === this.state && pick !== 'sit') pick = 'sit'
    this.go(pick)
  }

  // true once every `interval` seconds for the named timer
  every(dt, name, interval) {
    this.timers[name] = (this.timers[name] ?? 0) + dt
    if (this.timers[name] < interval) return false
    this.timers[name] = 0
    return true
  }

  walkTo(tx, speed, gait, dt) {
    const dx = tx - this.x
    const step = speed * (this.world.S / 96) * dt
    this.set('walk', '', gait)
    if (Math.abs(dx) <= step) {
      this.offset += dx
      this.x = tx
      return true
    }
    this.facing = dx > 0 ? 1 : -1
    this.offset += Math.sign(dx) * step
    this.x += Math.sign(dx) * step
    this.stride += step
    return false
  }

  faceTarget() {
    const t = this.world.gazeTarget()
    if (t && Math.abs(t.x - this.x) > this.world.S * 0.5) this.facing = t.x > this.x ? 1 : -1
  }

  freeSpot(s, away = false) {
    if (!s) return this.x
    const others = this.world.cats.filter((o) => o !== this && o.surfaceId === s.id)
    const p = this.world.pointer
    let best = this.x
    let bestScore = -Infinity
    for (let i = 0; i < 10; i++) {
      const x = rand(s.left, s.right)
      let score = Math.min(...others.map((o) => Math.abs(o.x - x)), this.world.S * 3)
      if (away && p.inside) score += Math.min(Math.abs(p.x - x), this.world.S * 3)
      if (score > bestScore) {
        bestScore = score
        best = x
      }
    }
    return best
  }

  crowded() {
    return this.world.cats.some(
      (o) => o !== this && o.surfaceId === this.surfaceId && o.state !== 'jump' && Math.abs(o.x - this.x) < this.world.S * 0.7,
    )
  }

  // A cat sitting on a link or button near the cursor politely moves.
  coveringControl() {
    const p = this.world.pointer
    const S = this.world.S
    if (!p.inside || Math.hypot(p.x - this.x, p.y - (this.y - S / 2)) > S * 1.3) return false
    return document
      .elementsFromPoint(this.x, this.y - S * 0.4)
      .some((el) => !el.closest('.cat-world') && el.closest('a, button'))
  }

  particle(type) {
    spawnParticle(this.fx, type, this.world.S)
  }

  lost() {
    const w = this.world
    const options = [...w.surfaces].sort((a, b) => Math.abs(a.top - this.y) - Math.abs(b.top - this.y))
    const s = options[0] ?? w.floor
    this.jumpTo(s, clamp(this.x, s.left, s.right), Math.random() < 0.4 ? 'startled' : 'sit')
  }

  update(dt) {
    const w = this.world
    this.t += dt
    this.pet *= Math.pow(0.35, dt)

    if (this.state !== 'jump') {
      const s = this.surface()
      if (!s) this.lost()
      else {
        this.y = s.top
        this.x = s.rawLeft + this.offset
        if (!this.data.free) {
          const cx = clamp(this.x, s.left, s.right)
          this.offset += cx - this.x
          this.x = cx
        }
      }
    }

    if (STATES[this.state].update?.(this, dt, this.data)) this.next()

    // eyes follow the laser / cursor with a little lag
    const target = this.lookCamera ? null : w.gazeTarget()
    let lx = 0
    let ly = 0
    if (target) {
      const dx = target.x - this.x
      const dy = target.y - (this.y - w.S * 0.62)
      const d = Math.hypot(dx, dy) || 1
      const k = Math.min(1, d / (w.S * 2))
      lx = (dx / d) * k * 2.4
      ly = (dy / d) * k * 2
    }
    this.look.x += (lx - this.look.x) * 0.15
    this.look.y += (ly - this.look.y) * 0.15

    springStep(this.squash, dt)
    this.sink += (this.sinkTarget - this.sink) * Math.min(1, dt * 8)
    this.render()
  }

  render() {
    const { S } = this.world
    const sy = this.squash.value
    const sx = 1 + (1 - sy) * 0.7
    const t = performance.now() / 1000 + this.seed
    this.updateFrame(performance.now() / 1000)
    let tilt = 0
    let shake = 0
    let bx = 1
    let by = 1
    if (this.anim === 'sleeping' && this.frameIndex === 2) {
      const b = Math.sin(t * 1.5) * 0.025 // slow breathing while curled up
      by += b
      bx -= b * 0.5
    } else if (this.anim === 'sitting') {
      by += Math.sin(t * 2.2) * 0.01
    }
    if (this.state === 'purr') tilt = Math.sin(t * 3) * 3
    if (this.anim === 'startled' && this.t < 0.45) shake = Math.sin(t * 70) * S * 0.02
    this.el.style.transform = `translate3d(${(this.x - S / 2).toFixed(1)}px, ${(this.y - S + this.sink + this.hop).toFixed(1)}px, 0)`
    this.inner.style.transform = `translate(${shake.toFixed(1)}px, 0) rotate(${(tilt * this.facing).toFixed(2)}deg) scale(${(sx * bx * this.facing).toFixed(3)}, ${(sy * by).toFixed(3)})`
    this.el.style.setProperty('--lx', `${(this.look.x * this.facing).toFixed(2)}px`)
    this.el.style.setProperty('--ly', `${this.look.y.toFixed(2)}px`)
    const edge = this.surfaceId !== 'floor' && this.state !== 'jump' ? '1' : ''
    if (this.el.dataset.edge !== edge) this.el.dataset.edge = edge
  }
}

// ---------------------------------------------------------------------------
export function createWorld(root) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const world = {
    cats: [],
    surfaces: [],
    byId: new Map(),
    floor: null,
    W: window.innerWidth,
    H: window.innerHeight,
    S: 96,
    laser: { x: 0, y: 0, active: false, last: -Infinity },
    pointer: { x: 0, y: 0, inside: false },
    lastInput: performance.now(),
    idle: false,
    reduced,
    sunX: 0,
    gazeTarget() {
      if (this.laser.active) return this.laser
      if (this.pointer.inside) return this.pointer
      return null
    },
    surfaceUnder(x, y) {
      let best = null
      for (const s of this.surfaces) {
        if (s.top < y - this.S * 0.3) continue
        if (x < s.left - this.S * 0.5 || x > s.right + this.S * 0.5) continue
        if (!best || s.top < best.top) best = s
      }
      return best
    },
    isCrowded(s, me) {
      const n = this.cats.filter((o) => o !== me && o.surfaceId === s.id).length
      return s.kind === 'floor' ? false : n >= (s.right - s.left > this.S * 3 ? 2 : 1)
    },
  }

  const laserEl = root.querySelector('.laser')
  const sunEl = root.querySelector('.sunbeam')

  const resize = () => {
    world.W = window.innerWidth
    world.H = window.innerHeight
    world.S = world.W < 640 ? cfg.size.mobile : cfg.size.desktop
    root.style.setProperty('--cat-size', `${world.S}px`)
  }
  resize()

  const refreshSurfaces = () => {
    world.surfaces = readSurfaces(world.W, world.H, world.S)
    world.byId = new Map(world.surfaces.map((s) => [s.id, s]))
    world.floor = world.byId.get('floor')
  }
  refreshSurfaces()

  root.querySelectorAll('.cat').forEach((el, i) => {
    const def = cfg.cats.find((d) => d.id === el.dataset.cat)
    const cat = new Cat(def, el, world)
    world.cats.push(cat)
    const f = world.floor
    const home = lerp(f.left, f.right, [0.18, 0.5, 0.82][i % 3])
    if (reduced) {
      cat.place(f, home)
      cat.go(def.start)
    } else {
      // walk in from the sides of the screen
      const start = i % 2 ? world.W + world.S * (1 + i * 0.6) : -world.S * (1 + i * 0.9)
      cat.place(f, start)
      cat.go('walk', { toX: home, free: true, speed: cfg.speed.trot, gait: 'trot', after: def.start })
    }

    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return
      cat.pet += Math.hypot(e.movementX, e.movementY)
      if (cat.pet > 140 && !['purr', 'swat', 'jump', 'sleep'].includes(cat.state)) cat.go('purr')
    })
    el.addEventListener('pointerdown', () => {
      if (cat.state !== 'jump') cat.go('excited')
    })
  })

  // ---- input ----
  const input = () => {
    world.lastInput = performance.now()
  }
  const onPointerMove = (e) => {
    input()
    world.pointer.x = e.clientX
    world.pointer.y = e.clientY
    world.pointer.inside = true
    if (e.pointerType === 'mouse') {
      world.laser.x = e.clientX
      world.laser.y = e.clientY
      world.laser.last = performance.now()
    }
  }
  const onPointerDown = (e) => {
    input()
    if (e.pointerType !== 'mouse') {
      world.laser.x = e.clientX
      world.laser.y = e.clientY
      world.laser.last = performance.now()
    }
  }
  const onLeave = (e) => {
    if (!e.relatedTarget) world.pointer.inside = false
  }
  let lastY = window.scrollY
  let lastStartle = 0
  const onScroll = () => {
    input()
    const dy = Math.abs(window.scrollY - lastY)
    lastY = window.scrollY
    const now = performance.now()
    if (reduced || dy < cfg.fastScrollPx || now - lastStartle < 1500) return
    lastStartle = now
    world.cats.forEach((c) => {
      if (['sit', 'groom', 'walk'].includes(c.state) && Math.random() < 0.7) c.go('startled')
    })
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerdown', onPointerDown, { passive: true })
  window.addEventListener('keydown', input)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', resize)
  document.addEventListener('mouseout', onLeave)

  // ---- loop ----
  let raf
  let prev = performance.now()
  const tick = (now) => {
    const dt = Math.min(0.05, (now - prev) / 1000)
    prev = now
    refreshSurfaces()
    world.idle = now - world.lastInput > cfg.sleepAfterMs
    world.laser.active = !reduced && now - world.laser.last < cfg.laserTimeoutMs
    const f = world.floor
    world.sunX = lerp(f.left, f.right, 0.5 + 0.5 * Math.sin(now / 38000))

    laserEl.style.transform = `translate3d(${world.laser.x}px, ${world.laser.y}px, 0)`
    laserEl.style.opacity = world.laser.active ? '1' : '0'
    sunEl.style.transform = `translate3d(${world.sunX}px, 0, 0)`

    // a moving laser dot is hard to ignore, especially for the black cat
    if (world.laser.active) {
      world.cats.forEach((c) => {
        const rate = c.def.weights.chase / 6
        if (['sit', 'groom', 'walk'].includes(c.state) && !c.data.free && Math.random() < rate * dt) c.go('chase')
      })
    }
    world.cats.forEach((c) => c.update(dt))
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)

  window.__cats = {
    get cats() {
      return world.cats.map((c) => ({ id: c.def.id, state: c.state, x: Math.round(c.x), y: Math.round(c.y), surface: c.surfaceId }))
    },
    world,
  }

  return {
    destroy() {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', input)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
      document.removeEventListener('mouseout', onLeave)
      delete window.__cats
    },
  }
}
