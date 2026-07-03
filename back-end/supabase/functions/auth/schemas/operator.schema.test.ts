import { assertEquals } from "@std/assert";
import { operatorSchema } from "./operator.schema.ts";

const base = {
  display_name: "Fulano de Tal",
  email: "fulano@empresa.com",
  password: "senhaForte1",
  position: "Gestor",
  is_admin: false,
};

Deno.test("operator: entrada válida passa", () => {
  assertEquals(operatorSchema.safeParse(base).success, true);
});

Deno.test("operator: is_admin assume default=false quando omitido", () => {
  const { is_admin: _omit, ...semAdmin } = base;
  const r = operatorSchema.safeParse(semAdmin);
  assertEquals(r.success, true);
  if (r.success) assertEquals(r.data.is_admin, false);
});

Deno.test("operator: email faltando → falha", () => {
  const { email: _omit, ...semEmail } = base;
  assertEquals(operatorSchema.safeParse(semEmail).success, false);
});

Deno.test("operator: position fora do enum → falha", () => {
  assertEquals(operatorSchema.safeParse({ ...base, position: "Supervisor" }).success, false);
});

Deno.test("operator: validador com is_admin=true → falha (refine adm ⊂ gestor)", () => {
  assertEquals(
    operatorSchema.safeParse({ ...base, position: "Validador", is_admin: true }).success,
    false,
  );
});

Deno.test("operator: gestor com is_admin=true → passa", () => {
  assertEquals(
    operatorSchema.safeParse({ ...base, position: "Gestor", is_admin: true }).success,
    true,
  );
});

Deno.test("operator: validador com is_admin=false → passa", () => {
  assertEquals(
    operatorSchema.safeParse({ ...base, position: "Validador", is_admin: false }).success,
    true,
  );
});

Deno.test("operator: senha curta (<8) → falha", () => {
  assertEquals(operatorSchema.safeParse({ ...base, password: "1234567" }).success, false);
});
