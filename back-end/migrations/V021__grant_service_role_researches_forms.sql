-- Concede ao service_role o acesso mínimo para as sagas das Edge Functions
-- `researches` e `forms` (insert direto via supabase-js, sem RPC). O
-- service_role NÃO herda privilégios do postgres nos schemas fora de
-- `public`, então sem estes GRANTs cada insert/select/delete falha com
-- "permission denied" -> 400/500. Os schemas já estão expostos na API em
-- supabase/config.toml. Mesmo racional da V009.

-- Acesso ao schema consultancies (ainda não concedido em nenhuma migration).
GRANT USAGE ON SCHEMA consultancies TO service_role;

-- consultancies.t_researchs: insert na criação da pesquisa; select via
-- `.select().single()` após o insert (RETURNING); delete no rollback
-- compensatório se a atribuição de gestor/validadores falhar.
GRANT SELECT, INSERT, DELETE ON consultancies.t_researchs TO service_role;

-- consultants.t_employees_research: atribuição de gestor/validadores à
-- pesquisa (researches) e checagem de "é o gestor desta pesquisa?"
-- (forms). USAGE no schema consultants já vem da V009.
GRANT SELECT, INSERT ON consultants.t_employees_research TO service_role;

-- consultancies.t_forms: insert do cabeçalho do formulário; select via
-- RETURNING; delete no rollback compensatório se a 1ª versão falhar.
GRANT SELECT, INSERT, DELETE ON consultancies.t_forms TO service_role;

-- consultancies.t_form_versions: insert da 1ª versão do formulário; select
-- via RETURNING.
GRANT SELECT, INSERT ON consultancies.t_form_versions TO service_role;

-- USAGE no enum usado no INSERT de version_status (t_form_versions) —
-- version_status é sempre fixado como 'Em Análise' pelo service, nunca
-- vem do cliente.
GRANT USAGE ON TYPE consultancies.version_status TO service_role;
