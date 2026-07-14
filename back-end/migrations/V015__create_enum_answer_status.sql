DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type
        JOIN pg_namespace 
            ON pg_namespace.oid = pg_type.typnamespace
        WHERE 
            pg_type.typname = 'answer_status' 
            AND pg_namespace.nspname = 'consultancies'
    ) THEN
        CREATE TYPE consultancies.answer_status 
        AS ENUM (
            'Aprovada', 
            'Reprovada',
            'Pendente',
            'Em Análise'
        );
    END IF;
END $$;