from flask import Flask
from flask_cors import CORS
from routes.produto_routes import produto_bp
from Param import Param
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)

# buscando parametro em app.ini
cfg = Param()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], allow_headers=["Content-Type", "Authorization"])

app.config["DEBUG_MODE"] = cfg.getDebug()
portaBackend = cfg.getPortaBackend()
portaFrontend = cfg.getPortaFrontend()

# Executar migrações automaticamente na inicialização
try:
    import sys
    import os
    # Adicionar o diretório das migrações ao path
    migrations_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'migrations')
    sys.path.append(migrations_path)
    
    from auto_migrate import run_auto_migrations
    if run_auto_migrations():
        logging.info("Sistema de migrações inicializado com sucesso!")
    else:
        logging.error("Falha ao inicializar sistema de migrações!")
except Exception as e:
    logging.error(f"Erro ao executar migrações automáticas: {e}")

# Registrando as rotas
app.register_blueprint(produto_bp, url_prefix="/api")

if __name__ == "__main__":
 # Configurar o host como "0.0.0.0" para permitir acesso externo ao container
 app.run(host="0.0.0.0", port=8088, debug=True)
 