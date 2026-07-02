import { isAuthApiError, type SupabaseClient } from "@supabase/supabase-js";
import type { AuthPort, CreateUserResult, DeleteResult } from "../ports/auth.port.ts";

export function createSupabaseAuthAdapter(admin: SupabaseClient): AuthPort {
  return {
    async createUser({ email, password }): Promise<CreateUserResult> {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error) {
        if (isAuthApiError(error) && error.code === "email_exists") {
          return { ok: false, error: { kind: "email_exists" } };
        }
        return { ok: false, error: { kind: "unknown", message: error.message } };
      }
      if (!data.user) {
        return {
          ok: false,
          error: { kind: "unknown", message: "Auth não retornou usuário." },
        };
      }
      return { ok: true, user: { id: data.user.id } };
    },

    async deleteUser(userId): Promise<DeleteResult> {
      const { error } = await admin.auth.admin.deleteUser(userId);
      return error ? { ok: false, error: error.message } : { ok: true };
    },
  };
}
