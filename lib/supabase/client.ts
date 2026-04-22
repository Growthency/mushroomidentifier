import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Dev preview without Supabase env — return a no-op stub so server components
  // (Navbar, etc.) can render the homepage layout for design previews. Production
  // always has env vars and uses the real client.
  if (
    process.env.NODE_ENV === 'development' &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    const noopChain: any = new Proxy(function () {}, {
      get: () => noopChain,
      apply: () => Promise.resolve({ data: null, error: null }),
    })
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => noopChain,
      storage: { from: () => noopChain },
      rpc: () => Promise.resolve({ data: null, error: null }),
    } as any
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
