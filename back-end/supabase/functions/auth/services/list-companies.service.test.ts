import { assertEquals } from "@std/assert";
import { assertSpyCalls, spy } from "@std/testing/mock";
import { listCompanies, type ListCompaniesPorts } from "./list-companies.service.ts";
import type { CallerIdentity } from "../../_shared/ports/admin.port.ts";
import type {
  CompanyRoleRow,
  CompanyRow,
  EmployeeRoleRow,
  InsertWithIdResult,
  NewCompanyRow,
  NewEmployeeRow,
  NewUserRow,
  RepoPort,
  UserRow,
  WriteResult,
} from "../ports/repos.port.ts";

const ADMIN: CallerIdentity = { userId: "admin-1", isAdmin: true };
const NAO_ADMIN: CallerIdentity = { userId: "user-1", isAdmin: false };

const COMPANIES: CompanyRow[] = [
  { id: 1, userId: "user-2", cnpj: "12345678000199", phonenumber: "11999998888" },
];

const USERS: UserRow[] = [
  { id: "user-2", displayName: "Empresa Beta", isDeleted: false, createdAt: "2026-01-02T00:00:00Z" },
];

interface FakeConfig {
  me?: CallerIdentity | null;
  listCompanies?: CompanyRow[];
  findUsersByIds?: UserRow[];
}

function buildPorts(cfg: FakeConfig = {}) {
  const meVal: CallerIdentity | null = cfg.me === undefined ? ADMIN : cfg.me;
  const companiesVal = cfg.listCompanies === undefined ? COMPANIES : cfg.listCompanies;
  const usersVal = cfg.findUsersByIds === undefined ? USERS : cfg.findUsersByIds;

  const me = spy((): Promise<CallerIdentity | null> => Promise.resolve(meVal));
  const listCompaniesFn = spy((): Promise<CompanyRow[]> => Promise.resolve(companiesVal));
  const findUsersByIds = spy((_ids: string[]): Promise<UserRow[]> => Promise.resolve(usersVal));

  const repos: RepoPort = {
    insertUser: spy((_row: NewUserRow): Promise<WriteResult> => Promise.resolve({ ok: true })),
    deleteUserHard: spy((_userId: string): Promise<WriteResult> => Promise.resolve({ ok: true })),
    insertEmployee: spy(
      (_row: NewEmployeeRow): Promise<InsertWithIdResult> => Promise.resolve({ ok: true }),
    ),
    insertCompany: spy(
      (_row: NewCompanyRow): Promise<InsertWithIdResult> => Promise.resolve({ ok: true }),
    ),
    listUsers: spy((): Promise<UserRow[]> => Promise.resolve([])),
    listCompanies: listCompaniesFn,
    findUsersByIds,
    findEmployeesByUserIds: spy((_ids: string[]): Promise<EmployeeRoleRow[]> => Promise.resolve([])),
    findCompaniesByUserIds: spy((_ids: string[]): Promise<CompanyRoleRow[]> => Promise.resolve([])),
  };

  const ports: ListCompaniesPorts = { admin: { me }, repos };

  return { ports, me, listCompaniesFn, findUsersByIds };
}

Deno.test("caller não autenticado (me() null) → 403; repos não são chamados", async () => {
  const f = buildPorts({ me: null });
  const res = await listCompanies(f.ports);
  assertEquals(res.status, 403);
  assertSpyCalls(f.listCompaniesFn, 0);
});

Deno.test("caller não-admin → 403", async () => {
  const f = buildPorts({ me: NAO_ADMIN });
  const res = await listCompanies(f.ports);
  assertEquals(res.status, 403);
});

Deno.test("admin → 200 com empresas enriquecidas com dados do usuário", async () => {
  const f = buildPorts();
  const res = await listCompanies(f.ports);
  assertEquals(res.status, 200);
  assertEquals(res.body, {
    companies: [
      {
        id: 1,
        user_id: "user-2",
        cnpj: "12345678000199",
        phonenumber: "11999998888",
        display_name: "Empresa Beta",
        is_deleted: false,
        created_at: "2026-01-02T00:00:00Z",
      },
    ],
  });
});

Deno.test("lista vazia → 200 com companies: []; findUsersByIds não é chamado com ids", async () => {
  const f = buildPorts({ listCompanies: [] });
  const res = await listCompanies(f.ports);
  assertEquals(res.status, 200);
  assertEquals(res.body, { companies: [] });
});
