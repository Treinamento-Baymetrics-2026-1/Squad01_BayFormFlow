import { createClient } from "npm:@supabase/supabase-js@2";

export function createSupabaseClient(req: Request) {
  return createClient(
    Deno.env.get("URL")!,
    Deno.env.get("ANON_KEY")!,
    {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") ?? "",
        },
      },
    },
  );
}

export function createSupabaseAdminClient() {
  return createClient(
    Deno.env.get("URL")!,
    Deno.env.get("SERVICE_ROLE_KEY")!,
  );
}
