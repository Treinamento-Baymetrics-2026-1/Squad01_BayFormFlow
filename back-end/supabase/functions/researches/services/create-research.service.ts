import type { AdminPort } from "../../_shared/ports/admin.port.ts";
import type { ResearchesRepoPort } from "../ports/researches-repo.port.ts";
import type { CreateResearchInput } from "../schemas/create-research.schema.ts";

export interface CreateResearchPorts {
  admin: AdminPort;
  repos: ResearchesRepoPort;
}

export interface ServiceResponse {
  status: number;
  body: Record<string, unknown>;
}

export async function createResearch(
  ports: CreateResearchPorts,
  input: CreateResearchInput,
): Promise<ServiceResponse> {
  const caller = await ports.admin.me();
  if (!caller || !caller.isAdmin) {
    return { status: 403, body: { error: "Apenas administradores podem criar pesquisas." } };
  }

  const companyExists = await ports.repos.companyExists(input.company_id);
  if (!companyExists) {
    return { status: 400, body: { error: "company_id inexistente." } };
  }

  const result = await ports.repos.insertResearch({
    displayName: input.display_name,
    researchDescription: input.research_description,
    periodStart: input.research_period.start,
    periodEnd: input.research_period.end,
    companyId: input.company_id,
    createdBy: caller.userId,
  });

  if (!result.ok) {
    if (result.kind === "constraint") {
      return { status: 400, body: { error: "Falha ao criar pesquisa.", detail: result.error } };
    }
    return { status: 500, body: { error: "Falha inesperada ao criar pesquisa.", detail: result.error } };
  }

  return { status: 201, body: { research_id: result.id } };
}
