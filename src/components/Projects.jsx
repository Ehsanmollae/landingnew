import { Section } from './ui'

const tones = [
  'bg-tangerine text-ink',
  'bg-ink text-paper dark:bg-cream dark:text-ink',
  'bg-[#e9dfcc] text-ink',
]

export default function Projects({ t }) {
  return (
    <Section id="projects" title={t.title} subtitle={t.subtitle}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {t.items.map((p, i) => (
          <article
            key={p.title}
            data-cat-surface="shelf"
            className="group flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-paper transition duration-200 ease-(--ease-soft) hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-night"
          >
            <div className={`grid h-40 place-items-center ${tones[i % tones.length]}`}>
              <span className="font-display text-6xl transition duration-300 ease-(--ease-soft) group-hover:scale-110">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-bold">{p.title}</h3>
              <p className="mt-2 flex-1 leading-7 text-ink/70 dark:text-cream/70">{p.desc}</p>
              <ul dir="ltr" className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <li key={tag} className="rounded-full bg-tangerine/15 px-3 py-1 text-xs font-medium text-tangerine-deep dark:text-tangerine">
                    {tag}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex gap-4 text-sm font-semibold">
                <a href={p.link} className="underline decoration-tangerine decoration-2 underline-offset-4 hover:decoration-ink dark:hover:decoration-cream">
                  {t.view} ↗
                </a>
                <a href={p.repo} className="text-ink/60 hover:text-ink dark:text-cream/60 dark:hover:text-cream">
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
