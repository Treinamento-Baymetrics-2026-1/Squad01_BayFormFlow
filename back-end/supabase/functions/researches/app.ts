import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { requireAuth } from "../_shared/require-auth.middleware.ts";
import { createResearchSchema } from "./schemas/create-research.schema.ts";
import { createResearchController } from "./controllers/researches.controller.ts";

export const app = new Hono().basePath("/researches");

app.use(
  "*",
  cors({
    origin: "http://127.0.0.1:3000",
    allowHeaders: ["authorization", "x-client-info", "apikey", "content-type"],
    allowMethods: ["POST", "OPTIONS"],
  }),
);

app.post("/", requireAuth, zValidator("json", createResearchSchema), (c) => {
  return createResearchController(c, c.req.valid("json"));
});
