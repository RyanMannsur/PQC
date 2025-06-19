# db.py
import psycopg2
from config import DB_CONFIG

def get_connection():
    """Retorna uma conexão com o banco de dados."""
    print(f"Tentando conectar ao banco de dados com as configurações: {DB_CONFIG}")
    return psycopg2.connect(**DB_CONFIG)
