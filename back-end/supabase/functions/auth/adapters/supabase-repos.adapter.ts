import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CompanyRoleRow,
  CompanyRow,
  EmployeeRoleRow,
  InsertWithIdResult,
  NewCompanyRow,
  NewEmployeeRow,
  NewUserRow,
  RepoPort,
  UserRow,
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

    async listUsers(): Promise<UserRow[]> {
      const { data, error } = await admin
        .schema("logins")
        .from("t_users")
        .select("id, display_name, is_deleted, created_at")
        .order("created_at", { ascending: false });
      if (error || !data) return [];
      return data.map(toUserRow);
    },

    async listCompanies(): Promise<CompanyRow[]> {
      const { data, error } = await admin
        .schema("requesters")
        .from("t_companies")
        .select("id, user_id, cnpj, phonenumber")
        .order("id", { ascending: true });
      if (error || !data) return [];
      return data.map(toCompanyRow);
    },

    async findUsersByIds(ids: string[]): Promise<UserRow[]> {
      if (ids.length === 0) return [];
      const { data, error } = await admin
        .schema("logins")
        .from("t_users")
        .select("id, display_name, is_deleted, created_at")
        .in("id", ids);
      if (error || !data) return [];
      return data.map(toUserRow);
    },

    async findEmployeesByUserIds(ids: string[]): Promise<EmployeeRoleRow[]> {
      if (ids.length === 0) return [];
      const { data, error } = await admin
        .schema("consultants")
        .from("t_employees")
        .select("user_id, position, is_admin")
        .in("user_id", ids);
      if (error || !data) return [];
      return data.map((row) => ({
        userId: row.user_id as string,
        position: row.position as EmployeeRoleRow["position"],
        isAdmin: row.is_admin as boolean,
      }));
    },

    async findCompaniesByUserIds(ids: string[]): Promise<CompanyRoleRow[]> {
      if (ids.length === 0) return [];
      const { data, error } = await admin
        .schema("requesters")
        .from("t_companies")
        .select("user_id, cnpj, phonenumber")
        .in("user_id", ids);
      if (error || !data) return [];
      return data.map((row) => ({
        userId: row.user_id as string,
        cnpj: row.cnpj as string,
        phonenumber: row.phonenumber as string,
      }));
    },
  };
}

function toUserRow(row: {
  id: string;
  display_name: string;
  is_deleted: boolean;
  created_at: string;
}): UserRow {
  return {
    id: row.id,
    displayName: row.display_name,
    isDeleted: row.is_deleted,
    createdAt: row.created_at,
  };
}

function toCompanyRow(row: {
  id: number;
  user_id: string;
  cnpj: string;
  phonenumber: string;
}): CompanyRow {
  return {
    id: row.id,
    userId: row.user_id,
    cnpj: row.cnpj,
    phonenumber: row.phonenumber,
  };
}

function readId(data: unknown): number | undefined {
  if (typeof data === "object" && data !== null && "id" in data) {
    const id = data.id;
    if (typeof id === "number") return id;
  }
  return undefined;
}
