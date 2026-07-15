import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  FormsRepoPort,
  InsertResult,
  NewFormRow,
  NewFormVersionRow,
  WriteResult,
} from "../ports/forms-repo.port.ts";

const CONSTRAINT_SQLSTATES = new Set([
  "23502",
  "23503",
  "23505",
  "23514",
]);

export function createSupabaseFormsRepoAdapter(
  admin: SupabaseClient,
): FormsRepoPort {
  return {
    async researchExists(researchId: number): Promise<boolean> {
      const { data, error } = await admin
        .schema("consultancies")
        .from("t_researchs")
        .select("id")
        .eq("id", researchId)
        .maybeSingle();
      if (error) return false;
      return data !== null;
    },

    async isResearchManager(
      callerUserId: string,
      researchId: number,
    ): Promise<boolean> {
      const { data: employee, error: employeeError } = await admin
        .schema("consultants")
        .from("t_employees")
        .select("id")
        .eq("user_id", callerUserId)
        .eq("position", "Gestor")
        .maybeSingle();
      if (employeeError || employee === null) return false;

      const employeeId = readId(employee);
      if (employeeId === undefined) return false;

      const { data: assignment, error: assignmentError } = await admin
        .schema("consultants")
        .from("t_employees_research")
        .select("id")
        .eq("manager_id", employeeId)
        .eq("research_alloc", researchId)
        .maybeSingle();
      if (assignmentError) return false;
      return assignment !== null;
    },

    async insertForm(row: NewFormRow): Promise<InsertResult> {
      const { data, error } = await admin
        .schema("consultancies")
        .from("t_forms")
        .insert({
          display_name: row.displayName,
          forms_description: row.formsDescription,
          time_period: toTstzRangeLiteral(row.periodStart, row.periodEnd),
          participant_target: row.participantTarget,
          research_id: row.researchId,
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
      return { ok: true, id: readStringId(data) };
    },

    async insertFormVersion(row: NewFormVersionRow): Promise<InsertResult> {
      const { data, error } = await admin
        .schema("consultancies")
        .from("t_form_versions")
        .insert({
          form: row.form,
          version_status: "Em Análise",
          version_name: row.versionName,
          form_id: row.formId,
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
      return { ok: true, id: readStringId(data) };
    },

    async deleteFormHard(formId: string): Promise<WriteResult> {
      const { error } = await admin
        .schema("consultancies")
        .from("t_forms")
        .delete()
        .eq("id", formId);
      return error ? { ok: false, error: error.message } : { ok: true };
    },
  };
}

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

function readStringId(data: unknown): string | undefined {
  if (typeof data === "object" && data !== null && "id" in data) {
    const id = data.id;
    if (typeof id === "string") return id;
  }
  return undefined;
}
