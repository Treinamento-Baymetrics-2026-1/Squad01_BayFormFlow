CREATE OR REPLACE FUNCTION requesters.is_valid_cnpj(p_cnpj TEXT) 
RETURNS BOOLEAN AS $$
DECLARE
    v_sum INT;
    v_digit INT;
    v_i INT;
    v_char_val INT;
    v_cnpj_array INT[14];
    -- Pesos oficiais para o primeiro e segundo dígito verificador
    v_weights_1 INT[] := ARRAY[5,4,3,2,9,8,7,6,5,4,3,2];
    v_weights_2 INT[] := ARRAY[6,5,4,3,2,9,8,7,6,5,4,3,2];
BEGIN
    -- 1. Valida o tamanho exato de 14 caracteres
    IF LENGTH(v_cnpj) != 14 THEN
        RETURN FALSE;
    END IF;

    -- Rejeita CNPJs com todos os dígitos iguais (ex: 111.111.111-11)
    IF p_cnpj IN (
        '00000000000000', '11111111111111', '22222222222222', '33333333333333', '44444444444444',
        '55555555555555', '66666666666666', '77777777777777', '88888888888888', '99999999999999'
    ) THEN
        RETURN FALSE;
    END IF;

    -- 2. Destrincha o cnpj em um array
    FOR v_1 IN 1..14 LOOP
        v_cnpj_array := array_append(SUBSTRING(p_cnpj FROM v_i FOR 1)::INT);
    END LOOP;

    -- 3. Os dois últimos caracteres devem ser estritamente numéricos
    IF v_cnpj_array[13] ~ '[^0-9]' and v_cnpj_array[14] ~ '[^0-9]' THEN
        RETURN FALSE;
    END IF;

    -- 4. Cálculo do Primeiro Dígito Verificador
    v_sum := 0;
    FOR v_i IN 1..12 LOOP
        -- Regra Oficial: Código ASCII do caractere menos 48
        v_char_val := ASCII(v_cnpj_array[v_i]) - 48;
        v_sum := v_sum + (v_char_val * v_weights_1[v_i]);
    END LOOP;
    
    v_digit := 11 - (v_sum % 11);
    IF v_digit >= 10 THEN
        v_digit := 0;
    END IF;

    -- Valida se o primeiro dígito bate com a posição 13
    IF v_digit != v_cnpj_array[13] THEN
        RETURN FALSE;
    END IF;

    -- 5. Cálculo do Segundo Dígito Verificador
    v_sum := 0;
    FOR v_i IN 1..13 LOOP
        v_char_val := ASCII(v_cnpj_array[v_i]) - 48;
        v_sum := v_sum + (v_char_val * v_weights_2[v_i]);
    END LOOP;
    
    v_digit := 11 - (v_sum % 11);
    IF v_digit >= 10 THEN
        v_digit := 0;
    END IF;

    -- Valida se o segundo dígito bate com a posição 14
    IF v_digit != v_cnpj_array[14] THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;