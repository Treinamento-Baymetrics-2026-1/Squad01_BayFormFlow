import { assert, assertEquals, assertStringIncludes } from "@std/assert";
import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import {
  provision,
  type ProvisioningPorts,
  type ProvisionRequest,
} from "./provisioning.service.ts";
import type { CallerIdentity } from "../../_shared/ports/admin.port.ts";
import type { CreateUserResult, DeleteResult } from "../ports/auth.port.ts";
import type {
  InsertWithIdResult,
  NewCompanyRow,
  NewEmployeeRow,
  NewUserRow,
  WriteResult,
} from "../ports/repos.port.ts";

const ADMIN: CallerIdentity = { userId: "admin-1", isAdmin: true };
const OK_USER: CreateUserResult = { ok: true, user: { id: "novo-99" } };

interface FakeConfig {
  me?: CallerIdentity | null;
  createUser?: CreateUserResult;
  insertUser?: WriteResult;
  insertSubtype?: InsertWithIdResult;
  deleteUser?: DeleteResult;
  deleteUserHard?: WriteResult;
}

function buildPorts(cfg: FakeConfig = {}, order: string[] = []) {
  const meVal: CallerIdentity | null = cfg.me === undefined ? ADMIN : cfg.me;
  const createUserVal = cfg.createUser === undefined ? OK_USER : cfg.createUser;
  const insertUserVal: WriteResult = cfg.insertUser === undefined ? { ok: true } : cfg.insertUser;
  const subtypeVal: InsertWithIdResult = cfg.insertSubtype === undefined
    ? { ok: true, id: 7 }
    : cfg.insertSubtype;
  const deleteUserVal: DeleteResult = cfg.deleteUser === undefined ? { ok: true } : cfg.deleteUser;
  const deleteUserHardVal: WriteResult = cfg.deleteUserHard === undefined
    ? { ok: true }
    : cfg.deleteUserHard;

  const me = spy((): Promise<CallerIdentity | null> => {
    order.push("me");
    return Promise.resolve(meVal);
  });
  const createUser = spy(
    (_input: { email: string; password: string }): Promise<CreateUserResult> => {
      order.push("createUser");
      return Promise.resolve(createUserVal);
    },
  );
  const deleteUser = spy((_userId: string): Promise<DeleteResult> => {
    order.push("deleteUser");
    return Promise.resolve(deleteUserVal);
  });
  const insertUser = spy((_row: NewUserRow): Promise<WriteResult> => {
    order.push("insertUser");
    return Promise.resolve(insertUserVal);
  });
  const deleteUserHard = spy((_userId: string): Promise<WriteResult> => {
    order.push("deleteUserHard");
    return Promise.resolve(deleteUserHardVal);
  });
  const insertEmployee = spy((_row: NewEmployeeRow): Promise<InsertWithIdResult> => {
    order.push("insertEmployee");
    return Promise.resolve(subtypeVal);
  });
  const insertCompany = spy((_row: NewCompanyRow): Promise<InsertWithIdResult> => {
    order.push("insertCompany");
    return Promise.resolve(subtypeVal);
  });

  const ports: ProvisioningPorts = {
    admin: { me },
    auth: { createUser, deleteUser },
    repos: { insertUser, deleteUserHard, insertEmployee, insertCompany },
  };

  return { ports, me, createUser, deleteUser, insertUser, deleteUserHard, insertEmployee, insertCompany };
}

function operatorRequest(ports: ProvisioningPorts): ProvisionRequest {
  return {
    principal: { display_name: "Fulano de Tal", email: "f@e.com", password: "senhaForte1" },
    insertSubtype: (userId) =>
      ports.repos.insertEmployee({ userId, position: "Gestor", isAdmin: true }),
    subtypeIdKey: "employee_id",
  };
}

function companyRequest(ports: ProvisioningPorts): ProvisionRequest {
  return {
    principal: { display_name: "Empresa Exemplo", email: "c@e.com", password: "senhaForte1" },
    insertSubtype: (userId) =>
      ports.repos.insertCompany({ userId, cnpj: "12ABC34501DE35", phonenumber: "11999998888" }),
    subtypeIdKey: "company_id",
  };
}

Deno.test("não-admin → 403; Auth nem é tocado", async () => {
  const f = buildPorts({ me: { userId: "u1", isAdmin: false } });
  const res = await provision(f.ports, operatorRequest(f.ports));
  assertEquals(res.status, 403);
  assertSpyCalls(f.createUser, 0);
  assertSpyCalls(f.insertUser, 0);
  assertSpyCalls(f.insertEmployee, 0);
});

Deno.test("me() null (não autenticado) → 403; Auth nem é tocado", async () => {
  const f = buildPorts({ me: null });
  const res = await provision(f.ports, operatorRequest(f.ports));
  assertEquals(res.status, 403);
  assertSpyCalls(f.createUser, 0);
});

Deno.test("operator sucesso → 201; inserts 1x; sem rollback; args corretos", async () => {
  const f = buildPorts({ insertSubtype: { ok: true, id: 42 } });
  const res = await provision(f.ports, operatorRequest(f.ports));

  assertEquals(res.status, 201);
  assertEquals(res.body, { user_id: "novo-99", employee_id: 42 });
  assertSpyCalls(f.createUser, 1);
  assertSpyCall(f.createUser, 0, { args: [{ email: "f@e.com", password: "senhaForte1" }] });
  assertSpyCalls(f.insertUser, 1);
  assertSpyCall(f.insertUser, 0, {
    args: [{ id: "novo-99", displayName: "Fulano de Tal", createdBy: "admin-1" }],
  });
  assertSpyCalls(f.insertEmployee, 1);
  assertSpyCalls(f.deleteUser, 0);
  assertSpyCalls(f.deleteUserHard, 0);
});

Deno.test("company sucesso → 201; insertCompany 1x", async () => {
  const f = buildPorts({ insertSubtype: { ok: true, id: 5 } });
  const res = await provision(f.ports, companyRequest(f.ports));

  assertEquals(res.status, 201);
  assertEquals(res.body, { user_id: "novo-99", company_id: 5 });
  assertSpyCalls(f.insertCompany, 1);
  assertSpyCalls(f.insertEmployee, 0);
  assertSpyCalls(f.deleteUser, 0);
});

Deno.test("email duplicado (email_exists) → 409; nenhum insert; sem rollback", async () => {
  const f = buildPorts({ createUser: { ok: false, error: { kind: "email_exists" } } });
  const res = await provision(f.ports, operatorRequest(f.ports));
  assertEquals(res.status, 409);
  assertSpyCalls(f.insertUser, 0);
  assertSpyCalls(f.insertEmployee, 0);
  assertSpyCalls(f.deleteUser, 0);
});

Deno.test("Auth falha (erro genérico) → 400; nada a desfazer", async () => {
  const f = buildPorts({ createUser: { ok: false, error: { kind: "unknown", message: "boom" } } });
  const res = await provision(f.ports, operatorRequest(f.ports));
  assertEquals(res.status, 400);
  assertSpyCalls(f.insertUser, 0);
  assertSpyCalls(f.deleteUser, 0);
});

Deno.test("falha no insertUser → rollback só do Auth (deleteUser); 500", async () => {
  const f = buildPorts({ insertUser: { ok: false, error: "constraint" } });
  const res = await provision(f.ports, operatorRequest(f.ports));
  assertEquals(res.status, 500);
  assertSpyCalls(f.deleteUser, 1);
  assertSpyCall(f.deleteUser, 0, { args: ["novo-99"] });
  assertSpyCalls(f.deleteUserHard, 0);
  assertSpyCalls(f.insertEmployee, 0);
});

Deno.test("falha no subtipo → deleteUserHard depois deleteUser (ordem inversa); 500", async () => {
  const order: string[] = [];
  const f = buildPorts({ insertSubtype: { ok: false, error: "fk" } }, order);
  const res = await provision(f.ports, operatorRequest(f.ports));
  assertEquals(res.status, 500);
  assertSpyCalls(f.insertEmployee, 1);
  assertSpyCalls(f.deleteUserHard, 1);
  assertSpyCall(f.deleteUserHard, 0, { args: ["novo-99"] });
  assertSpyCalls(f.deleteUser, 1);
  assertEquals(order, [
    "me",
    "createUser",
    "insertUser",
    "insertEmployee",
    "deleteUserHard",
    "deleteUser",
  ]);
});

Deno.test("falha no próprio rollback (deleteUser) → loga gritante com o userId", async () => {
  const errSpy = spy(console, "error");
  try {
    const f = buildPorts({
      insertUser: { ok: false, error: "x" },
      deleteUser: { ok: false, error: "auth down" },
    });
    const res = await provision(f.ports, operatorRequest(f.ports));
    assertEquals(res.status, 500);
    assertSpyCalls(errSpy, 1);
    assertStringIncludes(errSpy.calls[0].args.join(" "), "novo-99");
  } finally {
    errSpy.restore();
  }
});

Deno.test("falha no rollback do subtipo (deleteUserHard) → loga gritante com o userId", async () => {
  const errSpy = spy(console, "error");
  try {
    const f = buildPorts({
      insertSubtype: { ok: false, error: "fk" },
      deleteUserHard: { ok: false, error: "row locked" },
    });
    const res = await provision(f.ports, companyRequest(f.ports));
    assertEquals(res.status, 500);
    assertSpyCalls(errSpy, 1);
    assertStringIncludes(errSpy.calls[0].args.join(" "), "novo-99");
    assert(res.body.error !== undefined);
  } finally {
    errSpy.restore();
  }
});
