import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  InsertWithIdResult,
  NewCompanyRow,
  NewEmployeeRow,
  NewUserRow,
  RepoPort,
  WriteResult,
} from "../ports/repos.port.ts";

export function createSupabaseRepoAdapter(admin: SupabaseClient): RepoPort {
  return {
    async insertUser(row: NewUserRow): Promise<WriteResult> {
      const { error } = await admin
        .schema("logins")
        .from("t_users")
        .insert({
          id: row.id,
          display_name: row.displayName,
          is_deleted: false,
          created_by: row.createdBy,
        });
      return error ? { ok: false, error: error.message } : { ok: true };
    },

    async deleteUserHard(userId: string): Promise<WriteResult> {
      const { error } = await admin
        .schema("logins")
        .from("t_users")
        .delete()
        .eq("id", userId);
      return error ? { ok: false, error: error.message } : { ok: true };
    },

    async insertEmployee(row: NewEmployeeRow): Promise<InsertWithIdResult> {
      const { data, error } = await admin
        .schema("consultants")
        .from("t_employees")
        .insert({
          position: row.position,
          is_admin: row.isAdmin,
          user_id: row.userId,
        })
        .select("id")
        .single();
      if (error) return { ok: false, error: error.message };
      return { ok: true, id: readId(data) };
    },

    async insertCompany(row: NewCompanyRow): Promise<InsertWithIdResult> {
      const { data, error } = await admin
        .schema("requesters")
        .from("t_companies")
        .insert({
          cnpj: row.cnpj,
          phonenumber: row.phonenumber,
          user_id: row.userId,
        })
        .select("id")
        .single();
      if (error) return { ok: false, error: error.message };
      return { ok: true, id: readId(data) };
    },
  };
}

function readId(data: unknown): number | undefined {
  if (typeof data === "object" && data !== null && "id" in data) {
    const id = data.id;
    if (typeof id === "number") return id;
  }
  return undefined;
}
