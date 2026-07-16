import { assertEquals } from "@std/assert";
import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { listForms, type ListFormsPorts } from "./list-forms.service.ts";
import type { CallerIdentity } from "../../_shared/ports/admin.port.ts";
import type {
  FormSummaryRow,
  InsertResult,
  ListFormsFilter,
  NewFormRow,
  NewFormVersionRow,
  WriteResult,
} from "../ports/forms-repo.port.ts";
import type { ListFormsQuery } from "../schemas/list-forms.schema.ts";

const ADMIN: CallerIdentity = { userId: "admin-1", isAdmin: true };
const GESTOR: CallerIdentity = { userId: "gestor-1", isAdmin: false };

const FORM_ROW: FormSummaryRow = {
  id: "form-1",
  displayName: "Formulário de Clima 2026",
  formsDescription: "Avaliação trimestral de clima organizacional.",
  periodStart: "2026-01-01T00:00:00+00:00",
  periodEnd: "2026-03-01T00:00:00+00:00",
  formStatus: "Criado",
  participantTarget: 50,
  publishedAt: null,
  createdAt: "2026-01-01T00:00:00Z",
  researchId: 1,
};

interface FakeConfig {
  me?: CallerIdentity | null;
  listForms?: FormSummaryRow[];
}

function buildPorts(cfg: FakeConfig = {}) {
  const meVal: CallerIdentity | null = cfg.me === undefined ? ADMIN : cfg.me;
  const rowsVal = cfg.listForms === undefined ? [FORM_ROW] : cfg.listForms;

  const me = spy((): Promise<CallerIdentity | null> => Promise.resolve(meVal));
  const listFormsFn = spy((_filter: ListFormsFilter): Promise<FormSummaryRow[]> =>
    Promise.resolve(rowsVal)
  );

  const ports: ListFormsPorts = {
    admin: { me },
    repos: {
      researchExists: spy((_researchId: number): Promise<boolean> => Promise.resolve(true)),
      isResearchManager: spy(
        (_callerUserId: string, _researchId: number): Promise<boolean> => Promise.resolve(false),
      ),
      insertForm: spy((_row: NewFormRow): Promise<InsertResult> => Promise.resolve({ ok: true })),
      insertFormVersion: spy(
        (_row: NewFormVersionRow): Promise<InsertResult> => Promise.resolve({ ok: true }),
      ),
      deleteFormHard: spy((_formId: string): Promise<WriteResult> => Promise.resolve({ ok: true })),
      listForms: listFormsFn,
    },
  };

  return { ports, me, listFormsFn };
}

function query(overrides: Partial<ListFormsQuery> = {}): ListFormsQuery {
  return { ...overrides };
}

Deno.test("caller não autenticado (me() null) → 403; repo não é chamado", async () => {
  const f = buildPorts({ me: null });
  const res = await listForms(f.ports, query());
  assertEquals(res.status, 403);
  assertSpyCalls(f.listFormsFn, 0);
});

Deno.test("caller não-admin (ex.: gestor) → 403", async () => {
  const f = buildPorts({ me: GESTOR });
  const res = await listForms(f.ports, query());
  assertEquals(res.status, 403);
  assertSpyCalls(f.listFormsFn, 0);
});

Deno.test("admin sem filtros → 200 e repassa filtro vazio pro repo", async () => {
  const f = buildPorts();
  const res = await listForms(f.ports, query());
  assertEquals(res.status, 200);
  assertSpyCall(f.listFormsFn, 0, { args: [{ researchId: undefined, formStatus: undefined }] });
});

Deno.test("admin com research_id e form_status → repassa filtro pro repo", async () => {
  const f = buildPorts();
  await listForms(f.ports, query({ research_id: 1, form_status: "Criado" }));
  assertSpyCall(f.listFormsFn, 0, { args: [{ researchId: 1, formStatus: "Criado" }] });
});

Deno.test("admin → 200 com formulários mapeados (time_period em start/end)", async () => {
  const f = buildPorts();
  const res = await listForms(f.ports, query());
  assertEquals(res.body, {
    forms: [
      {
        id: "form-1",
        display_name: "Formulário de Clima 2026",
        forms_description: "Avaliação trimestral de clima organizacional.",
        time_period: { start: "2026-01-01T00:00:00+00:00", end: "2026-03-01T00:00:00+00:00" },
        form_status: "Criado",
        participant_target: 50,
        published_at: null,
        created_at: "2026-01-01T00:00:00Z",
        research_id: 1,
      },
    ],
  });
});

Deno.test("lista vazia → 200 com forms: []", async () => {
  const f = buildPorts({ listForms: [] });
  const res = await listForms(f.ports, query());
  assertEquals(res.status, 200);
  assertEquals(res.body, { forms: [] });
});
