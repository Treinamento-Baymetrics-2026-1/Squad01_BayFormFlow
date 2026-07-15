DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'consultancies'
          AND table_name = 't_answers'
          AND column_name = 'created_at'
          AND column_default IS NOT NULL
    ) THEN
        ALTER TABLE consultancies.t_answers
        ALTER COLUMN created_at DROP DEFAULT;
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'consultancies'
          AND table_name = 't_answers'
          AND column_name = 'created_at'
          AND column_default IS NULL
    ) THEN
        ALTER TABLE consultancies.t_answers 
        ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;