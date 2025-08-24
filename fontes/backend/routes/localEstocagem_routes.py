from flask import Blueprint, request
from db import Db, Mode
from valida import Valida
import util


localEstocagem_bp = Blueprint('localEstocagem_bp', __name__)

@localEstocagem_bp.route('/localEstocagem', methods=['GET'])
def listar_locais():
    sql = """
        SELECT codCampus,
               codUnidade,
               codPredio, 
               codLaboratorio,
               nomLocal,
               codCPFResponsavel
          FROM localEstocagem
         ORDER BY codCampus, nomLocal
    """

    db = Db()
    try:
        locaisEstocagem = db.execSql(sql, None, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    if not locaisEstocagem:
        return util.formataAviso("Local de Estocagem não encontrado")

    localEstocagem_formatado = []
    for localEstocagem in locaisEstocagem: 
        localEstocagem_formatado.append({
            "codCampus": localEstocagem[0],
            "codUnidade": localEstocagem[1],
            "codPredio": localEstocagem[2],
            "codLaboratorio": localEstocagem[3],
            "nomLocal": localEstocagem[4],
            "codCPFResponsavel": localEstocagem[5]
        })

    return localEstocagem_formatado

@localEstocagem_bp.route('/obterOutrosLocaisEstocagem/<codCampus>/<codUnidade>/<codPredio>/<codLaboratorio>', methods=['GET'])
def obterOutrosLocais(codCampus, codUnidade, codPredio, codLaboratorio):
    sql = """
        SELECT codCampus,
               codUnidade,
               codPredio, 
               codLaboratorio,
               nomLocal
          FROM localEstocagem  
         WHERE codCampus || codUnidade || codPredio || codLaboratorio not in 
              (SELECT codCampus || codUnidade || codPredio || codLaboratorio
                 FROM localEstocagem
                WHERE codCampus = %s
                  AND codUnidade = %s
                  AND codPredio = %s
                  AND codLaboratorio = %s)
        ORDER BY codCampus, nomLocal
    """
    params = (codCampus, codUnidade, codPredio, codLaboratorio)
    db = Db()
    try:
        locaisEstocagem = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    if not locaisEstocagem:
        return util.formataAviso("Local de Estocagem não encontrado")

    localEstocagem_formatado = []
    for localEstocagem in locaisEstocagem: 
        localEstocagem_formatado.append({
            "codCampus": localEstocagem[0],
            "codUnidade": localEstocagem[1],
            "codPredio": localEstocagem[2],
            "codLaboratorio": localEstocagem[3],
            "nomLocal": localEstocagem[4]
        })

    return localEstocagem_formatado

@localEstocagem_bp.route('/localEstocagem', methods=['POST'])
def cadastrar_local():
    data = request.get_json()
 
    codCampus = data.get('codCampus')
    codUnidade = data.get('codUnidade')
    codPredio = data.get('codPredio')
    codLaboratorio = data.get('codLaboratorio')
    nomLocal = data.get('nomLocal')
    codCPFResponsavel = data.get('codCPFResponsavel')
    
    valida = Valida()
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    valida.codPredio(codPredio)
    valida.codLaboratorio(codLaboratorio)
    valida.nomLocal(nomLocal)
    valida.codCPF(codCPFResponsavel)
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        INSERT INTO localEstocagem 
           (codCampus, codUnidade, codPredio, codLaboratorio, nomLocal, codCPFResponsavel)
             VALUES (%s, %s, %s, %s, %s, %s)
    """
    params = (codCampus, codUnidade, codPredio, codLaboratorio, nomLocal, codCPFResponsavel,)
    
    db = Db()
    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)

@localEstocagem_bp.route('/localEstocagem/<codCampus>/<codUnidade>/<codPredio>/<codLaboratorio>', methods=['PUT'])
def atualizar_local(codCampus, codUnidade, codPredio, codLaboratorio):
    data = request.get_json()
    nomLocal = data.get('nomLocal')
    codCPFResponsavel = data.get('codCPFResponsavel')
    
    valida = Valida()
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    valida.codPredio(codPredio)
    valida.codLaboratorio(codLaboratorio)
    valida.nomLocal(nomLocal)
    valida.codCPF(codCPFResponsavel)
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        UPDATE localEstocagem
           SET nomLocal = %s,
               codCPFResponsavel = %s
         WHERE codCampus = %s
           AND codUnidade = %s
           AND codPredio = %s
           AND codLaboratorio = %s
    """
    params = (nomLocal, codCPFResponsavel, codCampus, codUnidade, codPredio, codLaboratorio,)
    
    db = Db()
    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)


@localEstocagem_bp.route('/localEstocagem/<codCampus>/<codUnidade>/<codPredio>/<codLaboratorio>', methods=['DELETE'])
def excluir_local(codCampus, codUnidade, codPredio, codLaboratorio):
    valida = Valida()
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    valida.codPredio(codPredio)
    valida.codLaboratorio(codLaboratorio)
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        DELETE FROM localEstocagem
         WHERE codCampus = %s
           AND codUnidade = %s
           AND codPredio = %s 
           AND codLaboratorio = %s
    """
    params = (codCampus, codUnidade, codPredio, codLaboratorio,)

    db = Db()
    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)
