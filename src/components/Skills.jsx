import { skills } from '../content'
import { Section } from './ui'

export default function Skills({ t }) {
  return (
    <Section id="skills" title={t.title} subtitle={t.subtitle}>
      <ul dir="ltr" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {skills.map((s) => (
          <li
            key={s}
            data-cat-surface="chip"
            className="rounded-2xl border border-ink/10 bg-paper px-4 py-4 text-center font-semibold transition duration-150 ease-(--ease-soft) hover:-translate-y-px hover:shadow-md dark:border-white/10 dark:bg-night"
          >
            {s}
          </li>
        ))}
      </ul>
    </Section>
  )
}
