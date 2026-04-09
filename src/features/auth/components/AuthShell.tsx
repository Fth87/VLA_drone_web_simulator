import type { ReactNode } from 'react'

interface AuthShellProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="island-shell w-full max-w-md rounded-2xl p-6 md:p-8">
        <p className="island-kicker mb-3">Drone Access</p>
        <h1 className="display-title mb-2 text-3xl">{title}</h1>
        <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">{description}</p>
        {children}
        {footer ? <div className="mt-6">{footer}</div> : null}
      </section>
    </main>
  )
}
