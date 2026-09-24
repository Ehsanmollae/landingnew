import { links } from '../content'
import { Icon, Section } from './ui'

export default function Contact({ t }) {
  return (
    <Section id="contact">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 px-6 py-14 text-center text-white shadow-2xl sm:px-12">
        <h2 className="text-3xl font-extrabold sm:text-4xl">{t.title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">{t.body}</p>
        <a
          href={`mailto:${links.email}`}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5"
        >
          <Icon name="mail" />
          {t.cta}
        </a>
        <p dir="ltr" className="mt-4 text-sm text-indigo-100">{links.email}</p>
        <div className="mt-8 flex justify-center gap-5">
          {['github', 'linkedin', 'telegram'].map((k) => (
            <a key={k} href={links[k]} target="_blank" rel="noreferrer" aria-label={k} className="opacity-80 transition hover:opacity-100">
              <Icon name={k} className="h-6 w-6" />
            </a>
          ))}
        </div>
      </div>
    </Section>
  )
}
