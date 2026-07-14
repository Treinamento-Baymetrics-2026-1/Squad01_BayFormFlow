import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  EmployeeRow,
  InsertResearchResult,
  NewResearchRow,
  ResearchesRepoPort,
  WriteResult,
} from "../ports/researches-repo.port.ts";

// SQLSTATEs do Postgres que indicam entrada semanticamente inválida
// (violação de FK/check/unique/not-null) — mapeados para 400 em vez de 500.
const CONSTRAINT_SQLSTATES = new Set([
  "23502", // not_null_violation
  "23503", // foreign_key_violation
  "23505", // unique_violation
  "23514", // check_violation
]);

export function createSupabaseResearchesRepoAdapter(
  admin: SupabaseClient,
): ResearchesRepoPort {
  return {
    async companyExists(companyId: number): Promise<boolean> {
      const { data, error } = await admin
        .schema("requesters")
        .from("t_companies")
        .select("id")
        .eq("id", companyId)
        .maybeSingle();
      if (error) return false;
      return data !== null;
    },

    async insertResearch(row: NewResearchRow): Promise<InsertResearchResult> {
      const { data, error } = await admin
        .schema("consultancies")
        .from("t_researchs")
        .insert({
          display_name: row.displayName,
          research_description: row.researchDescription ?? null,
          research_period: toTstzRangeLiteral(row.periodStart, row.periodEnd),
          company_id: row.companyId,
          created_by: row.createdBy,
        })
        .select("id")
        .single();
      if (error) {
        const kind = CONSTRAINT_SQLSTATES.has(error.code)
          ? "constraint"
          : "unknown";
        return { ok: false, kind, error: error.message };
      }
      return { ok: true, id: readId(data) };
    },

    async findEmployeesByIds(ids: number[]): Promise<EmployeeRow[]> {
      if (ids.length === 0) return [];
      const { data, error } = await admin
        .schema("consultants")
        .from("t_employees")
        .select("id, position")
        .in("id", ids);
      if (error || !data) return [];
      return data as EmployeeRow[];
    },

    async assignEmployeesToResearch(
      researchId: number,
      employeeIds: number[],
      createdBy: string,
    ): Promise<WriteResult> {
      const rows = employeeIds.map((employeeId) => ({
        created_at: new Date().toISOString(),
        manager_id: employeeId,
        research_alloc: researchId,
        created_by: createdBy,
      }));
      const { error } = await admin
        .schema("consultants")
        .from("t_employees_research")
        .insert(rows);
      return error ? { ok: false, error: error.message } : { ok: true };
    },

    async deleteResearchHard(researchId: number): Promise<WriteResult> {
      const { error } = await admin
        .schema("consultancies")
        .from("t_researchs")
        .delete()
        .eq("id", researchId);
      return error ? { ok: false, error: error.message } : { ok: true };
    },
  };
}

// Monta o literal de range do Postgres `[start,end)` a partir de datas ISO.
function toTstzRangeLiteral(start: string, end: string): string {
  return `[${start},${end})`;
}

function readId(data: unknown): number | undefined {
  if (typeof data === "object" && data !== null && "id" in data) {
    const id = data.id;
    if (typeof id === "number") return id;
  }
  return undefined;
}
