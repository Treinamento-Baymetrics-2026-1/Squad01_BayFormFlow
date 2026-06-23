import { assertEquals } from "jsr:@std/assert@1";
import {
  type AdminClient,
  type CallerClient,
  handleProvisionOperator,
} from "./handler.ts";

type RpcResult = { data: unknown; error: { message: string } | null };
type CreateUserResult = {
  data: { user: { id: string } | null } | null;
  error: { message: string } | null;
};

function makeReq(body: unknown): Request {
  return new Request("http://localhost/provision-operator", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function validInput(overrides: Record<string, unknown> = {}) {
  return {
    name: "Fulano de Tal",
    email: "fulano@empresa.com",
    password: "senhaForte1",
    position: "gestor",
    is_admin: true,
    ...overrides,
  };
}

function makeCaller(meResult: RpcResult): CallerClient & {
  calls: { fn: string; params?: Record<string, unknown> }[];
} {
  const calls: { fn: string; params?: Record<string, unknown> }[] = [];
  return {
    calls,
    rpc(fn: string, params?: Record<string, unknown>) {
      calls.push({ fn, params });
      return Promise.resolve(meResult);
    },
  };
}

function makeAdmin(
  opts: { createUser?: CreateUserResult; rpc?: RpcResult } = {},
): AdminClient & {
  calls: {
    createUser: { email: string; password: string; email_confirm: boolean }[];
    deleteUser: string[];
    rpc: { fn: string; params?: Record<string, unknown> }[];
  };
} {
  const createUserResult: CreateUserResult = opts.createUser ??
    { data: { user: { id: "novo-operador-99" } }, error: null };
  const rpcResult: RpcResult = opts.rpc ?? { data: { provisioned: true }, error: null };

  const calls = {
    createUser: [] as { email: string; password: string; email_confirm: boolean }[],
    deleteUser: [] as string[],
    rpc: [] as { fn: string; params?: Record<string, unknown> }[],
  };

  return {
    calls,
    auth: {
      admin: {
        createUser(attrs: { email: string; password: string; email_confirm: boolean }) {
          calls.createUser.push(attrs);
          return Promise.resolve(createUserResult);
        },
        deleteUser(id: string) {
          calls.deleteUser.push(id);
          return Promise.resolve({ data: null, error: null } as RpcResult);
        },
      },
    },
    rpc(fn: string, params?: Record<string, unknown>) {
      calls.rpc.push({ fn, params });
      return Promise.resolve(rpcResult);
    },
  };
}

const ADMIN_ME: RpcResult = {
  data: { user_id: "admin-1", is_admin: true },
  error: null,
};

Deno.test("não-admin → 403 e o Auth nem é tocado", async () => {
  const caller = makeCaller({
    data: { user_id: "user-1", is_admin: false },
    error: null,
  });
  const admin = makeAdmin();

  const res = await handleProvisionOperator(makeReq(validInput()), { caller, admin });

  assertEquals(res.status, 403);
  assertEquals(admin.calls.createUser.length, 0);
  assertEquals(admin.calls.rpc.length, 0);
  assertEquals(admin.calls.deleteUser.length, 0);
});

Deno.test("me() retorna erro → 403 e o Auth nem é tocado", async () => {
  const caller = makeCaller({ data: null, error: { message: "jwt inválido" } });
  const admin = makeAdmin();

  const res = await handleProvisionOperator(makeReq(validInput()), { caller, admin });

  assertEquals(res.status, 403);
  assertEquals(admin.calls.createUser.length, 0);
});

Deno.test("entrada inválida (email faltando) → 400; Auth não é tocado", async () => {
  const caller = makeCaller(ADMIN_ME);
  const admin = makeAdmin();
  const body = validInput();
  delete (body as Record<string, unknown>).email;

  const res = await handleProvisionOperator(makeReq(body), { caller, admin });

  assertEquals(res.status, 400);
  assertEquals(admin.calls.createUser.length, 0);
  assertEquals(admin.calls.rpc.length, 0);
});

Deno.test("entrada inválida (position fora do enum) → 400", async () => {
  const caller = makeCaller(ADMIN_ME);
  const admin = makeAdmin();

  const res = await handleProvisionOperator(
    makeReq(validInput({ position: "supervisor", is_admin: false })),
    { caller, admin },
  );

  assertEquals(res.status, 400);
  assertEquals(admin.calls.createUser.length, 0);
});

Deno.test("validador marcado como admin → 400 (refine adm ⊂ gestor)", async () => {
  const caller = makeCaller(ADMIN_ME);
  const admin = makeAdmin();

  const res = await handleProvisionOperator(
    makeReq(validInput({ position: "validador", is_admin: true })),
    { caller, admin },
  );

  assertEquals(res.status, 400);
  assertEquals(admin.calls.createUser.length, 0);
  assertEquals(admin.calls.rpc.length, 0);
});

Deno.test(
  "sucesso → 201; createUser e RPC 1x; sem rollback; p_user_id e p_created_by corretos",
  async () => {
    const caller = makeCaller(ADMIN_ME);
    const admin = makeAdmin({
      createUser: { data: { user: { id: "novo-operador-99" } }, error: null },
      rpc: { data: { provisioned: true }, error: null },
    });

    const res = await handleProvisionOperator(
      makeReq(validInput({ position: "gestor", is_admin: true })),
      { caller, admin },
    );

    assertEquals(res.status, 201);
    assertEquals(admin.calls.createUser.length, 1);
    assertEquals(admin.calls.createUser[0].email_confirm, true);
    assertEquals(admin.calls.rpc.length, 1);
    assertEquals(admin.calls.deleteUser.length, 0);

    const rpcCall = admin.calls.rpc[0];
    assertEquals(rpcCall.fn, "provision_operator");
    assertEquals(rpcCall.params?.p_user_id, "novo-operador-99");
    assertEquals(rpcCall.params?.p_created_by, "admin-1");
    assertEquals(rpcCall.params?.p_position, "gestor");
    assertEquals(rpcCall.params?.p_is_admin, true);
  },
);

Deno.test("RPC falha → 500 + rollback (deleteUser do usuário criado)", async () => {
  const caller = makeCaller(ADMIN_ME);
  const admin = makeAdmin({
    createUser: { data: { user: { id: "novo-operador-99" } }, error: null },
    rpc: { data: null, error: { message: "violação de constraint" } },
  });

  const res = await handleProvisionOperator(
    makeReq(validInput({ position: "validador", is_admin: false })),
    { caller, admin },
  );

  assertEquals(res.status, 500);
  assertEquals(admin.calls.createUser.length, 1);
  assertEquals(admin.calls.rpc.length, 1);
  assertEquals(admin.calls.deleteUser.length, 1);
  assertEquals(admin.calls.deleteUser[0], "novo-operador-99");
});

Deno.test("Auth falha → 400 + RPC não é chamada (nada a fazer rollback)", async () => {
  const caller = makeCaller(ADMIN_ME);
  const admin = makeAdmin({
    createUser: { data: { user: null }, error: { message: "email já existe" } },
  });

  const res = await handleProvisionOperator(
    makeReq(validInput({ position: "gestor", is_admin: false })),
    { caller, admin },
  );

  assertEquals(res.status, 400);
  assertEquals(admin.calls.createUser.length, 1);
  assertEquals(admin.calls.rpc.length, 0);
  assertEquals(admin.calls.deleteUser.length, 0);
});
