import { skills } from '../content'
import { Section } from './ui'

export default function Skills({ t }) {
  return (
    <Section id="skills" title={t.title} subtitle={t.subtitle}>
      <ul dir="ltr" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {skills.map((s) => (
          <li
            key={s}
            className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-center font-semibold text-slate-700 transition hover:-translate-y-1 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500"
          >
            {s}
          </li>
        ))}
      </ul>
    </Section>
  )
}
