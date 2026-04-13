import { createStart } from '@tanstack/react-start'

import { supabaseAuthMiddleware } from './lib/supabase/middleware'

export const startInstance = createStart(() => ({
  requestMiddleware: [supabaseAuthMiddleware],
}))

export default startInstance
