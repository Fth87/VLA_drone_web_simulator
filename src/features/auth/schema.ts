import { AUTH_MESSAGES, AUTH_VALIDATION } from './constants'
import type { LoginFormValues, RegisterFormValues } from './types'
import { isValidEmail, normalizeEmail, normalizeName, trimValue } from './utils'

export function sanitizeLoginValues(values: LoginFormValues): LoginFormValues {
  return {
    email: normalizeEmail(values.email),
    password: trimValue(values.password),
  }
}

export function sanitizeRegisterValues(
  values: RegisterFormValues,
): RegisterFormValues {
  return {
    name: normalizeName(values.name),
    email: normalizeEmail(values.email),
    password: trimValue(values.password),
  }
}

export function validateLoginValues(values: LoginFormValues) {
  const sanitizedValues = sanitizeLoginValues(values)

  if (!sanitizedValues.email || !sanitizedValues.password) {
    return AUTH_MESSAGES.requiredCredentials
  }

  if (!isValidEmail(sanitizedValues.email)) {
    return AUTH_MESSAGES.invalidEmail
  }

  return null
}

export function validateRegisterValues(values: RegisterFormValues) {
  const sanitizedValues = sanitizeRegisterValues(values)

  if (sanitizedValues.name.length < AUTH_VALIDATION.minNameLength) {
    return AUTH_MESSAGES.invalidName
  }

  if (!sanitizedValues.email) {
    return AUTH_MESSAGES.requiredCredentials
  }

  if (!isValidEmail(sanitizedValues.email)) {
    return AUTH_MESSAGES.invalidEmail
  }

  if (sanitizedValues.password.length < AUTH_VALIDATION.minPasswordLength) {
    return AUTH_MESSAGES.invalidPassword
  }

  return null
}
