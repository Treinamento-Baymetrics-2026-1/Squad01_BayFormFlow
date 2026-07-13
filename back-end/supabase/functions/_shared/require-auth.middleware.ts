import type { MiddlewareHandler } from "npm:hono@4";

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const auth = c.req.header("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return c.json({ error: "Autenticação necessária." }, 401);
  }
  await next();
};
