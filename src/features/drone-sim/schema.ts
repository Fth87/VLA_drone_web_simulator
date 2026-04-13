import { VLA_PROMPT_MAX_LENGTH } from './constants'

export function sanitizeLanguageInstruction(value: string) {
  return value.replace(/\s+/g, ' ').trim().slice(0, VLA_PROMPT_MAX_LENGTH)
}

export function validateLanguageInstruction(value: string) {
  if (!value.trim()) {
    return 'Prompt wajib diisi sebelum inference dimulai.'
  }

  return ''
}
