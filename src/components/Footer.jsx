export default function Footer({ name, text }) {
  return (
    <footer className="relative z-[1] px-4 py-8 text-center text-sm text-white/80">
      © {new Date().getFullYear()} {name}. {text}
    </footer>
  )
}
