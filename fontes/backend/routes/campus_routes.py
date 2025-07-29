from flask import Blueprint, request, jsonify
from db import Db, Mode

campus_bp = Blueprint('campus_bp', __name__)

@campus_bp.route('/campus', methods=['GET'])
def listar_campus():
    db = Db()
    sql = 'SELECT codcampus, nomcampus FROM campus'
    result = db.execSql(sql, None, Mode.SELECT)
    return result

@campus_bp.route('/campus', methods=['POST'])
def cadastrar_campus():
    data = request.get_json()
    db = Db()
    sql = 'INSERT INTO campus (codcampus, nomcampus) VALUES (%s, %s)'
    params = (data['codcampus'], data['nomcampus'])
    result = db.execSql(sql, params, Mode.COMMIT)
    return result

@campus_bp.route('/campus/<codcampus>', methods=['PUT'])
def atualizar_campus(codcampus):
    data = request.get_json()
    db = Db()
    sql = 'UPDATE campus SET nomcampus=%s WHERE codcampus=%s'
    params = (data['nomcampus'], codcampus)
    result = db.execSql(sql, params, Mode.COMMIT)
    return result

@campus_bp.route('/campus/<codcampus>', methods=['DELETE'])
def excluir_campus(codcampus):
    db = Db()
    sql = 'DELETE FROM campus WHERE codcampus=%s'
    params = (codcampus,)
    result = db.execSql(sql, params, Mode.COMMIT)
    return result
