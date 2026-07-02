-- Seed do PRIMEIRO administrador (bootstrap "ovo-e-galinha"): cria o usuário no
-- Auth (auth.users + auth.identities), o supertipo (logins.t_users) e o subtipo
-- admin (consultants.t_employees). É ele quem chama a Edge Function `auth` para
-- provisionar todos os demais operadores/companias.
--
-- ORDEM DE EXECUÇÃO: rode DEPOIS do Flyway (as tabelas logins/consultants vêm de
-- lá). Se rodar antes (ex.: `supabase db reset` roda o seed antes do Flyway), o
-- guard abaixo apenas avisa e sai sem falhar. Idempotente: pode rodar de novo.
--
-- Rodar manualmente:
--   psql "$DATABASE_URL" -f supabase/seed.sql
--   (ou cole no Studio > SQL Editor)
--
-- Credenciais de DEV (troque à vontade):
--   e-mail: admin@bayformflow.local
--   senha : Admin@12345

DO $$
DECLARE
    v_admin_id UUID := '11111111-1111-1111-1111-111111111111';
    v_email    TEXT := 'admin@bayformflow.local';
    v_password TEXT := 'Admin@12345';
BEGIN
    -- Guard: se o schema do Flyway ainda não existe, avisa e sai sem falhar.
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.schemata WHERE schema_name = 'logins'
    ) THEN
        RAISE NOTICE '[seed] schema "logins" ausente — rode o Flyway antes do seed. Nada foi feito.';
        RETURN;
    END IF;

    -- 1) Usuário no Auth (Supabase GoTrue). pgcrypto vive no schema extensions.
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_admin_id) THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password,
            email_confirmed_at, created_at, updated_at,
            raw_app_meta_data, raw_user_meta_data,
            confirmation_token, email_change, email_change_token_new, recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            v_admin_id, 'authenticated', 'authenticated', v_email,
            extensions.crypt(v_password, extensions.gen_salt('bf')),
            NOW(), NOW(), NOW(),
            '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
            '', '', '', ''
        );

        INSERT INTO auth.identities (
            id, user_id, provider_id, identity_data,
            provider, last_sign_in_at, created_at, updated_at
        ) VALUES (
            extensions.gen_random_uuid(), v_admin_id, v_admin_id::text,
            jsonb_build_object('sub', v_admin_id::text, 'email', v_email),
            'email', NOW(), NOW(), NOW()
        );
    END IF;

    -- 2) Supertipo. created_by é autorreferência (é o primeiro usuário; a FK é
    --    checada após a linha existir, então funciona no mesmo INSERT).
    IF NOT EXISTS (SELECT 1 FROM logins.t_users WHERE id = v_admin_id) THEN
        INSERT INTO logins.t_users (id, display_name, is_deleted, created_by)
        VALUES (v_admin_id, 'Admin Master', FALSE, v_admin_id);
    END IF;

    -- 3) Subtipo operador admin (Gestor + is_admin => me() responde is_admin:true).
    IF NOT EXISTS (SELECT 1 FROM consultants.t_employees WHERE user_id = v_admin_id) THEN
        INSERT INTO consultants.t_employees (position, is_admin, user_id)
        VALUES ('Gestor', TRUE, v_admin_id);
    END IF;

    RAISE NOTICE '[seed] admin pronto: % (senha: %) id=%', v_email, v_password, v_admin_id;
END $$;
