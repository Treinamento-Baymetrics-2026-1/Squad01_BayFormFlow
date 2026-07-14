import { createSupabaseAdminClient, createSupabaseClient } from "../_shared/client.ts";
import { createSupabaseAdminAdapter } from "../_shared/adapters/supabase-admin.adapter.ts";
import { createSupabaseResearchesRepoAdapter } from "./adapters/supabase-researches-repo.adapter.ts";
import type { CreateResearchPorts } from "./services/create-research.service.ts";

export function buildPorts(req: Request): CreateResearchPorts {
  const caller = createSupabaseClient(req);
  const admin = createSupabaseAdminClient();
  return {
    admin: createSupabaseAdminAdapter(caller),
    repos: createSupabaseResearchesRepoAdapter(admin),
  };
}
