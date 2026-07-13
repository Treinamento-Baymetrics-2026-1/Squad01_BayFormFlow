CREATE TABLE IF NOT EXISTS requesters.t_participants(
    id                  INT             NOT NULL,
    participant_name    VARCHAR(120)    NOT NULL,
    email               VARCHAR(254)    NULL,
    rm                  VARCHAR(30)     NULL,
    is_deleted          BOOLEAN         NOT NULL DEFAULT FALSE,
    deleted_at          TIMESTAMPTZ     NULL,
    companie_id         SMALLINT        NOT NULL,
    deleted_by          UUID            NULL,

    --PKs
    CONSTRAINT requesters_t_participants_pk PRIMARY KEY(id),

    --CHECKs
    CONSTRAINT requesters_t_participants_ck_participant_name
        CHECK(
            participant_name ~* '^\S(?!.*\s{2,})[a-záàâãçèéêìíîóòôõúùû]+\S$'
        ),
    CONSTRAINT requesters_t_participants_ck_email
        CHECK(
            email ~ '^[^.]{1}(?!.*\.\.)[A-Za-z0-9._%+-]{0,62}[^.]{1}@(?!.*\.\.)[^._%+-]{1}[A-Za-z0-9.-]{0,190}\..*[^._%+-]{1}$'
        ),
    CONSTRAINT requesters_t_participants_ck_is_deleted
        CHECK(
            (is_deleted = FALSE AND deleted_at IS NULL)
            OR
            (is_deleted = TRUE AND deleted_at IS NOT NULL)
        ),
        
    --FKs
    CONSTRAINT requesters_t_participants_fk_companie_id
        FOREIGN KEY (companie_id) REFERENCES requesters.t_companies (id),
    CONSTRAINT requesters_t_participants_fk_deleted_by
        FOREIGN KEY (deleted_by) REFERENCES logins.t_users (id)
);