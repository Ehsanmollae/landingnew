import { Section } from './ui'

export default function About({ t }) {
  return (
    <Section id="about" title={t.title}>
      <div className="grid items-center gap-10 md:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
          {t.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
          {t.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{s.value}</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
