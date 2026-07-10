CREATE OR REPLACE FUNCTION requesters.is_valid_cnpj(p_cnpj TEXT) 
RETURNS BOOLEAN AS $$
DECLARE
    v_sum INT;
    v_digit INT;
    v_i INT;
    v_char_val INT;
    v_cnpj_array TEXT[14];
    -- Pesos oficiais para o primeiro e segundo dígito verificador
    v_weights_1 INT[] := ARRAY[5,4,3,2,9,8,7,6,5,4,3,2];
    v_weights_2 INT[] := ARRAY[6,5,4,3,2,9,8,7,6,5,4,3,2];
BEGIN

    -- Verifica se:
    -- os primeiros 12 digitos contem somente números (0-9) e/ou letras maiusculas (A-Z);
    -- os ultimos 2 digitos são estritamente numericos (0-9);
    -- Se possui exatamente 14 digitos.
    IF NOT p_cnpj ~ '^[0-9A-Z]{12}[0-9]{2}$' THEN
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
    SELECT ARRAY(SELECT REGEXP_SPLIT_TO_TABLE(p_cnpj, '')::TEXT) INTO v_cnpj_array;

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
    IF v_digit != v_cnpj_array[13]::SMALLINT THEN
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
    IF v_digit != v_cnpj_array[14]::SMALLINT THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;