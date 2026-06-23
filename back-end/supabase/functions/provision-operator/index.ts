import "@supabase/functions-js/edge-runtime.d.ts";
import { createSupabaseAdminClient, createSupabaseClient } from "../_shared/client.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { handleProvisionOperator } from "./handler.ts";

Deno.serve(async (req) => {
  switch (req.method) {
    case "OPTIONS":
      return new Response("ok", { headers: corsHeaders });
    case "POST":
      break;
    default:
      return new Response(
        JSON.stringify({ error: "Método não permitido." }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
  }

  const caller = createSupabaseClient(req);
  const admin = createSupabaseAdminClient();

  const res = await handleProvisionOperator(req, { caller, admin });

  const headers = new Headers(res.headers);
  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }
  return new Response(res.body, { status: res.status, headers });
});
