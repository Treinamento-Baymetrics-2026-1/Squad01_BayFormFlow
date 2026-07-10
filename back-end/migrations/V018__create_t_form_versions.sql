CREATE TABLE IF NOT EXISTS consultancies.t_form_versions (
    id              UUID                            NOT NULL    DEFAULT extensions.gen_random_uuid(),
    form            JSONB                           NOT NULL,
    form_link       VARCHAR(46)                     NULL        GENERATED ALWAYS AS (
        form_id || '-' || version_name
    ) STORED,
    version_status  consultancies.version_status    NOT NULL,
    version_name    VARCHAR(10)                     NOT NULL,
    created_at      TIMESTAMPTZ                     NOT NULL    DEFAULT CURRENT_TIMESTAMP(0),
    form_id         UUID                            NOT NULL,
    clone_of        UUID                            NULL,
    created_by      UUID                            NOT NULL,
    

    --PKs
    CONSTRAINT consultancies_t_form_versions_pk PRIMARY KEY (id),

    --FKs
    CONSTRAINT consultancies_t_form_versions_fk_form_id
        FOREIGN KEY (form_id)  REFERENCES consultancies.t_forms (id),
    CONSTRAINT consultancies_t_form_versions_fk_clone_of
        FOREIGN KEY (clone_of) REFERENCES consultancies.t_form_versions (id),
    CONSTRAINT consultancies_t_answers_fk_created_by
        FOREIGN KEY (created_by) REFERENCES logins.t_users (id)
);