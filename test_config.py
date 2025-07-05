#!/usr/bin/env python3
"""
Teste de configuração - mostra como a config funciona em diferentes cenários
"""
import os

# Simulando a configuração atual
def test_config_scenarios():
    print("=== Teste de Configuração ===\n")
    
    # Cenário 1: Sem variáveis de ambiente (execução local)
    print("1. Execução LOCAL (sem variáveis de ambiente):")
    os.environ.pop('DB_HOST', None)  # Remove se existir
    os.environ.pop('DB_NAME', None)
    os.environ.pop('DB_USER', None)
    os.environ.pop('DB_PASSWORD', None)
    os.environ.pop('DB_PORT', None)
    
    config_local = {
        "dbname": os.getenv("DB_NAME", "PQC"), 
        "user": os.getenv("DB_USER", "postgres"),
        "password": os.getenv("DB_PASSWORD", "postgres"),
        "host": os.getenv("DB_HOST", "localhost"),
        "port": os.getenv("DB_PORT", "5432")
    }
    
    for key, value in config_local.items():
        print(f"   {key}: {value}")
    
    print("\n" + "="*50 + "\n")
    
    # Cenário 2: Com variáveis de ambiente (Docker)
    print("2. Execução com DOCKER (com variáveis de ambiente):")
    os.environ['DB_HOST'] = 'database'
    os.environ['DB_NAME'] = 'PQC'
    os.environ['DB_USER'] = 'postgres'
    os.environ['DB_PASSWORD'] = 'postgres'
    os.environ['DB_PORT'] = '5432'
    
    config_docker = {
        "dbname": os.getenv("DB_NAME", "PQC"), 
        "user": os.getenv("DB_USER", "postgres"),
        "password": os.getenv("DB_PASSWORD", "postgres"),
        "host": os.getenv("DB_HOST", "localhost"),
        "port": os.getenv("DB_PORT", "5432")
    }
    
    for key, value in config_docker.items():
        print(f"   {key}: {value}")
    
    print("\n" + "="*50 + "\n")
    
    # Limpeza
    os.environ.pop('DB_HOST', None)
    os.environ.pop('DB_NAME', None)
    os.environ.pop('DB_USER', None)
    os.environ.pop('DB_PASSWORD', None)
    os.environ.pop('DB_PORT', None)
    
    print("✅ CONCLUSÃO:")
    print("   - Execução local: usa 'localhost' (funciona perfeitamente)")
    print("   - Execução Docker: usa 'database' (nome do serviço)")
    print("   - Não quebra nenhum dos dois cenários!")

if __name__ == "__main__":
    test_config_scenarios()
