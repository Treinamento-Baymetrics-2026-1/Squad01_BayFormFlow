CREATE TABLE IF NOT EXISTS requesters.t_participants(
    id                  INT             NOT NULL,
    participant_name    VARCHAR(120)    NOT NULL,
    email               VARCHAR(254)    NULL,
    rm                  VARCHAR(30)     NULL,
    is_deleted          BOOLEAN         NOT NULL,
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
        )
);