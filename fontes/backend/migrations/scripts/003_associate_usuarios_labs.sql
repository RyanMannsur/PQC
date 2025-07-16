-- Migration: 003_associate_usuarios_labs.sql
-- Descrição: Associação de usuários com laboratórios

-- Associar usuários com laboratórios
DO $$
DECLARE
    token_usuario_1 TEXT;
    token_usuario_2 TEXT;
BEGIN
    -- Buscar token do primeiro usuário
    SELECT token INTO token_usuario_1
    FROM usuario
    WHERE cpf = '123.456.789-01';

    -- Buscar token do usuário administrador
    SELECT token INTO token_usuario_2
    FROM usuario
    WHERE cpf = '333.333.333-33';

    -- Verificar se os tokens foram encontrados
    IF token_usuario_1 IS NULL THEN
        RAISE EXCEPTION 'Token não encontrado para o CPF 123.456.789-01';
    END IF;

    IF token_usuario_2 IS NULL THEN
        RAISE EXCEPTION 'Token não encontrado para o CPF 333.333.333-33';
    END IF;

    -- Associar usuário 1 com laboratórios específicos
    INSERT INTO usuariolocalestocagem (token, codCampus, codUnidade, codPredio, codLaboratorio)
    VALUES
    (token_usuario_1, 'NG', '11.56.12', '17', '101'), 
    (token_usuario_1, 'NS', '11.55.11', '01', '001'); 

    -- Associar usuário administrador com todos os laboratórios
    INSERT INTO usuariolocalestocagem (token, codCampus, codUnidade, codPredio, codLaboratorio)
    SELECT token_usuario_2, codCampus, codUnidade, codPredio, codLaboratorio
    FROM localestocagem;
END $$;
