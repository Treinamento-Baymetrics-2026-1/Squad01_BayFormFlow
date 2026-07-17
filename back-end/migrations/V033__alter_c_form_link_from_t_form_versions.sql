DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'consultancies'
          AND table_name = 't_form_versions'
          AND column_name = 'form_link'
    ) THEN
        ALTER TABLE consultancies.t_form_versions 
        DROP COLUMN form_link;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'consultancies'
          AND table_name = 't_form_versions'
          AND column_name = 'form_link'
    ) THEN
        ALTER TABLE consultancies.t_form_versions 
        ADD COLUMN form_link VARCHAR(47) NULL GENERATED ALWAYS AS (
            form_id || '-' || version_name
        ) STORED;
    END IF;
END $$;