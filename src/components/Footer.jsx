export default function Footer({ name, text }) {
  return (
    <footer className="relative z-[1] px-4 pt-8 pb-28 text-center text-sm text-ink/60 dark:text-cream/60">
      © {new Date().getFullYear()} {name}. {text}
    </footer>
  )
}
