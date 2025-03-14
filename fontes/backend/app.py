from flask import Flask
from flask_cors import CORS
from routes.produto_routes import produto_bp

app = Flask(__name__)
CORS(app)

# Registrando as rotas
app.register_blueprint(produto_bp, url_prefix="/api")

if __name__ == "__main__":
 # Configurar o host como "0.0.0.0" para permitir acesso externo ao container
 app.run(host="0.0.0.0", port=5000, debug=True)