export {
  AUTH_COPY,
  AUTH_MESSAGES,
  AUTH_ROUTES,
  AUTH_VALIDATION,
} from './constants'
export { LoginForm } from './components/LoginForm'
export { AuthShell } from './components/AuthShell'
export { RegisterForm } from './components/RegisterForm'
export {
  isAuthenticated,
  signInWithEmailPassword,
  signOut,
} from './services/auth-service'
export { useLoginForm } from './hooks/useLoginForm'
export { useRegisterForm } from './hooks/useRegisterForm'
export {
  sanitizeLoginValues,
  sanitizeRegisterValues,
  validateLoginValues,
  validateRegisterValues,
} from './schema'
export { isValidEmail, normalizeEmail, normalizeName, trimValue } from './utils'
export type {
  AuthFormFieldState,
  AuthSubmitResult,
  LoginFormValues,
  RegisterFormValues,
} from './types'
