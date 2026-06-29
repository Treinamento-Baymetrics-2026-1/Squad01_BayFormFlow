CREATE OR REPLACE FUNCTION helpers.provision_operator(
    p_user_id       UUID,
    p_display_name  TEXT,
    p_position      TEXT,
    p_is_admin      BOOLEAN,
    p_created_by    UUID
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_position    consultants.employee_position;
    v_employee_id SMALLINT;
BEGIN
    v_position := CASE lower(p_position)
        WHEN 'gestor'    THEN 'Gestor'
        WHEN 'validador' THEN 'Validador'
        ELSE NULL
    END::consultants.employee_position;
 
    IF v_position IS NULL THEN
        RAISE EXCEPTION 'Posição inválida: %', p_position
            USING ERRCODE = 'check_violation';
    END IF;
 
   
    IF p_is_admin AND v_position <> 'Gestor'::consultants.employee_position THEN
        RAISE EXCEPTION 'is_admin só é permitido quando position = Gestor.'
            USING ERRCODE = 'check_violation';
    END IF;
 
    INSERT INTO logins.t_users (id, display_name, is_deleted, created_by)
    VALUES (p_user_id, p_name, FALSE, p_created_by);
 
    INSERT INTO consultants.t_employees (position, is_admin, user_id)
    VALUES (v_position, p_is_admin, p_user_id)
    RETURNING id INTO v_employee_id;
 
    RETURN jsonb_build_object(
        'provisioned', TRUE,
        'user_id',     p_user_id,
        'employee_id', v_employee_id,
        'position',    v_position
    );
END;
$$;
 
REVOKE EXECUTE ON FUNCTION helpers.provision_operator(UUID, TEXT, TEXT, BOOLEAN, UUID) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION helpers.provision_operator(UUID, TEXT, TEXT, BOOLEAN, UUID) TO service_role;