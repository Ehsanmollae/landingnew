import { Section } from './ui'

export default function Experience({ t }) {
  return (
    <Section id="experience" title={t.title}>
      <ol className="relative mx-auto max-w-3xl border-s-2 border-ink/15 dark:border-white/15">
        {t.items.map((e) => (
          <li key={e.period + e.role} className="relative mb-10 ps-8 last:mb-0">
            <span className="absolute -start-[9px] top-1.5 h-4 w-4 rounded-full border-4 border-white bg-tangerine dark:border-shelf-dark" />
            <time className="text-sm font-semibold text-tangerine-deep dark:text-tangerine">{e.period}</time>
            <h3 className="mt-1 text-xl font-bold ">{e.role}</h3>
            <p className="text-ink/60 dark:text-cream/60">{e.company}</p>
            <p className="mt-2 leading-7 text-ink/75 dark:text-cream/75">{e.desc}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
