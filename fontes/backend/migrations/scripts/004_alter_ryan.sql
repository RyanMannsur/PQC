-- Description: Adicionar coluna isADM para controle de acesso administrativo
-- Created: 2025-01-16 14:30:00
-- Migration: 004_alter_ryan.sql
-- Author: ryan
-- Type: ALTER

-- Adicionar coluna isADM à tabela usuario
ALTER TABLE usuario ADD COLUMN isADM BOOLEAN DEFAULT FALSE;

-- Atualizar o usuário 333.333.333-33 para ser administrador
UPDATE usuario SET isADM = TRUE WHERE cpf = '333.333.333-33';

-- Comentário na coluna
COMMENT ON COLUMN usuario.isADM IS 'Indica se o usuário tem privilégios de administrador';
