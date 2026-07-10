DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type
        JOIN pg_namespace
            ON pg_namespace.oid = pg_type.typnamespace
        WHERE 
            pg_type.typname = 'version_status' 
            AND pg_namespace.nspname = 'consultancies'
    ) THEN
        CREATE TYPE consultancies.version_status 
        AS ENUM (
            'Aprovada', 
            'Reprovada', 
            'Em Produção',
            'Em Análise'
        );
    END IF;
END $$;