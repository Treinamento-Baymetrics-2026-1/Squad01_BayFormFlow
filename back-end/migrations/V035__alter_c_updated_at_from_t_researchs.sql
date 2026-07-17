DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'consultancies' 
          AND table_name = 't_researchs' 
          AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE consultancies.t_researchs 
        DROP COLUMN updated_at;
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'consultancies' 
          AND table_name = 't_researchs' 
          AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE consultancies.t_researchs 
        ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;