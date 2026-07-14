import { createSupabaseAdminClient, createSupabaseClient } from "../_shared/client.ts";
import { createSupabaseAdminAdapter } from "../_shared/adapters/supabase-admin.adapter.ts";
import { createSupabaseFormsRepoAdapter } from "./adapters/supabase-forms-repo.adapter.ts";
import type { CreateFormPorts } from "./services/create-form.service.ts";

export function buildPorts(req: Request): CreateFormPorts {
  const caller = createSupabaseClient(req);
  const admin = createSupabaseAdminClient();
  return {
    admin: createSupabaseAdminAdapter(caller),
    repos: createSupabaseFormsRepoAdapter(admin),
  };
}
