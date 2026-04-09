import { createMiddleware } from '@tanstack/react-start'

import { applySupabaseCookies, getSupabaseServerUser } from './server'

const PUBLIC_PATHS = new Set(['/login', '/register'])
const PROTECTED_PATHS = new Set(['/'])

function redirectResponse(url: string, cookies: HeadersInit = {}) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
      ...cookies,
    },
  })
}

export const supabaseAuthMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    const pathname = new URL(request.url).pathname
    const { user, cookies } = await getSupabaseServerUser(request)

    if (PUBLIC_PATHS.has(pathname) && user) {
      const response = redirectResponse('/', {})
      applySupabaseCookies(response.headers, cookies)
      return response
    }

    if (PROTECTED_PATHS.has(pathname) && !user) {
      const response = redirectResponse('/login', {})
      applySupabaseCookies(response.headers, cookies)
      return response
    }

    const result = await next()
    applySupabaseCookies(result.response.headers, cookies)

    return result
  },
)
