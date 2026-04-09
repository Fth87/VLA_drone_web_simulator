import { Link } from '@tanstack/react-router'

import { AUTH_COPY, AUTH_ROUTES } from '../constants'
import { useRegisterForm } from '../hooks/useRegisterForm'
import { AuthShell } from './AuthShell'

export function RegisterForm() {
  const { values, errorMessage, isSubmitting, handleSubmit, setFieldValue } =
    useRegisterForm()

  return (
    <AuthShell
      title={AUTH_COPY.registerTitle}
      description={AUTH_COPY.registerDescription}
      footer={
        <p className="text-sm text-(--sea-ink-soft)">
          {AUTH_COPY.registerFooter}{' '}
          <Link
            to={AUTH_ROUTES.login}
            className="font-semibold text-(--lagoon-deep) hover:underline"
          >
            {AUTH_COPY.registerLink}
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-[var(--sea-ink)]">
            Nama
          </span>
          <input
            type="text"
            value={values.name}
            onChange={(event) => setFieldValue('name', event.target.value)}
            required
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 outline-none ring-0 transition focus:border-[var(--lagoon-deep)]"
            placeholder="Nama kamu"
          />
        </label>

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
            placeholder="Buat password"
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
          {isSubmitting ? AUTH_COPY.registerLoading : AUTH_COPY.registerButton}
        </button>
      </form>
    </AuthShell>
  )
}
