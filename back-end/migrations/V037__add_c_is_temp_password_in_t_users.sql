DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'consultancies' 
          AND table_name = 't_users' 
          AND column_name = 'is_temp_password'
    ) THEN
        IF EXISTS( --Verifica se a relação schema-->tabela existe
			SELECT 1 
	        FROM information_schema.columns 
	        WHERE table_schema = 'logins' 
	          AND table_name = 't_users'
		) THEN --Cria a coluna
	        ALTER TABLE logins.t_users
            ADD COLUMN is_temp_password BOOLEAN NOT NULL DEFAULT TRUE;
		END IF;
    END IF;
END $$;