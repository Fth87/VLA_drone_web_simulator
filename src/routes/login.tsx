import { createFileRoute, redirect } from '@tanstack/react-router'

import { LoginForm, isAuthenticated } from '../features/auth'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    if (typeof window === 'undefined') {
      return
    }

    if (await isAuthenticated()) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginRoute,
})

function LoginRoute() {
  return <LoginForm />
}
