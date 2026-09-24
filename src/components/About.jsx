import { Section } from './ui'

export default function About({ t }) {
  return (
    <Section id="about" title={t.title}>
      <div className="grid items-center gap-10 md:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5 text-lg leading-8 text-ink/75 dark:text-cream/75">
          {t.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
          {t.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-ink/10 bg-paper p-5 text-center shadow-sm dark:border-white/10 dark:bg-night"
            >
              <div className="text-3xl font-extrabold font-display text-tangerine-deep dark:text-tangerine">{s.value}</div>
              <div className="mt-1 text-sm text-ink/60 dark:text-cream/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
