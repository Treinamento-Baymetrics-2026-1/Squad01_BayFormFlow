CREATE TABLE IF NOT EXISTS consultancies.t_answers (
    id BIGINT GENERATED ALWAYS AS IDENTITY(
        START WITH 1
        INCREMENT BY 1
        MINVALUE 1
        MAXVALUE 9223372036854775807
        CACHE 1
        SEQUENCE NAME consultancies_t_answers_id_seq
    ),
    answer_status   consultancies.answer_status NOT NULL DEFAULT 'Pendente',
    structure       JSONB                       NOT NULL,
    answered_at     TIMESTAMPTZ                 NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    created_at      TIMESTAMPTZ                 NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    form_version_id UUID                        NOT NULL,
    form_id         UUID                        NOT NULL,       
    participant_id  INT                         NOT NULL,
    validated_by    SMALLINT                    NULL,               

    --PKs
    CONSTRAINT consultancies_t_answers_pk PRIMARY KEY (id),

    --CHECKS
    CONSTRAINT consultancies_t_answers_ck_answered_at
        CHECK(
            answered_at <= CURRENT_TIMESTAMP(0)
        ),
    CONSTRAINT consultancies_t_answers_ck_created_at
        CHECK(
            created_at <= CURRENT_TIMESTAMP(0)
        ),

    --FKs
    CONSTRAINT consultancies_t_answers_fk_form_version_id
        FOREIGN KEY (form_version_id) REFERENCES consultancies.t_form_versions(id),
    CONSTRAINT consultancies_t_answers_fk_form_id
        FOREIGN KEY (form_id) REFERENCES consultancies.t_forms(id),
    CONSTRAINT consultancies_t_answers_fk_participant_id
        FOREIGN KEY (participant_id) REFERENCES requesters.t_participants(id),
    CONSTRAINT consultancies_t_answers_fk_validated_by
        FOREIGN KEY (validated_by) REFERENCES consultants.t_employees(id)
    
);