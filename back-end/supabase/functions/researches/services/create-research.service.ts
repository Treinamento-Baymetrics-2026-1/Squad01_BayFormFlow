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

  const employeeIds = [input.manager_id, ...input.validator_ids];
  const employees = await ports.repos.findEmployeesByIds(employeeIds);
  const roleError = validateRoles(input, employees);
  if (roleError) {
    return { status: 400, body: { error: roleError } };
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

  const researchId = result.id as number;
  const assignment = await ports.repos.assignEmployeesToResearch(
    researchId,
    employeeIds,
    caller.userId,
  );
  if (!assignment.ok) {
    await undoResearch(ports, researchId);
    return {
      status: 500,
      body: { error: "Falha ao atribuir gestor/validadores à pesquisa.", detail: assignment.error },
    };
  }

  return { status: 201, body: { research_id: researchId } };
}

function validateRoles(
  input: CreateResearchInput,
  employees: { id: number; position: "Gestor" | "Validador" }[],
): string | null {
  const byId = new Map(employees.map((e) => [e.id, e.position]));

  const managerPosition = byId.get(input.manager_id);
  if (!managerPosition) {
    return "manager_id inexistente.";
  }
  if (managerPosition !== "Gestor") {
    return "manager_id não corresponde a um funcionário com posição 'Gestor'.";
  }

  for (const validatorId of input.validator_ids) {
    const position = byId.get(validatorId);
    if (!position) {
      return `validator_ids contém id inexistente: ${validatorId}.`;
    }
    if (position !== "Validador") {
      return `validator_ids contém id que não é 'Validador': ${validatorId}.`;
    }
  }

  return null;
}

async function undoResearch(ports: CreateResearchPorts, researchId: number): Promise<void> {
  const del = await ports.repos.deleteResearchHard(researchId);
  if (!del.ok) {
    console.error(
      `[researches][ROLLBACK FALHOU] Pesquisa ÓRFÃ (sem gestor/validadores). researchId=${researchId}. ` +
        `Remova manualmente. Causa: ${del.error ?? "desconhecida"}`,
    );
  }
}
