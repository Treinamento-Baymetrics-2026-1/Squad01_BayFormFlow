DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'requesters' 
          AND table_name = 't_interviwees'
    ) THEN
        CREATE UNIQUE INDEX IF NOT EXISTS requesters_t_interviwees_idxuqpt_email
        ON requesters.t_interviwees
        USING btree (email)
        WHERE is_deleted = FALSE;

        CREATE UNIQUE INDEX IF NOT EXISTS requesters_t_interviwees_idxuqpt_rm
        ON requesters.t_interviwees
        USING btree (rm)
        WHERE is_deleted = FALSE;
    END IF;
END $$;