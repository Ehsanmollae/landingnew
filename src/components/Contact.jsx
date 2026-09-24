import { links } from '../content'
import { Icon, Section } from './ui'

// The contact card is a cardboard box. The cats know what to do with boxes.
export default function Contact({ t }) {
  return (
    <Section id="contact" bare>
      <div
        data-cat-surface="box"
        className="relative mx-auto mt-10 max-w-3xl rounded-[14px] bg-cardboard px-6 pt-16 pb-12 text-center text-[#2a1a08] shadow-[inset_0_-14px_0_rgb(0_0_0/0.08),0_24px_48px_-24px_rgb(60_30_0/0.55)] sm:px-12"
      >
        {/* open flaps */}
        <span className="absolute -top-7 left-0 h-7 w-1/2 rounded-t-md bg-cardboard-dark [clip-path:polygon(0_0,90%_0,100%_100%,4%_100%)]" />
        <span className="absolute -top-7 right-0 h-7 w-1/2 rounded-t-md bg-cardboard-dark [clip-path:polygon(10%_0,100%_0,96%_100%,0_100%)]" />
        {/* packing tape */}
        <span className="absolute inset-y-0 left-1/2 w-16 -translate-x-1/2 bg-[#e3bd8a]/50" />

        <span className="absolute top-4 left-4 text-xs font-bold tracking-wider text-[#5a3a14]/70 uppercase">↑↑ {t.up}</span>
        <span className="absolute top-4 right-4 rotate-6 rounded border-2 border-[#9f2a1f] px-2 py-0.5 text-xs font-bold tracking-widest text-[#9f2a1f] uppercase">
          {t.fragile}
        </span>

        <div className="relative">
          <h2 className="font-display text-3xl tracking-tight sm:text-5xl">{t.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#3d2a12]">{t.body}</p>
          <a
            href={`mailto:${links.email}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-paper transition duration-150 ease-(--ease-soft) hover:-translate-y-px hover:shadow-lg"
          >
            <Icon name="mail" />
            {t.cta}
          </a>
          <p dir="ltr" className="mt-4 text-sm text-[#3d2a12]">
            {links.email}
          </p>
          <div className="mt-6 flex justify-center gap-5">
            {['github', 'linkedin', 'telegram'].map((k) => (
              <a key={k} href={links[k]} target="_blank" rel="noreferrer" aria-label={k} className="opacity-75 transition-opacity hover:opacity-100">
                <Icon name={k} className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
