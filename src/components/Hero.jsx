import { useEffect, useState } from 'react'
import { links } from '../content'
import { useTypewriter } from '../hooks/useTypewriter'

const textSize = { fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 400 }
const pill =
  'inline-flex items-center justify-center whitespace-nowrap rounded-full border text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] transition-colors duration-200'

export default function Hero({ t }) {
  const { displayed, done } = useTypewriter(t.typed, 38, 600)
  const [pillsIn, setPillsIn] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setPillsIn(true), 400)
    return () => clearTimeout(id)
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
    <section
      id="top"
      className="relative flex h-screen flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0"
    >
      <div className="relative z-10 max-w-xl text-white">
        <p
          className="pointer-events-none mb-5 select-none sm:mb-6"
          style={{ ...textSize, lineHeight: 1.3, color: '#fff', filter: 'blur(4px)' }}
        >
          {t.intro[0]}
          <br />
          {t.intro[1]}
        </p>

        <p className="mb-5 sm:mb-6" style={{ ...textSize, lineHeight: 1.35, minHeight: 54 }}>
          {displayed}
          {!done && <span className="type-cursor ms-[2px] inline-block h-[1.1em] w-[2px] bg-white align-middle" />}
        </p>

        <div
          className="flex flex-wrap gap-y-1"
          style={{
            opacity: pillsIn ? 1 : 0,
            transform: pillsIn ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          {t.pills.map((p) => (
            <a key={p.href} href={p.href} className={`${pill} border-black/10 bg-white text-black hover:bg-black hover:text-white`}>
              {p.label}
            </a>
          ))}
          <button
            type="button"
            onClick={copyEmail}
            className={`${pill} gap-2 border-white bg-transparent text-white hover:bg-white hover:text-black sm:gap-3`}
          >
            {copied ? (
              t.copied
            ) : (
              <span>
                {t.emailLabel} <span dir="ltr" className="underline underline-offset-1">{links.email}</span>
              </span>
            )}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
              <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1" />
              <path d="M8.5 1H2a1 1 0 0 0-1 1v6.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
