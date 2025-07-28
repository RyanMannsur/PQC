-- Migration: Adiciona coluna ncm na tabela Produto
ALTER TABLE Produto
ADD COLUMN ncm VARCHAR(8) NULL;
