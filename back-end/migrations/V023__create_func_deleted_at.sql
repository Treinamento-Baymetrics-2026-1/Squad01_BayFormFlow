CREATE OR REPLACE FUNCTION helpers.deleted_at()
RETURNS TRIGGER
LANGUAGE plpgsql
VOLATILE
PARALLEL UNSAFE
SECURITY INVOKER
COST 1
SET search_path = pg_catalog
AS $$
BEGIN
    IF NEW.is_deleted = TRUE AND OLD.deleted_at = NULL THEN
        NEW.deleted_at := CURRENT_TIMESTAMP;
    END IF;

    RETURN NEW;
END;
$$;