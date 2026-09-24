import { useEffect, useState } from 'react'
import { content } from './content'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'

function readStored(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

function store(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* storage unavailable */
  }
}

export default function App() {
  const [lang, setLang] = useState(() => readStored('lang', 'fa'))
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const t = content[lang] ?? content.fa

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = t.dir
    document.title = `${t.hero.name} | ${t.hero.role}`
    store('lang', lang)
  }, [lang, t])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    store('theme', dark ? 'dark' : 'light')
  }, [dark])

  // Fade sections in as they scroll into view
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <Navbar
        t={t}
        dark={dark}
        onToggleTheme={() => setDark((d) => !d)}
        onToggleLang={() => setLang((l) => (l === 'fa' ? 'en' : 'fa'))}
      />
      <main>
        <Hero t={t.hero} />
        <About t={t.about} />
        <Skills t={t.skills} />
        <Projects t={t.projects} />
        <Experience t={t.experience} />
        <Contact t={t.contact} />
      </main>
      <Footer name={t.hero.name} text={t.footer} />
    </>
  )
}
