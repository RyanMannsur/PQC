from flask import Blueprint, request
from db import Db, Mode
from valida import Valida
import util


campus_bp = Blueprint('campus_bp', __name__)

@campus_bp.route('/campus', methods=['GET'])
def listar_campus():
    db = Db()
   
    sql = """
           SELECT codCampus,
                  nomCampus
             FROM campus
            ORDER BY 2
    """
    try:
        campus = db.execSql(sql, None, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)
    
    if not campus:
        return util.formataAviso("Campus não encontrado")

    campus_formatado = []
    for campi in campus: 
        campus_formatado.append({
            "codCampus": campi[0],
            "nomCampus": campi[1]
        })

    return campus_formatado

@campus_bp.route('/campus', methods=['POST'])
def cadastrar_campus():
    data = request.get_json()

    codCampus = data.get('codCampus')
    nomCampus = data.get('nomCampus')
    
    valida = Valida()
    valida.codCampus(codCampus)
    valida.nomCampus(nomCampus)
    
    if valida.temMensagem():
        return valida.getMensagens()
    
    db = Db()
    
    sql = """
       INSERT INTO campus
         (codCampus, nomCampus) 
         VALUES (%s, %s)
    """
    params = (codCampus, nomCampus,)

    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)

@campus_bp.route('/campus/<codCampus>', methods=['PUT'])
def atualizar_campus(codCampus):
    data = request.get_json()
    #codCampus = data.get('codCampus')
    nomCampus = data.get('nomCampus')
    
    valida = Valida()
    valida.codCampus(codCampus)
    valida.nomCampus(nomCampus)
 
    if valida.temMensagem():
        return valida.getMensagens()
    
    sql = """
       UPDATE campus 
          SET nomCampus = %s
        WHERE codCampus = %s
    """
    params = (nomCampus, codCampus,)

    db = Db()
    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)

@campus_bp.route('/campus/<codCampus>', methods=['DELETE'])
def excluir_campus(codCampus):
    valida = Valida()
    valida.codCampus(codCampus)
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
       DELETE FROM campus
        WHERE codCampus = %s
    """
    params = (codCampus,)

    db = Db()
    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)


