import { assertEquals } from "@std/assert";
import { app } from "./app.ts";

Deno.test("rota: POST /researches sem Authorization → 401", async () => {
  const res = await app.request("/researches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      company_id: 1,
      display_name: "Pesquisa de Clima 2026",
      research_period: { start: "2026-01-01T00:00:00Z", end: "2026-03-01T00:00:00Z" },
    }),
  });
  assertEquals(res.status, 401);
});

Deno.test("rota: body inválido (com Authorization) → 400 do Zod, sem tocar o banco", async () => {
  const res = await app.request("/researches", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer dummy" },
    body: JSON.stringify({ company_id: 1 }),
  });
  assertEquals(res.status, 400);
});

Deno.test("rota: preflight OPTIONS reflete o CORS allow-origin", async () => {
  const res = await app.request("/researches", {
    method: "OPTIONS",
    headers: {
      "Origin": "http://127.0.0.1:3000",
      "Access-Control-Request-Method": "POST",
    },
  });
  assertEquals(res.headers.get("Access-Control-Allow-Origin"), "http://127.0.0.1:3000");
});
