import { AUTH_VALIDATION } from './constants'

export function trimValue(value: string) {
  return value.trim()
}

export function normalizeEmail(value: string) {
  return trimValue(value).toLowerCase()
}

export function normalizeName(value: string) {
  return trimValue(value).replace(/\s+/g, ' ')
}

export function isValidEmail(value: string) {
  return AUTH_VALIDATION.emailPattern.test(value)
}
