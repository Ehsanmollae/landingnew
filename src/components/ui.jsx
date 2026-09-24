export function Section({ id, title, subtitle, children, className = '' }) {
  return (
    <section id={id} className={`px-4 py-20 sm:px-6 sm:py-24 ${className}`}>
      <div className="reveal mx-auto max-w-6xl">
        {title && (
          <header className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              {title}
            </h2>
            {subtitle && <p className="mt-3 text-slate-500 dark:text-slate-400">{subtitle}</p>}
            <span className="mx-auto mt-5 block h-1 w-14 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
          </header>
        )}
        {children}
      </div>
    </section>
  )
}

const paths = {
  github:
    'M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z',
  linkedin:
    'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z',
  telegram:
    'M9.78 15.65 9.4 21c.54 0 .78-.23 1.06-.51l2.54-2.43 5.27 3.86c.97.53 1.65.25 1.91-.89l3.46-16.2c.31-1.43-.52-1.99-1.46-1.64L1.83 11.07C.44 11.61.46 12.39 1.59 12.74l5.2 1.62L18.87 6.8c.57-.37 1.08-.17.66.2L9.78 15.65Z',
  mail: 'M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13Zm2.3-.5 7.7 6.2L19.7 5H4.3ZM20 6.9l-7.37 5.93a1 1 0 0 1-1.26 0L4 6.9v11.6c0 .28.22.5.5.5h15a.5.5 0 0 0 .5-.5V6.9Z',
}

export function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  )
}
