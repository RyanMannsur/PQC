# migrations/cli.py
import sys
import os

# Adicionar o diretório pai ao path para resolver imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import argparse
import logging
from migration_manager import MigrationManager

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler('migrations.log')
        ]
    )

def main():
    setup_logging()
    
    parser = argparse.ArgumentParser(description='Sistema de Migrações PQC')
    subparsers = parser.add_subparsers(dest='command', help='Comandos disponíveis')
    
    # Comando para executar migrações
    parser_run = subparsers.add_parser('run', help='Executa migrações pendentes')
    
    # Comando para criar nova migração
    parser_create = subparsers.add_parser('create', help='Cria nova migração')
    parser_create.add_argument('name', help='Nome da migração no formato: codigo_nomepessoa (ex: insert_joao)')
    parser_create.add_argument('--description', '-d', help='Descrição da migração')
    parser_create.add_argument('--author', '-a', help='Nome do autor (opcional, extraído do nome se não informado)')
    
    # Comando para ver status
    parser_status = subparsers.add_parser('status', help='Mostra status das migrações')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    manager = MigrationManager()
    
    try:
        if args.command == 'run':
            print("Executando migrações...")
            success = manager.run_migrations()
            if success:
                print("✓ Migrações executadas com sucesso!")
            else:
                print("✗ Erro ao executar migrações!")
                sys.exit(1)
                
        elif args.command == 'create':
            print(f"Criando nova migração: {args.name}")
            try:
                filepath = manager.create_migration(args.name, args.description, args.author)
                print(f"✓ Migração criada: {filepath}")
                print(f"  Formato: Numero_codigo_nomepessoa")
                print(f"  Códigos válidos: insert, delete, create, alter")
            except ValueError as e:
                print(f"✗ Erro no formato: {e}")
                print(f"  Exemplo correto: python -m migrations.cli create insert_joao --description 'Adiciona nova tabela'")
                sys.exit(1)
            
        elif args.command == 'status':
            print("Status das migrações:")
            status = manager.get_migration_status()
            print(f"✓ Aplicadas: {status['applied']}")
            print(f"⏳ Pendentes: {status['pending']}")
            
            if status['applied_list']:
                print("\nMigrações aplicadas:")
                for migration in status['applied_list']:
                    print(f"  - {migration}")
            
            if status['pending_list']:
                print("\nMigrações pendentes:")
                for migration in status['pending_list']:
                    print(f"  - {migration}")
                    
    except Exception as e:
        print(f"✗ Erro: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
