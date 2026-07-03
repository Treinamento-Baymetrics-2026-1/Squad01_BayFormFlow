import type { SupabaseClient } from "@supabase/supabase-js";
import type { AdminPort, CallerIdentity } from "../ports/admin.port.ts";

export function createSupabaseAdminAdapter(caller: SupabaseClient): AdminPort {
  return {
    async me(): Promise<CallerIdentity | null> {
      // me() vive no schema helpers; o profile default do supabase-js é `public`
      // e o PostgREST só procura a função no schema do profile.
      const { data, error } = await caller.schema("helpers").rpc("me");
      if (error || data === null) {
        return null;
        
      }
      return parseIdentity(data);
    },
  };
}

function parseIdentity(data: unknown): CallerIdentity | null {
  if (typeof data !== "object" || data === null) return null;
  if (!("user_id" in data) || !("is_admin" in data)) return null;
  const userId = data.user_id;
  const isAdmin = data.is_admin;
  if (typeof userId !== "string" || typeof isAdmin !== "boolean") return null;
  return { userId, isAdmin };
}
