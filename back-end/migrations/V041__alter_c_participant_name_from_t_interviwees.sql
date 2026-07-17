DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'requesters' 
          AND table_name = 't_interviwees'
    ) THEN
        ALTER TABLE requesters.t_interviwees 
        DROP CONSTRAINT IF EXISTS requesters_t_participants_ck_participant_name;
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'requesters' 
          AND table_name = 't_interviwees'
          AND column_name = 'participant_name'
    ) THEN
        ALTER TABLE requesters.t_interviwees 
        DROP COLUMN IF EXISTS participant_name;
    END IF;

    IF NOT EXISTS ( --drop na coluna
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'requesters' 
          AND table_name = 't_interviwees' 
          AND column_name = 'display_name'
    ) THEN
        ALTER TABLE requesters.t_interviwees 
        ADD COLUMN display_name VARCHAR(120) NOT NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'requesters_t_participants_ck_display_name'
    ) THEN 
        ALTER TABLE requesters.t_interviwees 
            ADD CONSTRAINT requesters_t_participants_ck_display_name 
            CHECK(
                display_name ~* '^\S(?!.*\s{2,})[a-záàâãçèéêìíîóòôõúùû]+\S$'
            );
    END IF;
END $$;