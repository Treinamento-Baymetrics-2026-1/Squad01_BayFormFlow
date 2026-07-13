CREATE SCHEMA IF NOT EXISTS consultancies;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'research_status' AND n.nspname = 'consultancies'
    ) THEN
        CREATE TYPE consultancies.research_status AS ENUM (
            'Criado', 'Mudança Solicitada', 'Mudança Realizada',
            'Em Andamento', 'Concluido', 'Cancelado'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'form_status' AND n.nspname = 'consultancies'
    ) THEN
        CREATE TYPE consultancies.form_status AS ENUM (
            'Criado', 'Mudança Solicitada', 'Mudança Realizada',
            'Em Andamento', 'Concluido', 'Cancelado'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'version_status' AND n.nspname = 'consultancies'
    ) THEN
        CREATE TYPE consultancies.version_status AS ENUM (
            'Aprovada', 'Reprovada', 'Em Produção'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'answer_status' AND n.nspname = 'consultancies'
    ) THEN
        CREATE TYPE consultancies.answer_status AS ENUM (
            'Pendente', 'Aprovada', 'Reprovada'
        );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS consultancies.t_researchs (
    id              INT GENERATED ALWAYS AS IDENTITY
                        (SEQUENCE NAME consultancies.t_researchs_id_seq),
    display_name            VARCHAR(120)  NOT NULL,
    research_description     VARCHAR(2000),
    research_period          TSTZRANGE     NOT NULL,
    research_status          consultancies.research_status NOT NULL DEFAULT 'Criado',
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    updated_at      TIMESTAMPTZ,
    is_deleted      BOOLEAN       NOT NULL DEFAULT FALSE,
    deleted_at      TIMESTAMPTZ,              
    company_id      SMALLINT      NOT NULL,
    updated_by      SMALLINT,
    deleted_by      SMALLINT,
    created_by      UUID NOT NULL,

    CONSTRAINT consultancies_t_researchs_pk PRIMARY KEY (id),

    CONSTRAINT consultancies_t_researchs_ck_updated_at
        CHECK (updated_at <= CURRENT_TIMESTAMP(0)),
    CONSTRAINT consultancies_t_researchs_ck_deleted_at
        CHECK (deleted_at <= CURRENT_TIMESTAMP(0)),

    CONSTRAINT consultancies_t_researchs_fk_company
        FOREIGN KEY (company_id)  REFERENCES requesters.t_companies (id),
    CONSTRAINT consultancies_t_researchs_fk_updated_by
        FOREIGN KEY (updated_by)  REFERENCES consultants.t_employees (id),
    CONSTRAINT consultancies_t_researchs_fk_deleted_by
        FOREIGN KEY (deleted_by)  REFERENCES consultants.t_employees (id)
);

CREATE TABLE IF NOT EXISTS consultancies.t_forms (
    id                 UUID         NOT NULL DEFAULT extensions.gen_random_uuid(),
    display_name               VARCHAR(120) NOT NULL,
    forms_description        VARCHAR(2000),
    time_period        TSTZRANGE    NOT NULL,
    forms_status             consultancies.form_status NOT NULL DEFAULT 'Criado',
    participant_target SMALLINT     NOT NULL,
    published_at       TIMESTAMPTZ,             -- corrigido de "publicated_at"
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    updated_at         TIMESTAMPTZ,
    is_deleted         BOOLEAN      NOT NULL DEFAULT FALSE,  -- corrigido de "BOOLEN"
    deleted_at         TIMESTAMPTZ,
    deleted_by         SMALLINT,            -- ADICIONADO (completa o trio)
    research_id        INT          NOT NULL,
    created_by      UUID NOT NULL,

    CONSTRAINT consultancies_t_forms_pk PRIMARY KEY (id),

    CONSTRAINT consultancies_t_forms_ck_participant_target
        CHECK (participant_target > 0),
    CONSTRAINT consultancies_t_forms_ck_updated_at
        CHECK (updated_at <= CURRENT_TIMESTAMP(0)),
    CONSTRAINT consultancies_t_forms_ck_deleted_at
        CHECK (deleted_at <= CURRENT_TIMESTAMP(0)),

    CONSTRAINT consultancies_t_forms_fk_research
        FOREIGN KEY (research_id) REFERENCES consultancies.t_researchs (id),
    CONSTRAINT consultancies_t_forms_fk_deleted_by
        FOREIGN KEY (deleted_by)  REFERENCES consultants.t_employees (id)
);

-- ----------------------------------------------------------------------------
-- t_form_versions — versões imutáveis do formulário (linhagem via clone_of)
-- Sem soft-delete de propósito: versão é histórico, não se apaga.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS consultancies.t_form_versions (
    id        UUID         NOT NULL DEFAULT extensions.gen_random_uuid(),
    structure JSONB        NOT NULL,
    link      VARCHAR(2048),
    version_status    consultancies.version_status NOT NULL DEFAULT 'Em Produção',
    version_name   VARCHAR(10)  NOT NULL,
    form_id   UUID         NOT NULL,
    clone_of  UUID,                             -- NULL na primeira versão

    CONSTRAINT consultancies_t_form_versions_pk PRIMARY KEY (id),

    -- necessária pra FK composta lá em t_answers (garante id+form_id juntos)
    CONSTRAINT consultancies_t_form_versions_uq_id_form UNIQUE (id, form_id),

    CONSTRAINT consultancies_t_form_versions_fk_form
        FOREIGN KEY (form_id)  REFERENCES consultancies.t_forms (id),
    CONSTRAINT consultancies_t_form_versions_fk_clone_of
        FOREIGN KEY (clone_of) REFERENCES consultancies.t_form_versions (id)
);

-- ----------------------------------------------------------------------------
-- t_answers — respostas dos participantes
-- Sem soft-delete de propósito: "envio definitivo" = imutável (RNF09).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS consultancies.t_answers (
    id              BIGINT GENERATED ALWAYS AS IDENTITY
                        (SEQUENCE NAME consultancies.t_answers_id_seq),
    answer_status   consultancies.answer_status NOT NULL DEFAULT 'Pendente',
    structure       JSONB       NOT NULL,
    answered_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    form_version_id UUID        NOT NULL,        -- corrigido de INT
    form_id         UUID        NOT NULL,        -- corrigido de INT
    participant_id  INT         NOT NULL,
    validated_by    SMALLINT,
    created_by      UUID NOT NULL,

    CONSTRAINT consultancies_t_answers_pk PRIMARY KEY (id),

    CONSTRAINT consultancies_t_answers_fk_version
        FOREIGN KEY (form_version_id, form_id)
        REFERENCES consultancies.t_form_versions (id, form_id),

    CONSTRAINT consultancies_t_answers_fk_validated_by
        FOREIGN KEY (validated_by) REFERENCES consultants.t_employees (id)

);

-- ----------------------------------------------------------------------------
-- Permissões: service_role precisa de acesso ao schema e tabelas
-- (o supabase-js admin client usa PostgREST com a service_role key)
-- ----------------------------------------------------------------------------
GRANT USAGE ON SCHEMA consultancies TO service_role;

GRANT SELECT, INSERT, UPDATE ON consultancies.t_researchs      TO service_role;
GRANT SELECT, INSERT, UPDATE ON consultancies.t_forms           TO service_role;
GRANT SELECT, INSERT         ON consultancies.t_form_versions   TO service_role;
GRANT SELECT, INSERT         ON consultancies.t_answers         TO service_role;

GRANT USAGE ON TYPE consultancies.research_status TO service_role;
GRANT USAGE ON TYPE consultancies.form_status     TO service_role;
GRANT USAGE ON TYPE consultancies.version_status  TO service_role;
GRANT USAGE ON TYPE consultancies.answer_status   TO service_role;

GRANT USAGE, SELECT ON SEQUENCE consultancies.t_researchs_id_seq TO service_role;
GRANT USAGE, SELECT ON SEQUENCE consultancies.t_answers_id_seq   TO service_role;