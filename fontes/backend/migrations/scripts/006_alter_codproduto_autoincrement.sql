
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'produto_codproduto_seq') THEN
        CREATE SEQUENCE produto_codproduto_seq;
    END IF;
END$$;

ALTER TABLE "produto"
    ALTER COLUMN "codproduto" SET DEFAULT nextval('produto_codproduto_seq'),
    ALTER COLUMN "codproduto" SET NOT NULL;


DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'produto' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE "produto" ADD PRIMARY KEY ("codproduto");
    END IF;
END$$;

SELECT setval('produto_codproduto_seq', COALESCE((SELECT MAX("codproduto") FROM "produto"), 1));
