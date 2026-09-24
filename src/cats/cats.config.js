// Tuning for the three cats. Their drawings live in public/cats/<id>/<pose>.webp
// (cut from art/ by scripts/cut-poses.py); `colors` only styles the SVG fallback.
// Speeds are in px/second for a 96px cat and scale with size.
export const catsConfig = {
  size: { desktop: 96, mobile: 64 },
  sleepAfterMs: 20000, // no input for this long -> cats fall asleep one by one
  laserTimeoutMs: 2500, // laser dot fades after the mouse stops for this long
  fastScrollPx: 45, // scroll distance per frame that startles the cats
  speed: { walk: 55, trot: 120, run: 240, zoomies: 480 },

  cats: [
    {
      id: 'black',
      colors: { fur: '#1C1C1E', far: '#0d0d0e', line: '#48484e', stripe: '#000', iris: '#F5C518', pupil: '#1C1C1E', lid: '#6b6b72', nose: '#3a3a3f' },
      // weights: how likely each behavior is when the cat picks something new
      weights: { sit: 3, walk: 2, trot: 1, hop: 2, chase: 9, groom: 1, stretch: 0.5, yawn: 0.3, sleep: 0.5, knock: 1, box: 0.6, sunbathe: 0.2, type: 0.8, zoomies: 0.6, roll: 0.5 },
      start: 'sit',
    },
    {
      id: 'orange',
      colors: { fur: '#F08A2B', far: '#d4731b', line: '#b85c10', stripe: '#d0680f', stripes: true, iris: '#7BC67B', pupil: '#1C1C1E', lid: '#8a4508', nose: '#a8480c' },
      weights: { sit: 4, walk: 1.5, trot: 0.3, hop: 1, chase: 1.5, groom: 1, stretch: 0.8, yawn: 1, sleep: 3, knock: 0.4, box: 3, sunbathe: 3, type: 0.5, zoomies: 0.1, roll: 1 },
      start: 'sleep',
    },
    {
      id: 'white',
      colors: { fur: '#FAFAFA', far: '#e9e4da', line: '#cfc7b8', stripe: '#e5dfd3', iris: '#5DADE2', pupil: '#1C1C1E', lid: '#b3aa99', nose: '#e8a0a8', outline: '#d9d2c4' },
      weights: { sit: 3, walk: 2, trot: 0.6, hop: 1.5, chase: 3, groom: 3, stretch: 1.2, yawn: 0.5, sleep: 1, knock: 3, box: 1, sunbathe: 0.5, type: 1, zoomies: 0.4, roll: 0.6 },
      start: 'groom',
    },
  ],
}
