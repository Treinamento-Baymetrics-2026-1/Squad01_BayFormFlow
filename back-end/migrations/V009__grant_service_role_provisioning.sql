-- Concede ao service_role o acesso mínimo para a saga de provisionamento da
-- Edge Function `auth` (insert direto via supabase-js, sem RPC). O service_role
-- NÃO herda privilégios do postgres nos schemas fora de `public`, então sem
-- estes GRANTs cada insert da saga falha com "permission denied" -> rollback
-- -> 500. Os schemas já estão expostos na API em supabase/config.toml.

-- Acesso aos schemas do supertipo e dos subtipos.
GRANT USAGE ON SCHEMA logins, consultants, requesters TO service_role;

GRANT SELECT, INSERT, DELETE ON logins.t_users TO service_role;

GRANT SELECT, INSERT ON consultants.t_employees TO service_role;

GRANT SELECT, INSERT ON requesters.t_companies TO service_role;

-- USAGE no enum usado no INSERT de position (t_employees).
GRANT USAGE ON TYPE consultants.employee_position TO service_role;

GRANT USAGE ON SCHEMA helpers TO authenticated, service_role;
