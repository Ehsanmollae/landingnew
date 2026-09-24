import { useEffect, useState } from 'react'

const sections = ['about', 'skills', 'projects', 'experience', 'contact']

export default function Navbar({ t, dark, onToggleTheme, onToggleLang }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const btn =
    'grid h-10 min-w-10 place-items-center rounded-xl border border-slate-200 px-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition ${
        scrolled || open
          ? 'border-b border-slate-200/70 bg-white/80 backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-950/80'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
          {t.hero.name}
          <span className="text-indigo-500">.</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <li key={s}>
              <a
                href={`#${s}`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
              >
                {t.nav[s]}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button onClick={onToggleLang} className={btn} aria-label="Switch language">
            {t.switchLabel}
          </button>
          <button onClick={onToggleTheme} className={btn} aria-label={t.themeLabel}>
            {dark ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className={`${btn} md:hidden`}
            aria-label="Menu"
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <ul className="border-t border-slate-200 px-4 pb-4 md:hidden dark:border-slate-800">
          {sections.map((s) => (
            <li key={s}>
              <a
                href={`#${s}`}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {t.nav[s]}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
