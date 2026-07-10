DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type
        JOIN pg_namespace 
            ON pg_namespace.oid = pg_type.typnamespace
        WHERE 
            pg_type.typname = 'form_status' 
            AND pg_namespace.nspname = 'consultancies'
    ) THEN
        CREATE TYPE consultancies.form_status 
        AS ENUM (
            'Criado', 
            'Mudança Solicitada', 
            'Mudança Realizada',
            'Em Andamento', 
            'Concluido', 
            'Cancelado'
        );
    END IF;
END $$;