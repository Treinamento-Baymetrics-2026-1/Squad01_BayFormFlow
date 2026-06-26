ALTER TABLE IF EXISTS requesters.t_companies
DROP CONSTRAINT IF EXISTS requesters_t_companies_ck_trading_name;

ALTER TABLE IF EXISTS requesters.t_companies
DROP COLUMN IF EXISTS trading_name;