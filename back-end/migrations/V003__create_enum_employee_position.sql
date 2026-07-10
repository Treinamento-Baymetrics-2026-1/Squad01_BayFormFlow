DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type 
        JOIN pg_namespace 
            ON pg_namespace.oid = pg_type.typnamespace 
        WHERE 
            pg_type.typname = 'employee_position' 
            AND pg_namespace.nspname = 'consultants'
    ) THEN
        CREATE TYPE consultants.employee_position
        AS ENUM(
            'Gestor',
            'Validador'
        );
    END IF;
END 
$$;