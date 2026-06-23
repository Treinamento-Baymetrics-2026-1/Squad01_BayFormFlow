CREATE TABLE IF NOT EXISTS consultants.t_employees(
    id SMALLINT NOT NULL,
    position consultants.employee_position NOT NULL,
    is_admin BOOLEAN NOT NULL,
    updated_at TIMESTAMPTZ NULL,
    updated_by UUID NULL,
    user_id UUID NOT NULL,

    CONSTRAINT consultants_t_employees_pk PRIMARY KEY(id),
    
    CONSTRAINT consultants_t_employees_ck_updated_at
        CHECK(
            updated_at <= CURRENT_TIMESTAMP(0)
        ),
    
    CONSTRAINT consultants_t_employees_fk_updated_by
        FOREIGN KEY(updated_by)
            REFERENCES logins.t_users(id),

    CONSTRAINT consultants_t_employees_fk_updated_by
        FOREIGN KEY(updated_by)
            REFERENCES logins.t_users(id),
);