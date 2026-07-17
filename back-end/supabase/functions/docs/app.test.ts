import { assertEquals } from "@std/assert";
import { app } from "./app.ts";

Deno.test("rota: GET /docs/openapi.json retorna a spec OpenAPI", async () => {
  const res = await app.request("/docs/openapi.json");
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.openapi, "3.0.3");
  assertEquals(Object.keys(body.paths).sort(), [
    "/auth/companies",
    "/auth/operators",
    "/auth/users",
    "/forms",
    "/researches",
  ]);
});

Deno.test("rota: GET /docs retorna a página do Swagger UI", async () => {
  const res = await app.request("/docs");
  assertEquals(res.status, 200);
  assertEquals(res.headers.get("Content-Type")?.includes("text/html"), true);
});
