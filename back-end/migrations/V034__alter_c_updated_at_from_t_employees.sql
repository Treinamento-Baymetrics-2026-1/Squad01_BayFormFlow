DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'consultants' 
          AND table_name = 't_employees' 
          AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE consultants.t_employees 
        DROP COLUMN updated_at;
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'consultants' 
          AND table_name = 't_employees' 
          AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE consultants.t_employees 
        ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;