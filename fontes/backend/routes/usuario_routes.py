from flask import Blueprint, request, jsonify
from db import Db, Mode

usuarios_bp = Blueprint("usuarios_bp", __name__)

@usuarios_bp.route("/usuarios", methods=["GET"])
def listar_usuarios():
    db = Db()
    sql = "SELECT id, cpf, isADM FROM usuario"
    result = db.execSql(sql, None, Mode.SELECT)
    if not isinstance(result, list):
        return result
    usuarios = [
        {"id": r[0], "cpf": r[1], "isADM": r[2]} for r in result
    ]
    return usuarios

@usuarios_bp.route("/usuarios/<int:id>/adm", methods=["PUT"])
def transformar_usuario_adm(id):
    db = Db()
    sql = "UPDATE usuario SET isADM = TRUE WHERE id = %s"
    result = db.execSql(sql, (id,), Mode.DEFAULT)
    return result

@usuarios_bp.route("/usuarios/<int:id>/localestocagem", methods=["POST"])
def modificar_locais_usuario(id):
    data = request.get_json()
    if not data or 'codCampus' not in data or 'codUnidade' not in data or 'codPredio' not in data or 'codLaboratorio' not in data or 'action' not in data:
        return jsonify({"error": "Dados obrigatórios: codCampus, codUnidade, codPredio, codLaboratorio, action"}), 400
    codCampus = data['codCampus']
    codUnidade = data['codUnidade']
    codPredio = data['codPredio']
    codLaboratorio = data['codLaboratorio']
    action = data['action']
    try:
        db = Db()
        if action == 'add':
            sql = "INSERT INTO usuariolocalestocagem (idUsuario, codCampus, codUnidade, codPredio, codLaboratorio) VALUES (%s, %s, %s, %s, %s)"
            db.execSql(sql, (id, codCampus, codUnidade, codPredio, codLaboratorio), Mode.DEFAULT)
        elif action == 'remove':
            sql = "DELETE FROM usuariolocalestocagem WHERE idUsuario = %s AND codCampus = %s AND codUnidade = %s AND codPredio = %s AND codLaboratorio = %s"
            db.execSql(sql, (id, codCampus, codUnidade, codPredio, codLaboratorio), Mode.DEFAULT)
        else:
            return jsonify({"error": "Ação inválida"}), 400
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@usuarios_bp.route("/usuarios/<int:id>/localestocagem", methods=["GET"])
def listar_locais_usuario(id):
    try:
        db = Db()
        sql = """
            SELECT l.codCampus, l.codUnidade, l.codPredio, l.codLaboratorio, l.nomLocal
            FROM localestocagem l
            JOIN usuariolocalestocagem ul ON ul.codCampus = l.codCampus AND ul.codUnidade = l.codUnidade AND ul.codPredio = l.codPredio AND ul.codLaboratorio = l.codLaboratorio
            WHERE ul.idUsuario = %s
        """
        result = db.execSql(sql, (id,), Mode.SELECT)
        locais = [
            {
                "codCampus": r[0],
                "codUnidade": r[1],
                "codPredio": r[2],
                "codLaboratorio": r[3],
                "nomLocal": r[4]
            } for r in result
        ]
        return jsonify(locais), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
