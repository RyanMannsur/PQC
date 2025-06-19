import os
from db import get_connection  # Reutilizando a função de conexão do seu backend
import psycopg2
from psycopg2 import sql

def get_connection():
 """Função para obter a conexão com o banco de dados."""

 DATABASE_URL = os.getenv("DATABASE_URL")
 
 if not DATABASE_URL:
     raise Exception("A variável de ambiente DATABASE_URL não está definida.")


 return psycopg2.connect(DATABASE_URL)

def apply_migrations(migrations_folder):
 """
 Aplica migrações SQL pendentes em um banco de dados PostgreSQL.
 
 Args:
     migrations_folder (str): Caminho para a pasta contendo os scripts SQL de migração.
 """
 try:
     # Conectar ao banco de dados usando a função `get_connection`
     conn = get_connection()
     cursor = conn.cursor()

     # Criar a tabela de controle de migrações, se ainda não existir
     cursor.execute("""
         CREATE TABLE IF NOT EXISTS applied_migrations (
             id SERIAL PRIMARY KEY,
             filename TEXT NOT NULL UNIQUE,
             applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         )
     """)
     conn.commit()

     # Listar todos os arquivos de migração na pasta
     migrations = sorted(os.listdir(migrations_folder))

     for migration in migrations:
         # Verificar se a migração já foi aplicada
         cursor.execute("SELECT 1 FROM applied_migrations WHERE filename = %s", (migration,))
         if cursor.fetchone():
             print(f"[SKIP] Migração já aplicada: {migration}")
             continue

         # Ler o conteúdo do arquivo de migração
         with open(os.path.join(migrations_folder, migration), 'r') as f:
             sql_script = f.read()

         try:
             # Aplicar o script SQL
             print(f"[APPLYING] Aplicando migração: {migration}")
             cursor.execute(sql.SQL(sql_script))

             # Registrar a migração como aplicada
             cursor.execute("INSERT INTO applied_migrations (filename) VALUES (%s)", (migration,))
             conn.commit()
             print(f"[SUCCESS] Migração aplicada com sucesso: {migration}")

         except Exception as e:
             print(f"[ERROR] Erro ao aplicar migração {migration}: {e}")
             conn.rollback()
             break

     # Fechar a conexão com o banco de dados
     cursor.close()
     conn.close()

 except Exception as e:
     print(f"[ERROR] Não foi possível conectar ao banco de dados ou aplicar migrações: {e}")
