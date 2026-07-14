CREATE TABLE IF NOT EXISTS consultancies.t_forms (
    id                  UUID                        NOT NULL DEFAULT extensions.gen_random_uuid(),
    display_name        VARCHAR(120)                NOT NULL,
    forms_description   VARCHAR(2000)               NOT NULL,
    time_period         TSTZRANGE                   NOT NULL,
    form_status         consultancies.form_status   NOT NULL DEFAULT 'Criado',
    participant_target  SMALLINT                    NOT NULL,
    published_at        TIMESTAMPTZ                 NULL,             
    created_at          TIMESTAMPTZ                 NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    updated_at          TIMESTAMPTZ                 NULL,
    is_deleted          BOOLEAN                     NOT NULL DEFAULT FALSE,
    deleted_at          TIMESTAMPTZ                 NULL,
    research_id         INT                         NOT NULL,
    updated_by          UUID                        NULL,
    deleted_by          UUID                        NULL,
    created_by          UUID                        NOT NULL,

    --PKs
    CONSTRAINT consultancies_t_forms_pk PRIMARY KEY (id),

    --CHECKs
    CONSTRAINT consultancies_t_forms_ck_display_name
        CHECK(
            display_name ~* '^\S(?!.*\s{2,})[a-záàâãèéêìíîóòôôúùû.,& -]+\S$'
        ),
    CONSTRAINT consultancies_t_forms_ck_forms_description
        CHECK(
            forms_description ~* '^\S(?!.*\s{2,})[a-záàâãèéêìíîóòôôúùû.,& -]+\S$'
        ),
    CONSTRAINT consultancies_t_forms_ck_time_period
        CHECK(
            LOWER(time_period) < UPPER(time_period)
        ),
    CONSTRAINT consultancies_t_forms_ck_participant_target
        CHECK (participant_target > 0),

    CONSTRAINT consultancies_t_forms_ck_is_deleted
        CHECK(
            (is_deleted = FALSE AND deleted_at IS NULL)
            OR
            (is_deleted = TRUE AND deleted_at IS NOT NULL)
        ),
    
    --FKs
    CONSTRAINT consultancies_t_forms_fk_research_id
        FOREIGN KEY (research_id) REFERENCES consultancies.t_researchs (id),
    CONSTRAINT consultancies_t_forms_fk_deleted_by
        FOREIGN KEY (deleted_by)  REFERENCES logins.t_users (id),
    CONSTRAINT consultancies_t_forms_fk_updated_by
        FOREIGN KEY (updated_by)  REFERENCES logins.t_users (id),
    CONSTRAINT consultancies_t_forms_fk_created_by
        FOREIGN KEY (created_by)  REFERENCES logins.t_users (id)
);