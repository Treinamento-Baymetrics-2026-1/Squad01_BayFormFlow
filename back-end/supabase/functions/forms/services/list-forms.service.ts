import type { AdminPort } from "../../_shared/ports/admin.port.ts";
import type { FormsRepoPort } from "../ports/forms-repo.port.ts";
import type { ListFormsQuery } from "../schemas/list-forms.schema.ts";

export interface ListFormsPorts {
  admin: AdminPort;
  repos: FormsRepoPort;
}

export interface ServiceResponse {
  status: number;
  body: Record<string, unknown>;
}

export async function listForms(
  ports: ListFormsPorts,
  input: ListFormsQuery,
): Promise<ServiceResponse> {
  const caller = await ports.admin.me();
  if (!caller || !caller.isAdmin) {
    return { status: 403, body: { error: "Apenas administradores podem pesquisar formulários." } };
  }

  const rows = await ports.repos.listForms({
    researchId: input.research_id,
    formStatus: input.form_status,
  });

  const forms = rows.map((row) => ({
    id: row.id,
    display_name: row.displayName,
    forms_description: row.formsDescription,
    time_period: { start: row.periodStart, end: row.periodEnd },
    form_status: row.formStatus,
    participant_target: row.participantTarget,
    published_at: row.publishedAt,
    created_at: row.createdAt,
    research_id: row.researchId,
  }));

  return { status: 200, body: { forms } };
}
