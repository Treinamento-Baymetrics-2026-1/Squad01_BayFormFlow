CREATE TABLE IF NOT EXISTS consultancies.t_researchs (
    id INT GENERATED ALWAYS AS IDENTITY(
        START WITH 1
        INCREMENT BY 1
        MINVALUE 1
        MAXVALUE 2147483647
        CACHE 1
        SEQUENCE NAME consultancies_t_researchs_id_seq
    ),
    display_name            VARCHAR(120)                    NOT NULL,
    research_description    VARCHAR(2000)                   NOT NULL,
    research_period         TSTZRANGE                       NOT NULL,
    research_status         consultancies.research_status   NOT NULL DEFAULT 'Criado',
    created_at              TIMESTAMPTZ                     NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    updated_at              TIMESTAMPTZ                     NULL,
    is_deleted              BOOLEAN                         NOT NULL DEFAULT FALSE,
    deleted_at              TIMESTAMPTZ                     NULL,
    company_id              SMALLINT                        NOT NULL,
    updated_by              UUID                            NULL,
    deleted_by              UUID                            NULL,
    created_by              UUID                            NOT NULL,

    --PKs
    CONSTRAINT consultancies_t_researchs_pk PRIMARY KEY (id),

    --CHECKs
    CONSTRAINT consultancies_t_researchs_ck_display_name
        CHECK(
            display_name ~* '^\S(?!.*\s{2,})[a-záàâãèéêìíîóòôôúùû.,& -]+\S$'
        ),
    CONSTRAINT consultancies_t_researchs_ck_research_description
        CHECK(
            research_description ~* '^\S(?!.*\s{2,})[a-záàâãèéêìíîóòôôúùû.,& -]+\S$'
        ),
    CONSTRAINT consultancies_t_researchs_ck_research_period
        CHECK(
            LOWER(research_period) < UPPER(research_period)
        ),
    CONSTRAINT consultancies_t_researchs_ck_is_deleted
        CHECK(
            (is_deleted = FALSE AND deleted_at IS NULL)
            OR
            (is_deleted = TRUE AND deleted_at IS NOT NULL)
        ),

    --FKs
    CONSTRAINT consultancies_t_researchs_fk_company_id
        FOREIGN KEY (company_id)  REFERENCES requesters.t_companies (id),
    CONSTRAINT consultancies_t_researchs_fk_updated_by
        FOREIGN KEY (updated_by)  REFERENCES logins.t_users (id),
    CONSTRAINT consultancies_t_researchs_fk_deleted_by
        FOREIGN KEY (deleted_by)  REFERENCES logins.t_users (id),
    CONSTRAINT consultancies_t_researchs_fk_created_by
        FOREIGN KEY (created_by)  REFERENCES logins.t_users (id)
);