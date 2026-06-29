DO $$
BEGIN
    -- Verifica se a tabela existe e se a coluna 'name' ainda está lá
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'logins' 
          AND table_name = 't_users' 
          AND column_name = 'name'
    ) THEN
        ALTER TABLE IF EXISTS logins.t_users RENAME COLUMN name TO display_name;
    END IF;
END $$;