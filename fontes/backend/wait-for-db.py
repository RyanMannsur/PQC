#!/usr/bin/env python3
import time
import psycopg2
import os
import sys

def wait_for_db():
    db_config = {
        "dbname": os.getenv("DB_NAME", "PQC"), 
        "user": os.getenv("DB_USER", "postgres"),
        "password": os.getenv("DB_PASSWORD", "postgres"),
        "host": os.getenv("DB_HOST", "localhost"),
        "port": os.getenv("DB_PORT", "5432")
    }
    
    max_retries = 30
    retry_count = 0
    
    print("Aguardando conexão com o banco de dados...")
    
    while retry_count < max_retries:
        try:
            conn = psycopg2.connect(**db_config)
            conn.close()
            print("Banco de dados está disponível!")
            return True
        except psycopg2.OperationalError:
            retry_count += 1
            print(f"Tentativa {retry_count}/{max_retries} - Banco ainda não disponível...")
            time.sleep(2)
    
    print("Erro: Não foi possível conectar ao banco de dados após 30 tentativas")
    return False

if __name__ == "__main__":
    if wait_for_db():
        sys.exit(0)
    else:
        sys.exit(1)
