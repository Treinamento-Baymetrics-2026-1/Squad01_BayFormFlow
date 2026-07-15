import { assertEquals } from "@std/assert";
import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import {
  createResearch,
  type CreateResearchPorts,
} from "./create-research.service.ts";
import type { CallerIdentity } from "../../_shared/ports/admin.port.ts";
import type {
  EmployeeRow,
  InsertResearchResult,
  NewResearchRow,
  WriteResult,
} from "../ports/researches-repo.port.ts";
import type { CreateResearchInput } from "../schemas/create-research.schema.ts";

const ADMIN: CallerIdentity = { userId: "admin-1", isAdmin: true };
const NAO_ADMIN: CallerIdentity = { userId: "gestor-1", isAdmin: false };

const GESTOR: EmployeeRow = { id: 10, position: "Gestor" };
const VALIDADOR_20: EmployeeRow = { id: 20, position: "Validador" };
const VALIDADOR_21: EmployeeRow = { id: 21, position: "Validador" };

interface FakeConfig {
  me?: CallerIdentity | null;
  companyExists?: boolean;
  employees?: EmployeeRow[];
  insertResearch?: InsertResearchResult;
  assignEmployeesToResearch?: WriteResult;
  deleteResearchHard?: WriteResult;
}

function buildPorts(cfg: FakeConfig = {}) {
  const meVal: CallerIdentity | null = cfg.me === undefined ? ADMIN : cfg.me;
  const companyExistsVal = cfg.companyExists === undefined ? true : cfg.companyExists;
  const employeesVal: EmployeeRow[] = cfg.employees === undefined
    ? [GESTOR, VALIDADOR_20, VALIDADOR_21]
    : cfg.employees;
  const insertVal: InsertResearchResult = cfg.insertResearch === undefined
    ? { ok: true, id: 42 }
    : cfg.insertResearch;
  const assignVal: WriteResult = cfg.assignEmployeesToResearch === undefined
    ? { ok: true }
    : cfg.assignEmployeesToResearch;
  const deleteVal: WriteResult = cfg.deleteResearchHard === undefined
    ? { ok: true }
    : cfg.deleteResearchHard;

  const me = spy((): Promise<CallerIdentity | null> => Promise.resolve(meVal));
  const companyExists = spy((_companyId: number): Promise<boolean> => Promise.resolve(companyExistsVal));
  const findEmployeesByIds = spy((_ids: number[]): Promise<EmployeeRow[]> => Promise.resolve(employeesVal));
  const insertResearch = spy(
    (_row: NewResearchRow): Promise<InsertResearchResult> => Promise.resolve(insertVal),
  );
  const assignEmployeesToResearch = spy(
    (_researchId: number, _employeeIds: number[], _createdBy: string): Promise<WriteResult> =>
      Promise.resolve(assignVal),
  );
  const deleteResearchHard = spy((_researchId: number): Promise<WriteResult> => Promise.resolve(deleteVal));

  const ports: CreateResearchPorts = {
    admin: { me },
    repos: {
      companyExists,
      findEmployeesByIds,
      insertResearch,
      assignEmployeesToResearch,
      deleteResearchHard,
    },
  };

  return { ports, me, companyExists, findEmployeesByIds, insertResearch, assignEmployeesToResearch, deleteResearchHard };
}

function validInput(overrides: Partial<CreateResearchInput> = {}): CreateResearchInput {
  return {
    company_id: 1,
    display_name: "Pesquisa de Clima 2026",
    research_period: { start: "2026-01-01T00:00:00Z", end: "2026-03-01T00:00:00Z" },
    manager_id: 10,
    validator_ids: [20, 21],
    ...overrides,
  };
}

Deno.test("caller não autenticado (me() null) → 403; company não é checado", async () => {
  const f = buildPorts({ me: null });
  const res = await createResearch(f.ports, validInput());
  assertEquals(res.status, 403);
  assertSpyCalls(f.companyExists, 0);
  assertSpyCalls(f.insertResearch, 0);
});

Deno.test("caller não-admin (Gestor não-admin) → 403; company não é checado", async () => {
  const f = buildPorts({ me: NAO_ADMIN });
  const res = await createResearch(f.ports, validInput());
  assertEquals(res.status, 403);
  assertSpyCalls(f.companyExists, 0);
  assertSpyCalls(f.insertResearch, 0);
});

Deno.test("company_id inexistente → 400; insert não é chamado", async () => {
  const f = buildPorts({ companyExists: false });
  const res = await createResearch(f.ports, validInput());
  assertEquals(res.status, 400);
  assertSpyCalls(f.insertResearch, 0);
});

Deno.test("manager_id inexistente → 400; insert não é chamado", async () => {
  const f = buildPorts({ employees: [VALIDADOR_20, VALIDADOR_21] });
  const res = await createResearch(f.ports, validInput());
  assertEquals(res.status, 400);
  assertSpyCalls(f.insertResearch, 0);
});

Deno.test("manager_id existe mas não tem posição 'Gestor' → 400; insert não é chamado", async () => {
  const f = buildPorts({ employees: [{ id: 10, position: "Validador" }, VALIDADOR_20, VALIDADOR_21] });
  const res = await createResearch(f.ports, validInput());
  assertEquals(res.status, 400);
  assertSpyCalls(f.insertResearch, 0);
});

Deno.test("validator_ids contém id inexistente → 400; insert não é chamado", async () => {
  const f = buildPorts({ employees: [GESTOR, VALIDADOR_20] });
  const res = await createResearch(f.ports, validInput());
  assertEquals(res.status, 400);
  assertSpyCalls(f.insertResearch, 0);
});

Deno.test("validator_ids contém id que não tem posição 'Validador' → 400; insert não é chamado", async () => {
  const f = buildPorts({ employees: [GESTOR, { id: 20, position: "Gestor" }, VALIDADOR_21] });
  const res = await createResearch(f.ports, validInput());
  assertEquals(res.status, 400);
  assertSpyCalls(f.insertResearch, 0);
});

Deno.test("sucesso → 201; insert 1x com created_by do caller e atribuição de gestor+validadores", async () => {
  const f = buildPorts({ insertResearch: { ok: true, id: 7 } });
  const res = await createResearch(f.ports, validInput());
  assertEquals(res.status, 201);
  assertEquals(res.body, { research_id: 7 });
  assertSpyCalls(f.insertResearch, 1);
  assertSpyCall(f.insertResearch, 0, {
    args: [{
      displayName: "Pesquisa de Clima 2026",
      researchDescription: undefined,
      periodStart: "2026-01-01T00:00:00Z",
      periodEnd: "2026-03-01T00:00:00Z",
      companyId: 1,
      createdBy: "admin-1",
    }],
  });
  assertSpyCalls(f.assignEmployeesToResearch, 1);
  assertSpyCall(f.assignEmployeesToResearch, 0, {
    args: [7, [10, 20, 21], "admin-1"],
  });
});

Deno.test("insert falha por constraint (FK/check) → 400", async () => {
  const f = buildPorts({ insertResearch: { ok: false, kind: "constraint", error: "fk violado" } });
  const res = await createResearch(f.ports, validInput());
  assertEquals(res.status, 400);
});

Deno.test("insert falha inesperada → 500", async () => {
  const f = buildPorts({ insertResearch: { ok: false, kind: "unknown", error: "boom" } });
  const res = await createResearch(f.ports, validInput());
  assertEquals(res.status, 500);
});

Deno.test("atribuição de gestor/validadores falha → 500 e rollback da pesquisa", async () => {
  const f = buildPorts({
    insertResearch: { ok: true, id: 7 },
    assignEmployeesToResearch: { ok: false, error: "boom" },
  });
  const res = await createResearch(f.ports, validInput());
  assertEquals(res.status, 500);
  assertSpyCalls(f.deleteResearchHard, 1);
  assertSpyCall(f.deleteResearchHard, 0, { args: [7] });
});
