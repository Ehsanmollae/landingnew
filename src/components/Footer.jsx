export default function Footer({ name, text }) {
  return (
    <footer className="border-t border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      © {new Date().getFullYear()} {name}. {text}
    </footer>
  )
}
