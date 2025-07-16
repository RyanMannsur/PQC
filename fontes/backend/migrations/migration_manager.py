# migrations/migration_manager.py
import os
import logging
import psycopg2
from datetime import datetime
import sys

# Adicionar o diretório pai ao path para resolver imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import DB_CONFIG

class MigrationManager:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.migrations_folder = os.path.join(os.path.dirname(__file__), 'scripts')
        
    def get_connection(self):
        """Cria uma conexão com o banco de dados usando as configurações do projeto."""
        try:
            conn = psycopg2.connect(**DB_CONFIG)
            return conn
        except Exception as e:
            self.logger.error(f"Erro ao conectar no banco de dados: {e}")
            raise
    
    def create_migrations_table(self):
        """Cria a tabela de controle de migrações se não existir."""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS applied_migrations (
                    id SERIAL PRIMARY KEY,
                    filename VARCHAR(255) NOT NULL UNIQUE,
                    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    checksum VARCHAR(64),
                    description TEXT
                );
            """)
            
            conn.commit()
            cursor.close()
            conn.close()
            
        except Exception as e:
            self.logger.error(f"Erro ao criar tabela de migrações: {e}")
            raise
    
    def get_applied_migrations(self):
        """Retorna lista de migrações já aplicadas."""
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("SELECT filename FROM applied_migrations ORDER BY filename")
            applied = [row[0] for row in cursor.fetchall()]
            
            cursor.close()
            conn.close()
            
            return applied
            
        except Exception as e:
            self.logger.error(f"Erro ao buscar migrações aplicadas: {e}")
            raise
    
    def get_pending_migrations(self):
        """Retorna lista de migrações pendentes."""
        try:
            # Verificar se a pasta de migrações existe
            if not os.path.exists(self.migrations_folder):
                self.logger.warning(f"Pasta de migrações não encontrada: {self.migrations_folder}")
                return []
            
            # Listar todos os arquivos .sql na pasta
            all_migrations = [f for f in os.listdir(self.migrations_folder) 
                            if f.endswith('.sql')]
            all_migrations.sort()
            
            # Obter migrações já aplicadas
            applied_migrations = self.get_applied_migrations()
            
            # Retornar apenas as pendentes
            pending = [m for m in all_migrations if m not in applied_migrations]
            
            return pending
            
        except Exception as e:
            self.logger.error(f"Erro ao buscar migrações pendentes: {e}")
            raise
    
    def calculate_checksum(self, content):
        """Calcula checksum MD5 do conteúdo da migração."""
        import hashlib
        return hashlib.md5(content.encode('utf-8')).hexdigest()
    
    def extract_description(self, content):
        """Extrai descrição da migração do comentário inicial."""
        lines = content.strip().split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith('-- Description:'):
                return line.replace('-- Description:', '').strip()
        return "Sem descrição"
    
    def apply_migration(self, migration_file):
        """Aplica uma migração específica."""
        migration_path = os.path.join(self.migrations_folder, migration_file)
        
        try:
            # Ler o conteúdo da migração
            with open(migration_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if not content.strip():
                self.logger.warning(f"Migração vazia ignorada: {migration_file}")
                return True
            
            # Calcular checksum e extrair descrição
            checksum = self.calculate_checksum(content)
            description = self.extract_description(content)
            
            conn = self.get_connection()
            cursor = conn.cursor()
            
            try:
                # Iniciar transação
                conn.autocommit = False
                
                # Aplicar o script SQL
                self.logger.info(f"Aplicando migração: {migration_file}")
                cursor.execute(content)
                
                # Registrar a migração como aplicada
                cursor.execute("""
                    INSERT INTO applied_migrations (filename, checksum, description) 
                    VALUES (%s, %s, %s)
                """, (migration_file, checksum, description))
                
                # Confirmar transação
                conn.commit()
                self.logger.info(f"Migração aplicada com sucesso: {migration_file}")
                
                return True
                
            except Exception as e:
                conn.rollback()
                self.logger.error(f"Erro ao aplicar migração {migration_file}: {e}")
                raise
                
            finally:
                cursor.close()
                conn.close()
                
        except Exception as e:
            self.logger.error(f"Erro ao processar migração {migration_file}: {e}")
            raise
    
    def run_migrations(self):
        """Executa todas as migrações pendentes."""
        try:
            self.logger.info("Iniciando processo de migrações...")
            
            # Criar tabela de controle
            self.create_migrations_table()
            
            # Obter migrações pendentes
            pending_migrations = self.get_pending_migrations()
            
            if not pending_migrations:
                self.logger.info("Nenhuma migração pendente encontrada.")
                return True
            
            self.logger.info(f"Encontradas {len(pending_migrations)} migrações pendentes.")
            
            # Aplicar cada migração
            for migration in pending_migrations:
                self.apply_migration(migration)
            
            self.logger.info("Todas as migrações foram aplicadas com sucesso!")
            return True
            
        except Exception as e:
            self.logger.error(f"Erro durante execução das migrações: {e}")
            return False
    
    def create_migration(self, name, description="", author=""):
        """Cria um novo arquivo de migração."""
        try:
            # Obter próximo número sequencial
            next_number = self.get_next_migration_number()
            
            # Validar formato do nome (deve ser codigo_nomepessoa)
            if '_' not in name:
                raise ValueError("Nome deve seguir o padrão: codigo_nomepessoa (ex: insert_joao, create_maria)")
            
            parts = name.split('_', 1)
            if len(parts) != 2:
                raise ValueError("Nome deve seguir o padrão: codigo_nomepessoa (ex: insert_joao, create_maria)")
            
            codigo, nome_pessoa = parts
            
            # Validar código
            codigos_validos = ['insert', 'delete', 'create', 'alter']
            if codigo.lower() not in codigos_validos:
                raise ValueError(f"Código deve ser um dos seguintes: {', '.join(codigos_validos)}")
            
            # Criar nome do arquivo seguindo o padrão: Numero_codigo_nomepessoa
            filename = f"{next_number:03d}_{codigo.lower()}_{nome_pessoa.lower()}.sql"
            filepath = os.path.join(self.migrations_folder, filename)
            
            # Criar pasta se não existir
            os.makedirs(self.migrations_folder, exist_ok=True)
            
            # Conteúdo template
            template = f"""-- Description: {description or name}
-- Created: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
-- Migration: {filename}
-- Author: {nome_pessoa}
-- Type: {codigo.upper()}

-- Escreva seu script SQL abaixo:

"""
            
            # Criar arquivo
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(template)
            
            self.logger.info(f"Nova migração criada: {filename}")
            print(f"Nova migração criada: {filepath}")
            
            return filepath
            
        except Exception as e:
            self.logger.error(f"Erro ao criar migração: {e}")
            raise
    
    def get_next_migration_number(self):
        """Retorna o próximo número sequencial para migração."""
        try:
            # Verificar se a pasta de migrações existe
            if not os.path.exists(self.migrations_folder):
                return 1
            
            # Listar todos os arquivos .sql na pasta
            migrations = [f for f in os.listdir(self.migrations_folder) 
                         if f.endswith('.sql')]
            
            if not migrations:
                return 1
            
            # Extrair números das migrações existentes
            numbers = []
            for migration in migrations:
                try:
                    # Assumir que o nome começa com número seguido de underscore
                    parts = migration.split('_', 1)
                    if len(parts) >= 1:
                        number = int(parts[0])
                        numbers.append(number)
                except (ValueError, IndexError):
                    # Se não conseguir extrair número, ignorar
                    continue
            
            # Retornar próximo número
            if numbers:
                return max(numbers) + 1
            else:
                return 1
                
        except Exception as e:
            self.logger.error(f"Erro ao obter próximo número: {e}")
            return 1
    
    def get_migration_status(self):
        """Retorna status das migrações."""
        try:
            self.create_migrations_table()
            
            applied = self.get_applied_migrations()
            pending = self.get_pending_migrations()
            
            return {
                "applied": len(applied),
                "pending": len(pending),
                "applied_list": applied,
                "pending_list": pending
            }
            
        except Exception as e:
            self.logger.error(f"Erro ao obter status das migrações: {e}")
            raise
