# app.py
from flask import Flask
from flask_cors import CORS
from routes.produto_routes import produto_bp

app = Flask(__name__)
CORS(app) 

# Registrando as rotas
app.register_blueprint(produto_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)