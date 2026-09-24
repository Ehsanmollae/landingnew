import { links } from '../content'
import { Icon } from './ui'

export default function Hero({ t }) {
  const initial = t.name.trim().charAt(0)
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 sm:pt-40 sm:pb-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 inset-x-0 mx-auto h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-600/20" />
        <div className="absolute top-40 end-0 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-fuchsia-600/15" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.4fr_1fr]">
        <div className="text-center md:text-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            {t.available}
          </span>
          <p className="mt-6 text-lg text-slate-500 dark:text-slate-400">{t.greeting}</p>
          <h1 className="mt-1 text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
            {t.name}
          </h1>
          <p className="mt-3 bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
            {t.role}
          </p>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600 md:mx-0 dark:text-slate-300">
            {t.tagline}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <a
              href="#projects"
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:bg-indigo-500"
            >
              {t.ctaPrimary}
            </a>
            <a
              href="#contact"
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              {t.ctaSecondary}
            </a>
          </div>

          <div className="mt-8 flex justify-center gap-4 text-slate-500 md:justify-start dark:text-slate-400">
            {['github', 'linkedin', 'telegram'].map((k) => (
              <a key={k} href={links[k]} target="_blank" rel="noreferrer" aria-label={k} className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
                <Icon name={k} className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>

        <div className="mx-auto">
          <div className="relative h-60 w-60 sm:h-72 sm:w-72">
            <div className="absolute inset-0 rotate-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-fuchsia-500 opacity-80" />
            <div className="absolute inset-0 grid place-items-center rounded-[2.5rem] border border-slate-200 bg-white text-8xl font-extrabold text-indigo-600 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-400">
              {initial}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
