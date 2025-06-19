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
