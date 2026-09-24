import { Section } from './ui'

export default function Experience({ t }) {
  return (
    <Section id="experience" title={t.title}>
      <ol className="relative mx-auto max-w-3xl border-s-2 border-slate-200 dark:border-slate-800">
        {t.items.map((e) => (
          <li key={e.period + e.role} className="relative mb-10 ps-8 last:mb-0">
            <span className="absolute -start-[9px] top-1.5 h-4 w-4 rounded-full border-4 border-white bg-indigo-500 dark:border-slate-950" />
            <time className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{e.period}</time>
            <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{e.role}</h3>
            <p className="text-slate-500 dark:text-slate-400">{e.company}</p>
            <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">{e.desc}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
