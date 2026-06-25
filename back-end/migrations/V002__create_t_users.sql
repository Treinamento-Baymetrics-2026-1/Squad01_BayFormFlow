CREATE TABLE IF NOT EXISTS logins.t_users(
    id          UUID            NOT NULL DEFAULT extensions.gen_random_uuid(),
    name        VARCHAR(120)    NOT NULL,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    is_deleted  BOOLEAN         NOT NULL,
    deleted_at  TIMESTAMPTZ     NULL,
    created_by  UUID            NOT NULL,

    CONSTRAINT logins_t_users_pk PRIMARY KEY(id),

    CONSTRAINT logins_t_users_ck_name
        CHECK(
            name ~* '^\S(?!.*\s{2,})[a-záàâãèéêìíîóòôôúùû ]+\S$'
        ),
    
    CONSTRAINT logins_t_users_ck_deleted_at
        CHECK(
            deleted_at <= CURRENT_TIMESTAMP(0)
        ),

    CONSTRAINT logins_t_users_fk_id
        FOREIGN KEY(id)
            REFERENCES auth.users(id),

    CONSTRAINT logins_t_users_fk_created_by
        FOREIGN KEY(created_by)
            REFERENCES logins.t_users(id)
);