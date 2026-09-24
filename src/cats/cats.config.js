// Cat videos live in public/cats/. See docs/cats-video-guide.md for how to make them.
// Any file that is missing is skipped; if the look video is missing the SVG placeholder cats are shown.
const base = import.meta.env.BASE_URL

export const catsConfig = {
  // Main scrub video: cats turn their gaze from the far left of the frame to the far right.
  // Tried in order; the mobile file is only tried on narrow screens.
  look: {
    mobile: `${base}cats/look-mobile.mp4`,
    desktop: `${base}cats/look.mp4`,
  },

  // Short reaction clips. Their first and last frames must match the middle frame of look.mp4.
  reactions: {
    click: `${base}cats/react-click.mp4`,
    scroll: `${base}cats/react-scroll.mp4`,
    section: {
      about: `${base}cats/react-about.mp4`,
      skills: `${base}cats/react-skills.mp4`,
      projects: `${base}cats/react-projects.mp4`,
      experience: `${base}cats/react-experience.mp4`,
      contact: `${base}cats/react-contact.mp4`,
    },
  },

  // Cats are framed on the right of the video, text on the left (like the reference).
  // In Persian (RTL) the video is mirrored so the cats end up opposite the text.
  objectPosition: '70% center',

  followSmoothing: 0.12, // 0..1, higher = cats snap to the cursor faster
  idleReturnMs: 3000, // after this long without input the cats drift back to the center
  clickCooldownMs: 1200,
  scrollCooldownMs: 2500,
  fastScrollPx: 60, // scroll distance per frame that counts as "fast"
}
