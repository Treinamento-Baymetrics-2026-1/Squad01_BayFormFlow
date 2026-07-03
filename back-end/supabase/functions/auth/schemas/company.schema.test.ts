import { assertEquals } from "@std/assert";
import { companySchema } from "./company.schema.ts";

const base = {
  display_name: "Empresa Exemplo",
  email: "contato@empresa.com",
  password: "senhaForte1",
  cnpj: "12ABC34501DE35",
  phonenumber: "11999998888",
};

Deno.test("company: entrada válida passa", () => {
  assertEquals(companySchema.safeParse(base).success, true);
});

Deno.test("company: cnpj com tamanho errado → falha", () => {
  assertEquals(companySchema.safeParse({ ...base, cnpj: "123" }).success, false);
});

Deno.test("company: cnpj minúsculo → falha (exige [0-9A-Z])", () => {
  assertEquals(companySchema.safeParse({ ...base, cnpj: "12abc34501de35" }).success, false);
});

Deno.test("company: cnpj com letra nos 2 últimos dígitos → falha", () => {
  assertEquals(companySchema.safeParse({ ...base, cnpj: "12ABC34501DEAB" }).success, false);
});

Deno.test("company: phonenumber não numérico → falha", () => {
  assertEquals(companySchema.safeParse({ ...base, phonenumber: "(11)99999" }).success, false);
});

Deno.test("company: phonenumber muito curto (<7) → falha", () => {
  assertEquals(companySchema.safeParse({ ...base, phonenumber: "123456" }).success, false);
});

Deno.test("company: email inválido → falha", () => {
  assertEquals(companySchema.safeParse({ ...base, email: "naoehemail" }).success, false);
});
