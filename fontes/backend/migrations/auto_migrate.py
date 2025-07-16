# migrations/auto_migrate.py
import logging
import sys
import os

# Adicionar o diretório atual ao path para resolver imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from migration_manager import MigrationManager

def run_auto_migrations():
    """
    Executa migrações automaticamente na inicialização da aplicação.
    Retorna True se todas as migrações foram aplicadas com sucesso.
    """
    try:
        logging.info("Verificando migrações pendentes...")
        
        manager = MigrationManager()
        
        # Verificar se há migrações pendentes
        pending = manager.get_pending_migrations()
        
        if not pending:
            logging.info("Nenhuma migração pendente encontrada.")
            return True
        
        logging.info(f"Encontradas {len(pending)} migrações pendentes. Aplicando...")
        
        # Executar migrações
        success = manager.run_migrations()
        
        if success:
            logging.info("Todas as migrações foram aplicadas com sucesso!")
            return True
        else:
            logging.error("Falha ao aplicar migrações!")
            return False
            
    except Exception as e:
        logging.error(f"Erro durante execução automática das migrações: {e}")
        return False

def check_migration_status():
    """
    Verifica o status das migrações sem executá-las.
    """
    try:
        manager = MigrationManager()
        return manager.get_migration_status()
    except Exception as e:
        logging.error(f"Erro ao verificar status das migrações: {e}")
        return None
