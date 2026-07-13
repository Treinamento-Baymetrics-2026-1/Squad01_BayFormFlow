import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import type { AdminPort, CallerIdentity } from "../ports/admin.port.ts";

export function createSupabaseAdminAdapter(caller: SupabaseClient): AdminPort {
  return {
    async me(): Promise<CallerIdentity | null> {
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
