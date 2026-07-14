import { assertEquals } from "@std/assert";
import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import {
  createResearch,
  type CreateResearchPorts,
} from "./create-research.service.ts";
import type { CallerIdentity } from "../../_shared/ports/admin.port.ts";
import type { InsertResearchResult, NewResearchRow } from "../ports/researches-repo.port.ts";
import type { CreateResearchInput } from "../schemas/create-research.schema.ts";

const ADMIN: CallerIdentity = { userId: "admin-1", isAdmin: true };
const NAO_ADMIN: CallerIdentity = { userId: "gestor-1", isAdmin: false };

interface FakeConfig {
  me?: CallerIdentity | null;
  companyExists?: boolean;
  insertResearch?: InsertResearchResult;
}

function buildPorts(cfg: FakeConfig = {}) {
  const meVal: CallerIdentity | null = cfg.me === undefined ? ADMIN : cfg.me;
  const companyExistsVal = cfg.companyExists === undefined ? true : cfg.companyExists;
  const insertVal: InsertResearchResult = cfg.insertResearch === undefined
    ? { ok: true, id: 42 }
    : cfg.insertResearch;

  const me = spy((): Promise<CallerIdentity | null> => Promise.resolve(meVal));
  const companyExists = spy((_companyId: number): Promise<boolean> => Promise.resolve(companyExistsVal));
  const insertResearch = spy(
    (_row: NewResearchRow): Promise<InsertResearchResult> => Promise.resolve(insertVal),
  );

  const ports: CreateResearchPorts = {
    admin: { me },
    repos: { companyExists, insertResearch },
  };

  return { ports, me, companyExists, insertResearch };
}

function validInput(overrides: Partial<CreateResearchInput> = {}): CreateResearchInput {
  return {
    company_id: 1,
    display_name: "Pesquisa de Clima 2026",
    research_period: { start: "2026-01-01T00:00:00Z", end: "2026-03-01T00:00:00Z" },
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

Deno.test("sucesso → 201; insert 1x com created_by do caller", async () => {
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
