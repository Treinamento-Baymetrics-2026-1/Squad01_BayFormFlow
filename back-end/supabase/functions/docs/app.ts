import { Hono } from "hono";
import { cors } from "hono/cors";
import { openApiSpec } from "./openapi.ts";

export const app = new Hono().basePath("/docs");

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "OPTIONS"],
  }),
);

app.get("/openapi.json", (c) => c.json(openApiSpec));

app.get("/", (c) =>
  c.html(`<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>BayFormFlow API — Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        const base = window.location.pathname.endsWith("/")
          ? window.location.pathname
          : window.location.pathname + "/";
        window.ui = SwaggerUIBundle({
          url: base + "openapi.json",
          dom_id: "#swagger-ui",
          presets: [SwaggerUIBundle.presets.apis],
          layout: "BaseLayout",
        });
      };
    </script>
  </body>
</html>`));
