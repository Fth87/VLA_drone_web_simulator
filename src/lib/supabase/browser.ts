import { createBrowserClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'

import { getSupabaseEnv } from './env'

let browserClient: ReturnType<typeof createBrowserClient> | null = null

function getBrowserClient() {
  if (typeof window === 'undefined') {
    return null
  }

  if (browserClient) {
    return browserClient
  }

  const { url, anonKey } = getSupabaseEnv()

  if (!url || !anonKey) {
    return null
  }

  browserClient = createBrowserClient(url, anonKey)

  return browserClient
}

export function getSupabaseBrowserClient() {
  return getBrowserClient()
}

export async function getSupabaseBrowserUser(): Promise<User | null> {
  const client = getBrowserClient()

  if (!client) {
    return null
  }

  const { data, error } = await client.auth.getUser()

  if (error) {
    return null
  }

  return data.user ?? null
}

export async function isAuthenticated() {
  return Boolean(await getSupabaseBrowserUser())
}

export async function signInWithEmailPassword(email: string, password: string) {
  const client = getBrowserClient()

  if (!client) {
    return {
      error: new Error(
        'Supabase env belum diatur. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.',
      ),
    }
  }

  const { error } = await client.auth.signInWithPassword({
    email,
    password,
  })

  return { error }
}

export async function signUpWithEmailPassword(
  email: string,
  password: string,
  name?: string,
) {
  const client = getBrowserClient()

  if (!client) {
    return {
      error: new Error(
        'Supabase env belum diatur. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.',
      ),
    }
  }

  const { error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: name ? { name } : undefined,
    },
  })

  return { error }
}

export async function signOut() {
  const client = getBrowserClient()

  if (!client) {
    return {
      error: new Error('Supabase client belum tersedia.'),
    }
  }

  const { error } = await client.auth.signOut()

  return { error }
}
