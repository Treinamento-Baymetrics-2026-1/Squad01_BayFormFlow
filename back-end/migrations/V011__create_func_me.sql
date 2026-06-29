CREATE OR REPLACE FUNCTION public.me()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id  UUID := auth.uid();
    v_is_admin BOOLEAN;
BEGIN
    IF v_user_id IS NULL THEN
        RETURN NULL;
    END IF;
 
    SELECT e.is_admin
      INTO v_is_admin
      FROM consultants.t_employees AS e
     WHERE e.user_id = v_user_id
     LIMIT 1;
 
    RETURN jsonb_build_object(
        'user_id',  v_user_id,
        'is_admin', COALESCE(v_is_admin, FALSE)
    );
END;
$$;
 
REVOKE EXECUTE ON FUNCTION public.me() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.me() TO authenticated, service_role;