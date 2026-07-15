DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'consultants'
          AND table_name = 't_employee_researchs'
          AND column_name = 'created_at'
          AND column_default IS NOT NULL
    ) THEN
        ALTER TABLE consultants.t_employee_researchs
        ALTER COLUMN created_at DROP DEFAULT;
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'consultants'
          AND table_name = 't_employee_researchs'
          AND column_name = 'created_at'
          AND column_default IS NULL
    ) THEN
        ALTER TABLE consultants.t_employee_researchs 
        ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;