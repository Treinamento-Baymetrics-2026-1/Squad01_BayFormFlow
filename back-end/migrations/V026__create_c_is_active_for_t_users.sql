DO $$
BEGIN
    IF NOT EXISTS ( --Só permite criar caso já não exista
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'logins'
          AND table_name = 't_users'
          AND column_name = 'is_active'
    ) THEN
		IF EXISTS( --Verifica se a relação schema-->tabela existe
			SELECT 1 
	        FROM information_schema.columns 
	        WHERE table_schema = 'logins' 
	          AND table_name = 't_users'
		) THEN --Cria a coluna
	        ALTER TABLE logins.t_users 
	        ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
		END IF;
    END IF;
END $$;