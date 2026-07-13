import { createSupabaseAdminClient, createSupabaseClient } from "../_shared/client.ts";
import { createSupabaseAdminAdapter } from "../_shared/adapters/supabase-admin.adapter.ts";
import { createSupabaseAuthAdapter } from "./adapters/supabase-auth.adapter.ts";
import { createSupabaseRepoAdapter } from "./adapters/supabase-repos.adapter.ts";
import type { ProvisioningPorts } from "./services/provisioning.service.ts";


export function buildPorts(req: Request): ProvisioningPorts {
  const caller = createSupabaseClient(req);
  const admin = createSupabaseAdminClient();
  return {
    admin: createSupabaseAdminAdapter(caller),
    auth: createSupabaseAuthAdapter(admin),
    repos: createSupabaseRepoAdapter(admin),
  };
}
