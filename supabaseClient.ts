"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
if (!anon) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");

// Extend globalThis safely (no `any`)
declare global {
  var __supabase__: SupabaseClient | undefined;
}

const getBrowserClient = (): SupabaseClient => {
  // Only run in browser; prevents weird SSR edge-cases
  if (typeof window === "undefined") {
    // In App Router, server components shouldn't import this at all.
    // But if they do, fail loudly.
    throw new Error("supabaseClient imported on the server");
  }

  if (!globalThis.__supabase__) {
    globalThis.__supabase__ = createClient(url, anon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "quizhub-auth",
      },
    });
  }

  return globalThis.__supabase__;
};

export const supabase = getBrowserClient();
