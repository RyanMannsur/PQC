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

@campus_bp.route('/unidadeorganizacional', methods=['GET'])
def listar_unidades():
    db = Db()
    sql = 'SELECT codcampus, codunidade, sglunidade, nomunidade FROM unidadeorganizacional'
    result = db.execSql(sql, None, Mode.SELECT)
    return result

@campus_bp.route('/unidadeorganizacional', methods=['POST'])
def cadastrar_unidade():
    data = request.get_json()
    db = Db()
    sql = 'INSERT INTO unidadeorganizacional (codcampus, codunidade, sglunidade, nomunidade) VALUES (%s, %s, %s, %s)'
    params = (data['codcampus'], data['codunidade'], data['sglunidade'], data['nomunidade'])
    result = db.execSql(sql, params, Mode.COMMIT)
    return result

@campus_bp.route('/unidadeorganizacional/<codunidade>', methods=['PUT'])
def atualizar_unidade(codunidade):
    data = request.get_json()
    db = Db()
    sql = 'UPDATE unidadeorganizacional SET codcampus=%s, sglunidade=%s, nomunidade=%s WHERE codunidade=%s'
    params = (data['codcampus'], data['sglunidade'], data['nomunidade'], codunidade)
    result = db.execSql(sql, params, Mode.COMMIT)
    return result

@campus_bp.route('/unidadeorganizacional/<codunidade>', methods=['DELETE'])
def excluir_unidade(codunidade):
    db = Db()
    sql = 'DELETE FROM unidadeorganizacional WHERE codunidade=%s'
    params = (codunidade,)
    result = db.execSql(sql, params, Mode.COMMIT)
    return result

@campus_bp.route('/localestocagem', methods=['GET'])
def listar_locais():
    db = Db()
    sql = 'SELECT codcampus, codunidade, codpredio, codlaboratorio, nomlocal FROM localestocagem'
    result = db.execSql(sql, None, Mode.SELECT)
    return result

@campus_bp.route('/localestocagem', methods=['POST'])
def cadastrar_local():
    data = request.get_json()
    db = Db()
    sql = 'INSERT INTO localestocagem (codcampus, codunidade, codpredio, codlaboratorio, nomlocal) VALUES (%s, %s, %s, %s, %s)'
    params = (data['codcampus'], data['codunidade'], data['codpredio'], data['codlaboratorio'], data['nomlocal'])
    result = db.execSql(sql, params, Mode.COMMIT)
    return result

@campus_bp.route('/localestocagem/<codcampus>/<codunidade>/<codpredio>/<codlaboratorio>', methods=['PUT'])
def atualizar_local(codcampus, codunidade, codpredio, codlaboratorio):
    data = request.get_json()
    db = Db()
    sql = '''
        UPDATE localestocagem
        SET codcampus=%s, codunidade=%s, codpredio=%s, nomlocal=%s
        WHERE codcampus=%s AND codunidade=%s AND codpredio=%s AND codlaboratorio=%s
    '''
    params = (
        data['codcampus'], data['codunidade'], data['codpredio'], data['nomlocal'],
        codcampus, codunidade, codpredio, codlaboratorio
    )
    result = db.execSql(sql, params, Mode.COMMIT)
    return result

@campus_bp.route('/localestocagem/<codcampus>/<codunidade>/<codpredio>/<codlaboratorio>', methods=['DELETE'])
def excluir_local(codcampus, codunidade, codpredio, codlaboratorio):
    db = Db()
    sql = '''
        DELETE FROM localestocagem
        WHERE codcampus=%s AND codunidade=%s AND codpredio=%s AND codlaboratorio=%s
    '''
    params = (codcampus, codunidade, codpredio, codlaboratorio)
    result = db.execSql(sql, params, Mode.COMMIT)
    return result

@campus_bp.route('/api/unidadeorganizacional/campus/<codcampus>', methods=['GET'])
def unidades_por_campus(codcampus):
    db = Db()
    sql = 'SELECT codunidade, nomunidade, codcampus FROM unidadeorganizacional WHERE codcampus = %s'
    result = db.execSql(sql, (codcampus,), Mode.SELECT)
    return result