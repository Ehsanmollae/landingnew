import { Fragment, useEffect, useState } from 'react'

const sections = ['about', 'skills', 'projects', 'experience']

export default function Navbar({ t, dark, onToggleTheme, onToggleLang }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const iconBtn =
    'grid h-9 min-w-9 place-items-center rounded-full border border-white/40 px-2 text-sm text-white transition-opacity hover:opacity-60'
  const bar = 'block h-[2px] w-6 bg-white transition-all duration-300'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-10 transition-colors duration-300 ${
          scrolled && !open ? 'bg-black/40 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <nav className="flex items-center justify-between px-5 py-4 text-white sm:px-8 sm:py-5">
          <a href="#top" className="flex items-center gap-3">
            <span className="text-[21px] tracking-tight sm:text-[26px]" style={{ fontFamily: 'var(--font-heading)' }}>
              {t.hero.name}
            </span>
            <span className="text-[25px] select-none sm:text-[30px]" style={{ letterSpacing: '-0.02em' }}>
              ✳︎
            </span>
          </a>

          <div className="hidden text-[18px] md:flex lg:text-[23px]">
            {sections.map((s, i) => (
              <Fragment key={s}>
                <a href={`#${s}`} className="transition-opacity hover:opacity-60">
                  {t.nav[s]}
                </a>
                {i < sections.length - 1 && <span className="whitespace-pre">{t.comma}</span>}
              </Fragment>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden text-[18px] underline underline-offset-2 transition-opacity hover:opacity-60 md:inline lg:text-[23px]"
            >
              {t.navCta}
            </a>
            <button onClick={onToggleLang} className={iconBtn} aria-label="Switch language">
              {t.switchLabel}
            </button>
            <button onClick={onToggleTheme} className={iconBtn} aria-label={t.themeLabel}>
              {dark ? '☀︎' : '☾'}
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
              aria-label="Menu"
              aria-expanded={open}
            >
              <span className={`${bar} ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`${bar} ${open ? 'opacity-0' : ''}`} />
              <span className={`${bar} ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </button>
          </div>
        </nav>
      </header>

      <div
        className="fixed inset-0 z-[9] flex flex-col justify-center gap-8 bg-black/90 px-8 text-white backdrop-blur-md transition-opacity duration-300 md:hidden"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
      >
        {sections.map((s) => (
          <a key={s} href={`#${s}`} onClick={() => setOpen(false)} className="text-[32px] font-medium">
            {t.nav[s]}
          </a>
        ))}
        <a href="#contact" onClick={() => setOpen(false)} className="text-[32px] font-medium underline underline-offset-2">
          {t.navCta}
        </a>
      </div>
    </>
  )
}
