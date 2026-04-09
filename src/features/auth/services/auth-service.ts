import {
  isAuthenticated as isAuthenticatedInfra,
  signInWithEmailPassword as signInWithEmailPasswordInfra,
  signUpWithEmailPassword as signUpWithEmailPasswordInfra,
  signOut as signOutInfra,
} from '../../../lib/supabase/browser'

export async function isAuthenticated() {
  return isAuthenticatedInfra()
}

export async function signInWithEmailPassword(email: string, password: string) {
  return signInWithEmailPasswordInfra(email, password)
}

export async function signUpWithEmailPassword(
  email: string,
  password: string,
  name?: string,
) {
  return signUpWithEmailPasswordInfra(email, password, name)
}

export async function signOut() {
  return signOutInfra()
}
