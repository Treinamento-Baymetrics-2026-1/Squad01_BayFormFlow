import { assertEquals } from "@std/assert";
import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import {
  createForm,
  type CreateFormPorts,
} from "./create-form.service.ts";
import type { CallerIdentity } from "../../_shared/ports/admin.port.ts";
import type {
  FormSummaryRow,
  InsertResult,
  ListFormsFilter,
  NewFormRow,
  NewFormVersionRow,
  WriteResult,
} from "../ports/forms-repo.port.ts";
import type { CreateFormInput } from "../schemas/create-form.schema.ts";

const ADMIN: CallerIdentity = { userId: "admin-1", isAdmin: true };
const GESTOR: CallerIdentity = { userId: "gestor-1", isAdmin: false };

interface FakeConfig {
  me?: CallerIdentity | null;
  isResearchManager?: boolean;
  researchExists?: boolean;
  insertForm?: InsertResult;
  insertFormVersion?: InsertResult;
  deleteFormHard?: WriteResult;
}

function buildPorts(cfg: FakeConfig = {}) {
  const meVal: CallerIdentity | null = cfg.me === undefined ? ADMIN : cfg.me;
  const isManagerVal = cfg.isResearchManager === undefined ? false : cfg.isResearchManager;
  const researchExistsVal = cfg.researchExists === undefined ? true : cfg.researchExists;
  const insertFormVal: InsertResult = cfg.insertForm === undefined
    ? { ok: true, id: "form-1" }
    : cfg.insertForm;
  const insertVersionVal: InsertResult = cfg.insertFormVersion === undefined
    ? { ok: true, id: "version-1" }
    : cfg.insertFormVersion;
  const deleteVal: WriteResult = cfg.deleteFormHard === undefined
    ? { ok: true }
    : cfg.deleteFormHard;

  const me = spy((): Promise<CallerIdentity | null> => Promise.resolve(meVal));
  const isResearchManager = spy(
    (_callerUserId: string, _researchId: number): Promise<boolean> => Promise.resolve(isManagerVal),
  );
  const researchExists = spy((_researchId: number): Promise<boolean> => Promise.resolve(researchExistsVal));
  const insertForm = spy((_row: NewFormRow): Promise<InsertResult> => Promise.resolve(insertFormVal));
  const insertFormVersion = spy(
    (_row: NewFormVersionRow): Promise<InsertResult> => Promise.resolve(insertVersionVal),
  );
  const deleteFormHard = spy((_formId: string): Promise<WriteResult> => Promise.resolve(deleteVal));

  const ports: CreateFormPorts = {
    admin: { me },
    repos: {
      isResearchManager,
      researchExists,
      insertForm,
      insertFormVersion,
      deleteFormHard,
      listForms: spy((_filter: ListFormsFilter): Promise<FormSummaryRow[]> => Promise.resolve([])),
    },
  };

  return { ports, me, isResearchManager, researchExists, insertForm, insertFormVersion, deleteFormHard };
}

function validInput(overrides: Partial<CreateFormInput> = {}): CreateFormInput {
  return {
    research_id: 1,
    display_name: "Formulário de Clima 2026",
    forms_description: "Avaliação trimestral de clima organizacional.",
    time_period: { start: "2026-01-01T00:00:00Z", end: "2026-03-01T00:00:00Z" },
    participant_target: 50,
    form: { fields: [{ type: "text", label: "Nome" }] },
    ...overrides,
  };
}

Deno.test("caller não autenticado (me() null) → 403; nada mais é checado", async () => {
  const f = buildPorts({ me: null });
  const res = await createForm(f.ports, validInput());
  assertEquals(res.status, 403);
  assertSpyCalls(f.isResearchManager, 0);
  assertSpyCalls(f.researchExists, 0);
  assertSpyCalls(f.insertForm, 0);
});

Deno.test("Admin → não checa isResearchManager", async () => {
  const f = buildPorts({ me: ADMIN });
  const res = await createForm(f.ports, validInput());
  assertEquals(res.status, 201);
  assertSpyCalls(f.isResearchManager, 0);
});

Deno.test("não-admin e não é gestor da pesquisa → 403; research não é checado", async () => {
  const f = buildPorts({ me: GESTOR, isResearchManager: false });
  const res = await createForm(f.ports, validInput());
  assertEquals(res.status, 403);
  assertSpyCalls(f.researchExists, 0);
  assertSpyCalls(f.insertForm, 0);
});

Deno.test("não-admin e é gestor da pesquisa → segue e cria", async () => {
  const f = buildPorts({ me: GESTOR, isResearchManager: true });
  const res = await createForm(f.ports, validInput());
  assertEquals(res.status, 201);
  assertSpyCalls(f.insertForm, 1);
});

Deno.test("research_id inexistente → 400; insert não é chamado", async () => {
  const f = buildPorts({ researchExists: false });
  const res = await createForm(f.ports, validInput());
  assertEquals(res.status, 400);
  assertSpyCalls(f.insertForm, 0);
});

Deno.test("sucesso → 201; insertForm e insertFormVersion chamados com os dados certos", async () => {
  const f = buildPorts({
    insertForm: { ok: true, id: "form-7" },
    insertFormVersion: { ok: true, id: "version-9" },
  });
  const res = await createForm(f.ports, validInput());
  assertEquals(res.status, 201);
  assertEquals(res.body, { form_id: "form-7", form_version_id: "version-9" });
  assertSpyCall(f.insertForm, 0, {
    args: [{
      displayName: "Formulário de Clima 2026",
      formsDescription: "Avaliação trimestral de clima organizacional.",
      periodStart: "2026-01-01T00:00:00Z",
      periodEnd: "2026-03-01T00:00:00Z",
      participantTarget: 50,
      researchId: 1,
      createdBy: "admin-1",
    }],
  });
  assertSpyCall(f.insertFormVersion, 0, {
    args: [{
      formId: "form-7",
      form: { fields: [{ type: "text", label: "Nome" }] },
      versionName: "v1",
      createdBy: "admin-1",
    }],
  });
});

Deno.test("version_name customizado é repassado ao repo", async () => {
  const f = buildPorts({ insertForm: { ok: true, id: "form-7" } });
  await createForm(f.ports, validInput({ version_name: "rascunho" }));
  assertSpyCall(f.insertFormVersion, 0, {
    args: [{
      formId: "form-7",
      form: { fields: [{ type: "text", label: "Nome" }] },
      versionName: "rascunho",
      createdBy: "admin-1",
    }],
  });
});

Deno.test("insertForm falha por constraint (FK/check) → 400", async () => {
  const f = buildPorts({ insertForm: { ok: false, kind: "constraint", error: "fk violado" } });
  const res = await createForm(f.ports, validInput());
  assertEquals(res.status, 400);
  assertSpyCalls(f.insertFormVersion, 0);
});

Deno.test("insertForm falha inesperada → 500", async () => {
  const f = buildPorts({ insertForm: { ok: false, kind: "unknown", error: "boom" } });
  const res = await createForm(f.ports, validInput());
  assertEquals(res.status, 500);
  assertSpyCalls(f.insertFormVersion, 0);
});

Deno.test("insertFormVersion falha → 500 e rollback do formulário", async () => {
  const f = buildPorts({
    insertForm: { ok: true, id: "form-7" },
    insertFormVersion: { ok: false, kind: "unknown", error: "boom" },
  });
  const res = await createForm(f.ports, validInput());
  assertEquals(res.status, 500);
  assertSpyCalls(f.deleteFormHard, 1);
  assertSpyCall(f.deleteFormHard, 0, { args: ["form-7"] });
});
