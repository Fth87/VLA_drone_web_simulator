import { createFileRoute } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'

const RobloxModelViewer = lazy(() => import('../components/RobloxModelViewer'))

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <Suspense
        fallback={
          <div className="viewer-shell flex h-screen w-screen items-center justify-center text-center text-sm text-[var(--sea-ink-soft)]">
            Memuat simulator drone...
          </div>
        }
      >
        <RobloxModelViewer />
      </Suspense>
    </main>
  )
}
