import { createFileRoute, redirect } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'

import { isAuthenticated } from '../features/auth'

const RobloxModelViewer = lazy(() => import('../components/RobloxModelViewer'))

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    if (typeof window === 'undefined') {
      return
    }

    if (!(await isAuthenticated())) {
      throw redirect({ to: '/login' })
    }
  },
  component: App,
})

function App() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <Suspense
        fallback={
          <div className="viewer-shell flex h-screen w-screen items-center justify-center text-center text-sm text-(--sea-ink-soft)">
            Memuat simulator drone...
          </div>
        }
      >
        <RobloxModelViewer />
      </Suspense>
    </main>
  )
}
