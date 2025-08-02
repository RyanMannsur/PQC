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
    codcampus_padded = codcampus if len(codcampus) == 2 else codcampus.ljust(2)
    sql = 'UPDATE campus SET nomcampus=%s WHERE codcampus=%s'
    params = (data['nomcampus'], codcampus_padded)
    result = db.execSql(sql, params, Mode.COMMIT)
    return result

@campus_bp.route('/campus/<codcampus>', methods=['DELETE'])
def excluir_campus(codcampus):
    db = Db()
    codcampus_padded = codcampus if len(codcampus) == 2 else codcampus.ljust(2)
    sql = 'DELETE FROM campus WHERE codcampus=%s'
    params = (codcampus_padded,)
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
    print(f"[DEBUG] INSERT unidadeorganizacional params: {params}")
    print(f"[DEBUG] SQL: {sql}")
    result = db.execSql(sql, params, Mode.COMMIT)
    return result

@campus_bp.route('/unidadeorganizacional/<codcampus>/<codunidade>', methods=['PUT'])
def atualizar_unidade(codcampus, codunidade):
    data = request.get_json()
    db = Db()
    codcampus_padded = data['codcampus'] if len(data['codcampus']) == 2 else data['codcampus'].ljust(2)
    codunidade_padded = data['codunidade'] if len(data['codunidade']) == 8 else data['codunidade'].ljust(8)
    sql = 'UPDATE unidadeorganizacional SET codcampus=%s, sglunidade=%s, nomunidade=%s WHERE codcampus=%s AND codunidade=%s'
    params = (codcampus_padded, data['sglunidade'], data['nomunidade'], codcampus_padded, codunidade_padded)
    result = db.execSql(sql, params, Mode.COMMIT)
    return result

@campus_bp.route('/unidadeorganizacional/<codcampus>/<codunidade>', methods=['DELETE'])
def excluir_unidade(codcampus, codunidade):
    db = Db()
    codcampus_padded = codcampus if len(codcampus) == 2 else codcampus.ljust(2)
    codunidade_padded = codunidade if len(codunidade) == 8 else codunidade.ljust(8)
    sql = 'DELETE FROM unidadeorganizacional WHERE codcampus=%s AND codunidade=%s'
    params = (codcampus_padded, codunidade_padded)
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
    codcampus_padded = codcampus if len(codcampus) == 2 else codcampus.ljust(2)
    codunidade_padded = codunidade if len(codunidade) == 8 else codunidade.ljust(8)
    codpredio_padded = codpredio if len(codpredio) == 2 else codpredio.ljust(2)
    codlaboratorio_padded = codlaboratorio if len(codlaboratorio) == 3 else codlaboratorio.ljust(3)
    sql = '''
        UPDATE localestocagem
        SET codcampus=%s, codunidade=%s, codpredio=%s, nomlocal=%s
        WHERE codcampus=%s AND codunidade=%s AND codpredio=%s AND codlaboratorio=%s
    '''
    params = (
        data['codcampus'], data['codunidade'], data['codpredio'], data['nomlocal'],
        codcampus_padded, codunidade_padded, codpredio_padded, codlaboratorio_padded
    )
    result = db.execSql(sql, params, Mode.COMMIT)
    return result

@campus_bp.route('/localestocagem/<codcampus>/<codunidade>/<codpredio>/<codlaboratorio>', methods=['DELETE'])
def excluir_local(codcampus, codunidade, codpredio, codlaboratorio):
    db = Db()
    codcampus_padded = codcampus if len(codcampus) == 2 else codcampus.ljust(2)
    codunidade_padded = codunidade if len(codunidade) == 8 else codunidade.ljust(8)
    codpredio_padded = codpredio if len(codpredio) == 2 else codpredio.ljust(2)
    codlaboratorio_padded = codlaboratorio if len(codlaboratorio) == 3 else codlaboratorio.ljust(3)
    sql = '''
        DELETE FROM localestocagem
        WHERE codcampus=%s AND codunidade=%s AND codpredio=%s AND codlaboratorio=%s
    '''
    params = (codcampus_padded, codunidade_padded, codpredio_padded, codlaboratorio_padded)
    result = db.execSql(sql, params, Mode.COMMIT)
    return result

@campus_bp.route('/api/unidadeorganizacional/campus/<codcampus>', methods=['GET'])
def unidades_por_campus(codcampus):
    db = Db()
    codcampus_padded = codcampus if len(codcampus) == 2 else codcampus.ljust(2)
    sql = 'SELECT codunidade, nomunidade, codcampus FROM unidadeorganizacional WHERE codcampus = %s'
    result = db.execSql(sql, (codcampus_padded,), Mode.SELECT)
    return result