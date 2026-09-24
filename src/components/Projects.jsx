import { Section } from './ui'

const gradients = [
  'from-indigo-500 to-sky-400',
  'from-fuchsia-500 to-rose-400',
  'from-emerald-500 to-teal-400',
]

export default function Projects({ t }) {
  return (
    <Section id="projects" title={t.title} subtitle={t.subtitle} className="bg-slate-50 dark:bg-slate-900/40">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {t.items.map((p, i) => (
          <article
            key={p.title}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className={`relative h-40 bg-gradient-to-br ${gradients[i % gradients.length]}`}>
              <span className="absolute inset-0 grid place-items-center text-5xl font-extrabold text-white/90 transition group-hover:scale-110">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{p.title}</h3>
              <p className="mt-2 flex-1 leading-7 text-slate-600 dark:text-slate-300">{p.desc}</p>
              <ul dir="ltr" className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex gap-4 text-sm font-semibold">
                <a href={p.link} className="text-indigo-600 hover:underline dark:text-indigo-400">
                  {t.view} ↗
                </a>
                <a href={p.repo} className="text-slate-500 hover:underline dark:text-slate-400">
                  {t.code}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
