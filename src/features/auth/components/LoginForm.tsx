import { Link } from '@tanstack/react-router'

import { AUTH_COPY, AUTH_ROUTES } from '../constants'
import { useLoginForm } from '../hooks/useLoginForm'
import { AuthShell } from './AuthShell'

export function LoginForm() {
  const { values, errorMessage, isSubmitting, handleSubmit, setFieldValue } =
    useLoginForm()

  return (
    <AuthShell
      title={AUTH_COPY.loginTitle}
      description={AUTH_COPY.loginDescription}
      footer={
        <p className="text-sm text-[var(--sea-ink-soft)]">
          {AUTH_COPY.loginFooter}{' '}
          <Link
            to={AUTH_ROUTES.register}
            className="font-semibold text-[var(--lagoon-deep)] hover:underline"
          >
            {AUTH_COPY.loginLink}
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-[var(--sea-ink)]">
            Email
          </span>
          <input
            type="email"
            value={values.email}
            onChange={(event) => setFieldValue('email', event.target.value)}
            required
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 outline-none ring-0 transition focus:border-[var(--lagoon-deep)]"
            placeholder="you@example.com"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-[var(--sea-ink)]">
            Password
          </span>
          <input
            type="password"
            value={values.password}
            onChange={(event) => setFieldValue('password', event.target.value)}
            required
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 outline-none ring-0 transition focus:border-[var(--lagoon-deep)]"
            placeholder="Your password"
          />
        </label>

        {errorMessage ? (
          <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[var(--lagoon-deep)] px-4 py-2.5 font-semibold text-white hover:bg-[#256f76] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? AUTH_COPY.loginLoading : AUTH_COPY.loginButton}
        </button>
      </form>
    </AuthShell>
  )
}
