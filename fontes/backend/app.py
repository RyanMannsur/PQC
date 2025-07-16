from flask import Flask
from flask_cors import CORS
from routes.produto_routes import produto_bp
from Param import Param

# buscando parametro em app.ini
cfg = Param()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

app.config["DEBUG_MODE"] = cfg.getDebug()
portaBackend = cfg.getPortaBackend()
portaFrontend = cfg.getPortaFrontend()


# Registrando as rotas
app.register_blueprint(produto_bp, url_prefix="/api")

if __name__ == "__main__":
 # Configurar o host como "0.0.0.0" para permitir acesso externo ao container
 app.run(host="0.0.0.0", port=8088, debug=True)
 