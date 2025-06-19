from flask import Flask
from flask_cors import CORS
from routes.produto_routes import produto_bp
from apply_migrations import apply_migrations 

app = Flask(__name__)
CORS(app)

# Registrando as rotas
app.register_blueprint(produto_bp, url_prefix="/api")

if __name__ == "__main__":
 MIGRATIONS_FOLDER = "./migrations"

 # Aplicar as migrações antes de iniciar o servidor
 print("Aplicando migrações...")
 apply_migrations(MIGRATIONS_FOLDER)
 print("Migrações concluídas!")

   # Configurar o host como "0.0.0.0" para permitir acesso externo ao container
 app.run(host="0.0.0.0", port=8088, debug=True)
