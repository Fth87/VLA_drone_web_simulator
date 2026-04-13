import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'

import { getSupabaseEnv } from './env'

export interface SupabaseCookieUpdate {
  name: string
  value: string
  options: Parameters<typeof serializeCookieHeader>[2]
}

export function createSupabaseServerClient(
  request: Request,
  pendingCookies: SupabaseCookieUpdate[] = [],
) {
  const { url, anonKey } = getSupabaseEnv()

  if (!url || !anonKey) {
    throw new Error(
      'Supabase env belum diatur. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.',
    )
  }

  const parsedCookies = parseCookieHeader(request.headers.get('cookie') ?? '')

  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () =>
        parsedCookies.map((cookie) => ({
          name: cookie.name,
          value: cookie.value ?? '',
        })),
      setAll: (cookiesToSet: SupabaseCookieUpdate[]) => {
        pendingCookies.push(...cookiesToSet)
      },
    },
  })
}

export async function getSupabaseServerUser(request: Request) {
  const pendingCookies: SupabaseCookieUpdate[] = []
  const client = createSupabaseServerClient(request, pendingCookies)
  const { data, error } = await client.auth.getUser()

  return {
    user: error ? null : ((data.user ?? null) as User | null),
    cookies: pendingCookies,
  }
}

export function applySupabaseCookies(
  headers: Headers,
  cookies: SupabaseCookieUpdate[],
) {
  for (const cookie of cookies) {
    headers.append(
      'Set-Cookie',
      serializeCookieHeader(cookie.name, cookie.value, cookie.options),
    )
  }
}
