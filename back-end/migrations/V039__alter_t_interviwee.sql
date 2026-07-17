DO $$ 
BEGIN
    IF EXISTS ( --drop na constraint
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'requesters' 
          AND table_name = 't_interviwees'
    ) THEN
        ALTER TABLE requesters.t_interviwees 
        DROP CONSTRAINT IF EXISTS requesters_t_participants_fk_companie_id;
    END IF;

    IF EXISTS ( --drop na coluna
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'requesters' 
          AND table_name = 't_interviwees' 
          AND column_name = 'companie_id'
    ) THEN
        ALTER TABLE requesters.t_interviwees 
        DROP COLUMN companie_id;
    END IF;

    IF NOT EXISTS ( --add nova coluna
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'requesters' 
          AND table_name = 't_interviwees' 
          AND column_name = 'company_id'
    ) THEN
        ALTER TABLE requesters.t_interviwees 
        ADD COLUMN company_id SMALLINT NOT NULL;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'requesters_t_participants_fk_company_id'
    ) THEN 
        ALTER TABLE requesters.t_interviwees 
            ADD CONSTRAINT requesters_t_participants_fk_company_id 
            FOREIGN KEY (company_id) REFERENCES requesters.t_companies (id);
    END IF;
END $$;