import type { AdminPort } from "../../_shared/ports/admin.port.ts";
import type { FormsRepoPort } from "../ports/forms-repo.port.ts";
import type { CreateFormInput } from "../schemas/create-form.schema.ts";

export interface CreateFormPorts {
  admin: AdminPort;
  repos: FormsRepoPort;
}

export interface ServiceResponse {
  status: number;
  body: Record<string, unknown>;
}

const DEFAULT_VERSION_NAME = "v1";

export async function createForm(
  ports: CreateFormPorts,
  input: CreateFormInput,
): Promise<ServiceResponse> {
  const caller = await ports.admin.me();
  if (!caller) {
    return { status: 403, body: { error: "Autenticação necessária." } };
  }

  if (!caller.isAdmin) {
    const isManager = await ports.repos.isResearchManager(caller.userId, input.research_id);
    if (!isManager) {
      return {
        status: 403,
        body: { error: "Apenas administradores ou o gestor responsável pela pesquisa podem criar formulários." },
      };
    }
  }

  const researchExists = await ports.repos.researchExists(input.research_id);
  if (!researchExists) {
    return { status: 400, body: { error: "research_id inexistente." } };
  }

  const formResult = await ports.repos.insertForm({
    displayName: input.display_name,
    formsDescription: input.forms_description,
    periodStart: input.time_period.start,
    periodEnd: input.time_period.end,
    participantTarget: input.participant_target,
    researchId: input.research_id,
    createdBy: caller.userId,
  });

  if (!formResult.ok) {
    if (formResult.kind === "constraint") {
      return { status: 400, body: { error: "Falha ao criar formulário.", detail: formResult.error } };
    }
    return { status: 500, body: { error: "Falha inesperada ao criar formulário.", detail: formResult.error } };
  }

  const formId = formResult.id as string;
  const versionResult = await ports.repos.insertFormVersion({
    formId,
    form: input.form,
    versionName: input.version_name ?? DEFAULT_VERSION_NAME,
    createdBy: caller.userId,
  });

  if (!versionResult.ok) {
    await undoForm(ports, formId);
    return {
      status: 500,
      body: { error: "Falha ao criar a primeira versão do formulário.", detail: versionResult.error },
    };
  }

  return { status: 201, body: { form_id: formId, form_version_id: versionResult.id } };
}

async function undoForm(ports: CreateFormPorts, formId: string): Promise<void> {
  const del = await ports.repos.deleteFormHard(formId);
  if (!del.ok) {
    console.error(
      `[forms][ROLLBACK FALHOU] Formulário ÓRFÃO (sem versão). formId=${formId}. ` +
        `Remova manualmente. Causa: ${del.error ?? "desconhecida"}`,
    );
  }
}
