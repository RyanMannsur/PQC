from flask import Blueprint, request
from db import Db, Mode
from valida import Valida
import util


orgaoControle_bp = Blueprint('orgaoControle_bp', __name__)

@orgaoControle_bp.route('/orgaoControle', methods=['GET'])
def listar_orgaoControle():
    sql = """
        SELECT codOrgaoControle,
               nomOrgaoControle
          FROM orgaoControle
        ORDER BY nomOrgaoControle
    """

    db = Db()
    try:
        orgaosControle = db.execSql(sql, None, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)
    
    
    if not orgaosControle:
        return util.formataAviso("Orgão de Controle não encontrado")

    orgaoControle_formatado = []
    for orgaoControle in orgaosControle: 
        orgaoControle_formatado.append({
            "codOrgaoControle": orgaoControle[0],
            "nomOrgaoControle": orgaoControle[1],
        })

    return orgaoControle_formatado

@orgaoControle_bp.route('/orgaoControle', methods=['POST'])
def cadastrar_orgaoControle():
    data = request.get_json()
 
    nomOrgaoControle = data.get('nomOrgaoControle')
       
    valida = Valida()
    valida.nomOrgaoControle(nomOrgaoControle)
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        INSERT INTO orgaoControle 
           (nomOrgaoControle)
             VALUES (%s)
    """
    params = (nomOrgaoControle,)
    
    db = Db()
    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)

@orgaoControle_bp.route('/orgaoControle/<int:codOrgaoControle>', methods=['PUT'])
def atualizar_orgaoControle(codOrgaoControle):
    data = request.get_json()
    nomOrgaoControle = data.get('nomOrgaoControle')
        
    valida = Valida()
    valida.codOrgaoControle(codOrgaoControle)
    valida.nomOrgaoControle(nomOrgaoControle)
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        UPDATE orgaoControle
           SET nomOrgaoControle = %s
         WHERE codOrgaoControle = %s
    """
    params = (nomOrgaoControle, codOrgaoControle,)
    
    db = Db()
    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)


@orgaoControle_bp.route('/orgaoControle/<int:codOrgaoControle>', methods=['DELETE'])
def excluir_oegaoControle(codOrgaoControle):
    valida = Valida()
    valida.codOrgaoControle(codOrgaoControle)
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        DELETE FROM OrgaoControle
         WHERE codOrgaoControle = %s
    """
    params = (codOrgaoControle,)

    db = Db()
    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)


