import { assertEquals } from "@std/assert";
import { assertSpyCalls, spy } from "@std/testing/mock";
import { listUsers, type ListUsersPorts } from "./list-users.service.ts";
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

const USERS: UserRow[] = [
  { id: "user-1", displayName: "Fulano de Tal", isDeleted: false, createdAt: "2026-01-01T00:00:00Z" },
  { id: "user-2", displayName: "Empresa Beta", isDeleted: false, createdAt: "2026-01-02T00:00:00Z" },
  { id: "user-3", displayName: "Sem Papel", isDeleted: true, createdAt: "2026-01-03T00:00:00Z" },
];

const EMPLOYEES: EmployeeRoleRow[] = [
  { userId: "user-1", position: "Gestor", isAdmin: false },
];

const COMPANIES: CompanyRoleRow[] = [
  { userId: "user-2", cnpj: "12345678000199", phonenumber: "11999998888" },
];

interface FakeConfig {
  me?: CallerIdentity | null;
  listUsers?: UserRow[];
  findEmployeesByUserIds?: EmployeeRoleRow[];
  findCompaniesByUserIds?: CompanyRoleRow[];
}

function buildPorts(cfg: FakeConfig = {}) {
  const meVal: CallerIdentity | null = cfg.me === undefined ? ADMIN : cfg.me;
  const usersVal = cfg.listUsers === undefined ? USERS : cfg.listUsers;
  const employeesVal = cfg.findEmployeesByUserIds === undefined ? EMPLOYEES : cfg.findEmployeesByUserIds;
  const companiesVal = cfg.findCompaniesByUserIds === undefined ? COMPANIES : cfg.findCompaniesByUserIds;

  const me = spy((): Promise<CallerIdentity | null> => Promise.resolve(meVal));
  const listUsersFn = spy((): Promise<UserRow[]> => Promise.resolve(usersVal));
  const findEmployeesByUserIds = spy((_ids: string[]): Promise<EmployeeRoleRow[]> =>
    Promise.resolve(employeesVal)
  );
  const findCompaniesByUserIds = spy((_ids: string[]): Promise<CompanyRoleRow[]> =>
    Promise.resolve(companiesVal)
  );

  const repos: RepoPort = {
    insertUser: spy((_row: NewUserRow): Promise<WriteResult> => Promise.resolve({ ok: true })),
    deleteUserHard: spy((_userId: string): Promise<WriteResult> => Promise.resolve({ ok: true })),
    insertEmployee: spy(
      (_row: NewEmployeeRow): Promise<InsertWithIdResult> => Promise.resolve({ ok: true }),
    ),
    insertCompany: spy(
      (_row: NewCompanyRow): Promise<InsertWithIdResult> => Promise.resolve({ ok: true }),
    ),
    listUsers: listUsersFn,
    listCompanies: spy((): Promise<CompanyRow[]> => Promise.resolve([])),
    findUsersByIds: spy((_ids: string[]): Promise<UserRow[]> => Promise.resolve([])),
    findEmployeesByUserIds,
    findCompaniesByUserIds,
  };

  const ports: ListUsersPorts = { admin: { me }, repos };

  return { ports, me, listUsersFn, findEmployeesByUserIds, findCompaniesByUserIds };
}

Deno.test("caller não autenticado (me() null) → 403; repos não são chamados", async () => {
  const f = buildPorts({ me: null });
  const res = await listUsers(f.ports);
  assertEquals(res.status, 403);
  assertSpyCalls(f.listUsersFn, 0);
});

Deno.test("caller não-admin → 403", async () => {
  const f = buildPorts({ me: NAO_ADMIN });
  const res = await listUsers(f.ports);
  assertEquals(res.status, 403);
});

Deno.test("admin → 200 com usuários e role resolvida (employee, company, null)", async () => {
  const f = buildPorts();
  const res = await listUsers(f.ports);
  assertEquals(res.status, 200);
  assertEquals(res.body, {
    users: [
      {
        id: "user-1",
        display_name: "Fulano de Tal",
        is_deleted: false,
        created_at: "2026-01-01T00:00:00Z",
        role: { type: "employee", position: "Gestor", is_admin: false },
      },
      {
        id: "user-2",
        display_name: "Empresa Beta",
        is_deleted: false,
        created_at: "2026-01-02T00:00:00Z",
        role: { type: "company", cnpj: "12345678000199", phonenumber: "11999998888" },
      },
      {
        id: "user-3",
        display_name: "Sem Papel",
        is_deleted: true,
        created_at: "2026-01-03T00:00:00Z",
        role: null,
      },
    ],
  });
});

Deno.test("lista vazia → 200 com users: []", async () => {
  const f = buildPorts({ listUsers: [] });
  const res = await listUsers(f.ports);
  assertEquals(res.status, 200);
  assertEquals(res.body, { users: [] });
});
