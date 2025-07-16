-- Migration: 001_create_usuario_system.sql
-- Descrição: Criação do sistema de usuários com token e associação com laboratórios

-- Criar tabela de usuários
DROP TABLE IF EXISTS usuario;

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(14) NOT NULL UNIQUE, 
    senha TEXT NOT NULL,             
    token TEXT NOT NULL DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- Remover coluna codsiaperesponsavel da tabela localestocagem se existir
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'localestocagem' AND column_name = 'codsiaperesponsavel'
    ) THEN
        ALTER TABLE localestocagem DROP COLUMN codsiaperesponsavel;
    END IF;
END $$;

-- Adicionar constraint unique no token
ALTER TABLE usuario ADD CONSTRAINT unique_token UNIQUE (token);

-- Criar tabela de associação usuário-laboratório
CREATE TABLE IF NOT EXISTS usuariolocalestocagem (
    token TEXT NOT NULL,
    codCampus CHAR(2) NOT NULL,
    codUnidade CHAR(8) NOT NULL,
    codPredio CHAR(2) NOT NULL, 
    codLaboratorio CHAR(3) NOT NULL,
    PRIMARY KEY (token, codCampus, codUnidade, codPredio, codLaboratorio),
    CONSTRAINT fk_usuario_token FOREIGN KEY (token) REFERENCES usuario (token) ON DELETE CASCADE,
    CONSTRAINT fk_localestocagem FOREIGN KEY (codCampus, codUnidade, codPredio, codLaboratorio)
        REFERENCES LocalEstocagem (codCampus, codUnidade, codPredio, codLaboratorio) ON DELETE CASCADE
);
