"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Session } from "@supabase/supabase-js";

let client: ReturnType<typeof createBrowserClient> | null = null;
let cachedAnonymousSession: Session | null = null;
let pendingAnonymousSession: Promise<Session | null> | null = null;

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );
  }
  return client;
}

export async function ensureAnonymousSession() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;
  const expiresSoon = cachedAnonymousSession?.expires_at
    ? cachedAnonymousSession.expires_at * 1000 <= Date.now() + 30_000
    : true;
  if (cachedAnonymousSession && !expiresSoon) return cachedAnonymousSession;
  if (pendingAnonymousSession) return pendingAnonymousSession;

  pendingAnonymousSession = (async () => {
    const { data: current } = await supabase.auth.getSession();
    if (current.session) {
      cachedAnonymousSession = current.session;
      return current.session;
    }
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    cachedAnonymousSession = data.session;
    return data.session;
  })();
  try {
    return await pendingAnonymousSession;
  } finally {
    pendingAnonymousSession = null;
  }
}
