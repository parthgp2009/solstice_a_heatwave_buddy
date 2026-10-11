import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "./types";
import { isSupabaseConfigured } from "./client";

/**
 * Creates a server-side Supabase client for Next.js App Router (Server Components & Route Handlers).
 * Uses Next.js cookies() store for session persistence.
 * Returns null if Supabase environment variables are unconfigured.
 */
export async function createClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This is safely ignored if middleware or client handles session refresh.
          }
        }
      }
    }
  );
}
