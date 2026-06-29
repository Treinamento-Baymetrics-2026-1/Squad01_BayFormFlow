CREATE TABLE IF NOT EXISTS requesters.t_companies(
    id SMALLINT GENERATED ALWAYS AS IDENTITY(
        START WITH 1
        INCREMENT BY 1
        MINVALUE 1
        MAXVALUE 32767
        CACHE 1
        SEQUENCE NAME requesters.t_companies_id_seq
    ),
    trading_name    VARCHAR(60) NOT NULL,
    cnpj            VARCHAR(14) NOT NULL,
    phonenumber     VARCHAR(15) NOT NULL,
    user_id         UUID        NOT NULL,

    CONSTRAINT requesters_t_companies_pk PRIMARY KEY(id),

    CONSTRAINT requesters_t_companies_ck_trading_name
        CHECK(
            trading_name ~* '^\S(?!.*\s{2,})[a-záàâãèéêìíîóòôôúùû ]+\S$'
        ),
    
    CONSTRAINT requesters_t_companies_ck_cnpj
        CHECK(
            requesters.is_valid_cnpj(cnpj)
        ),
    
    CONSTRAINT requesters_t_companies_ck_phonenumber
        CHECK(
            phonenumber ~ '^[0-9]{7,15}$'
        ),
    
    CONSTRAINT requesters_t_companies_fk_user_id
        FOREIGN KEY (user_id)
            REFERENCES logins.t_users(id)
);