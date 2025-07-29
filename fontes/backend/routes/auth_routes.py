from flask import Blueprint, request, jsonify
from db import Db, Mode
from routes.produto_routes import validar_token, obter_laboratorios_usuario

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/auth/login", methods=["POST"])
def login():
    """Rota para autenticação de usuários."""
    data = request.get_json()
    if not data or 'cpf' not in data or 'senha' not in data:
        return jsonify({"error": "CPF e senha são obrigatórios"}), 400
    cpf = data['cpf']
    senha = data['senha']
    sql = """
        SELECT token, cpf, id, isADM 
        FROM usuario 
        WHERE cpf = %s AND senha = %s
    """
    params = (cpf, senha)
    try:
        db = Db()
        result = db.execSql(sql, params, Mode.SELECT)
        if not result:
            return jsonify({"error": "Credenciais inválidas"}), 401
        usuario = result[0]
        laboratorios = obter_laboratorios_usuario(usuario[0])
        return jsonify({
            "token": usuario[0],
            "cpf": usuario[1],
            "id": usuario[2],
            "isADM": usuario[3],
            "laboratorios": laboratorios
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/auth/validate", methods=["POST"])
def validate_token():
    """Rota para validar token."""
    data = request.get_json()
    if not data or 'token' not in data:
        return jsonify({"error": "Token é obrigatório"}), 400
    token = data['token']
    if not validar_token(token):
        return jsonify({"error": "Token inválido"}), 401
    sql = """
        SELECT token, cpf, id, isADM 
        FROM usuario 
        WHERE token = %s
    """
    params = (token,)
    try:
        db = Db()
        result = db.execSql(sql, params, Mode.SELECT)
        if not result:
            return jsonify({"error": "Token inválido"}), 401
        usuario = result[0]
        laboratorios = obter_laboratorios_usuario(token)
        return jsonify({
            "token": usuario[0],
            "cpf": usuario[1],
            "id": usuario[2],
            "isADM": usuario[3],
            "laboratorios": laboratorios
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
