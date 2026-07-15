DROP TRIGGER IF EXISTS logins_t_users_trg_deleted_at
ON logins.t_users;

CREATE TRIGGER logins_t_users_trg_deleted_at
BEFORE UPDATE ON logins.t_users
FOR EACH ROW
EXECUTE FUNCTION helpers.deleted_at();