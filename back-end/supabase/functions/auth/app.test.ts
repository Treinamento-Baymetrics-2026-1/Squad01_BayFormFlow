import { assertEquals } from "@std/assert";
import { app } from "./app.ts";


Deno.test("rota: POST /auth/operators sem Authorization → 401", async () => {
  const res = await app.request("/auth/operators", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      display_name: "Fulano de Tal",
      email: "f@e.com",
      password: "senhaForte1",
      position: "Gestor",
    }),
  });
  assertEquals(res.status, 401);
});

Deno.test("rota: POST /auth/companies sem Authorization → 401", async () => {
  const res = await app.request("/auth/companies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  assertEquals(res.status, 401);
});

Deno.test("rota: body inválido (com Authorization) → 400 do Zod, sem tocar o banco", async () => {
  const res = await app.request("/auth/operators", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer dummy" },
    body: JSON.stringify({ email: "naoehemail" }),
  });
  assertEquals(res.status, 400);
});

Deno.test("rota: preflight OPTIONS reflete o CORS allow-origin", async () => {
  const res = await app.request("/auth/operators", {
    method: "OPTIONS",
    headers: {
      "Origin": "http://127.0.0.1:3000",
      "Access-Control-Request-Method": "POST",
    },
  });
  assertEquals(res.headers.get("Access-Control-Allow-Origin"), "http://127.0.0.1:3000");
});

Deno.test("rota: GET /auth/users sem Authorization → 401", async () => {
  const res = await app.request("/auth/users");
  assertEquals(res.status, 401);
});

Deno.test("rota: GET /auth/companies sem Authorization → 401", async () => {
  const res = await app.request("/auth/companies");
  assertEquals(res.status, 401);
});
