import { useEffect, useState } from 'react'
import { links } from '../content'
import { catBus } from '../cats/bus'
import { useTypewriter } from '../hooks/useTypewriter'
import { Star } from './ui'

const textSize = { fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 400 }
const pill =
  'inline-flex items-center justify-center whitespace-nowrap rounded-full border text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] transition duration-150 ease-(--ease-soft) hover:-translate-y-px'

const stars = [
  'top-[16%] left-[8%] h-5 w-5',
  'top-[24%] right-[12%] h-7 w-7 [animation-delay:-1.2s]',
  'top-[58%] right-[6%] h-4 w-4 [animation-delay:-2.1s]',
  'bottom-[22%] left-[46%] h-3 w-3 [animation-delay:-0.6s]',
  'top-[40%] left-[62%] h-4 w-4 [animation-delay:-2.7s]',
]

export default function Hero({ t }) {
  const { displayed, done } = useTypewriter(t.typed, 38, 600)
  const [pillsIn, setPillsIn] = useState(false)
  const [copied, setCopied] = useState(false)
  const [junk, setJunk] = useState('') // letters a cat "types" by walking on the text

  useEffect(() => {
    const id = setTimeout(() => setPillsIn(true), 400)
    return () => clearTimeout(id)
  }, [])

  // A cat walking over the text adds letters; once it leaves they get backspaced.
  useEffect(() => {
    let startTimer
    let eraseTimer
    const off = catBus.on((type, ch) => {
      if (type !== 'type') return
      setJunk((j) => (j + ch).slice(-14))
      clearTimeout(startTimer)
      clearInterval(eraseTimer)
      startTimer = setTimeout(() => {
        eraseTimer = setInterval(() => {
          setJunk((j) => {
            if (j.length <= 1) clearInterval(eraseTimer)
            return j.slice(0, -1)
          })
        }, 70)
      }, 900)
    })
    return () => {
      off()
      clearTimeout(startTimer)
      clearInterval(eraseTimer)
    }
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(links.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      window.location.href = `mailto:${links.email}`
    }
  }

  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-center overflow-hidden px-5 pt-28 pb-32 sm:px-8 md:px-10">
      {stars.map((cls) => (
        <Star key={cls} className={`twinkle absolute text-tangerine ${cls}`} />
      ))}

      <div className="relative z-10 max-w-2xl">
        <p
          className="pointer-events-none mb-4 select-none"
          style={{ ...textSize, lineHeight: 1.3, filter: 'blur(4px)' }}
        >
          {t.intro[0]}
          <br />
          {t.intro[1]}
        </p>

        <h1 className="font-display mb-6 text-[clamp(48px,10vw,112px)] leading-[0.95] tracking-tight">
          {t.name}
          <span className="text-tangerine">.</span>
        </h1>

        <p
          data-cat-surface="keyboard"
          data-ready={done ? '1' : undefined}
          className="mb-6"
          style={{ ...textSize, lineHeight: 1.35, minHeight: 54 }}
        >
          {displayed}
          {junk && <span className="text-tangerine-deep dark:text-tangerine">{junk}</span>}
          {(!done || junk) && <span className="type-cursor ms-[2px] inline-block h-[1.1em] w-[2px] bg-ink align-middle dark:bg-cream" />}
        </p>

        <div
          data-cat-surface="pills"
          className="flex flex-wrap gap-y-1"
          style={{
            opacity: pillsIn ? 1 : 0,
            transform: pillsIn ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          {t.pills.map((p) => (
            <a
              key={p.href}
              href={p.href}
              className={`${pill} border-ink/10 bg-white text-ink hover:bg-ink hover:text-paper dark:border-white/10 dark:bg-shelf-dark dark:text-cream dark:hover:bg-cream dark:hover:text-ink`}
            >
              {p.label}
            </a>
          ))}
          <button
            type="button"
            onClick={copyEmail}
            className={`${pill} gap-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-paper sm:gap-3 dark:border-cream dark:text-cream dark:hover:bg-cream dark:hover:text-ink`}
          >
            {copied ? (
              t.copied
            ) : (
              <span>
                {t.emailLabel}{' '}
                <span dir="ltr" className="underline underline-offset-1">
                  {links.email}
                </span>
              </span>
            )}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
              <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1" />
              <path d="M8.5 1H2a1 1 0 0 0-1 1v6.5" />
            </svg>
          </button>
        </div>

        <p className="mt-8 flex items-center gap-2 text-sm text-ink/55 dark:text-cream/55">
          <span className="inline-block h-2 w-2 rounded-full bg-laser shadow-[0_0_8px_2px_rgb(255_59_48/0.5)]" />
          {t.hint}
        </p>
      </div>
    </section>
  )
}
