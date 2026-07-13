CREATE TABLE IF NOT EXISTS consultants.t_employees_research (
    id INT GENERATED ALWAYS AS IDENTITY(
        START WITH 1
        INCREMENT BY 1
        MINVALUE 1
        MAXVALUE 2147483647
        CACHE 1
        SEQUENCE NAME consultancies_t_researchs_id_seq
    ),
    created_at      TIMESTAMPTZ NOT NULL,
    manager_id      SMALLINT    NOT NULL,
    research_alloc  INT         NOT NULL,
    created_by      UUID        NOT NULL,

    --PKs
    CONSTRAINT consultants_t_employee_research_pk PRIMARY KEY (id),

    --FKs
    CONSTRAINT consultants_t_employee_research_fk_manager_id
        FOREIGN KEY (manager_id) REFERENCES consultants.t_employees (id),
    CONSTRAINT consultants_t_employee_research_fk_research_alloc
        FOREIGN KEY (research_alloc) REFERENCES consultancies.t_researchs (id),
    CONSTRAINT consultants_t_employee_research_fk_created_by
        FOREIGN KEY (created_by) REFERENCES logins.t_users (id)
);