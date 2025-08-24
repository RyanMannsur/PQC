from flask import Blueprint, request
from db import Db, Mode
from valida import Valida
import util

unidadeOrganizacional_bp = Blueprint('unidadeOrganizacional_bp', __name__)

@unidadeOrganizacional_bp.route('/unidadeOrganizacional', methods=['GET'])
def listar_unidades():  
    sql = """
        SELECT codCampus,
               codUnidade,
               sglUnidade,
               nomUnidade
          FROM unidadeOrganizacional
         ORDER BY codCampus, nomUnidade
    """

    db = Db()
    try:
        unidadesOrganizacionais = db.execSql(sql, None, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)
        
    if not unidadesOrganizacionais:
        return util.formataAviso("Unidade Organizacional não encontrada")

    unidadeOrganizacional_formatado = []
    for unidadeOrganizacional in unidadesOrganizacionais: 
        unidadeOrganizacional_formatado.append({
            "codCampus": unidadeOrganizacional[0],
            "codUnidade": unidadeOrganizacional[1],
            "sglUnidade": unidadeOrganizacional[2],
            "nomUnidade": unidadeOrganizacional[3],
        })

    return unidadeOrganizacional_formatado

    
@unidadeOrganizacional_bp.route('/obterUnidadePorCampus/<codCampus>', methods=['GET'])
def unidades_por_campus(codCampus):

    valida = Valida()
    valida.codCampus(codCampus)
    if valida.temMensagem():
        return valida.getMensagens()
   
    sql = """
        SELECT codCampus,
               codUnidade,
               sglUnidade,
               nomUnidade
          FROM unidadeOrganizacional
         WHERE codCampus = %s
         ORDER BY nomUnidade
    """
    params = (codCampus,)
    db = Db()
    try: 
        unidadesOrganizacionais =db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)
    
    if not unidadesOrganizacionais:
        return util.formataAviso(f"Unidade Organizacional não encontrada para o campus {codCampus}")

    unidadeOrganizacional_formatado = []
    for unidadeOrganizacional in unidadesOrganizacionais: 
        unidadeOrganizacional_formatado.append({
            "codCampus": unidadeOrganizacional[0],
            "codUnidade": unidadeOrganizacional[1],
            "sglUnidade": unidadeOrganizacional[2],
            "nomUnidade": unidadeOrganizacional[3],
        })

    return unidadeOrganizacional_formatado



@unidadeOrganizacional_bp.route('/unidadeOrganizacional', methods=['POST'])
def cadastrar_unidade():
    data = request.get_json()
    
    codCampus = data.get('codCampus')
    codUnidade = data.get('codUnidade')
    sglUnidade = data.get('sglUnidade')
    nomUnidade = data.get('nomUnidade')

    valida = Valida()
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    valida.sglUnidade(sglUnidade)
    valida.nomUnidade(nomUnidade)
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        INSERT INTO unidadeOrganizacional 
          (codCampus, codUnidade, sglUnidade, nomUnidade)
            VALUES (%s, %s, %s, %s)
    """
    params = (codCampus, codUnidade, sglUnidade, nomUnidade)

    db = Db()
    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)

@unidadeOrganizacional_bp.route('/unidadeOrganizacional/<codCampus>/<codUnidade>', methods=['PUT'])
def atualizar_unidade(codCampus, codUnidade):
    data = request.get_json()
    #codCampus = data.get('codCampus')
    #codUnidade = data.get('codUnidade')
    sglUnidade = data.get('sglUnidade')
    nomUnidade = data.get('nomUnidade')

    valida = Valida()
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    valida.sglUnidade(sglUnidade)
    valida.nomUnidade(nomUnidade)
    if valida.temMensagem():
        return valida.getMensagens()
    
    sql = """
        UPDATE unidadeOrganizacional 
           SET sglUnidade = %s,
               nomUnidade = %s
         WHERE codCampus = %s
           AND codUnidade = %s
    """
    params = (sglUnidade, nomUnidade, codCampus, codUnidade)

    db = Db()
    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)

@unidadeOrganizacional_bp.route('/unidadeOrganizacional/<codCampus>/<codUnidade>', methods=['DELETE'])
def excluir_unidade(codCampus, codUnidade):
    valida = Valida()
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
       DELETE FROM unidadeOrganizacional
        WHERE codCampus = %s
          AND codUnidade = %s
    """
    params = (codCampus, codUnidade)

    db = Db()
    try:
        return db.execSql(sql, params, Mode.COMMIT)
    except Exception as e:
        return db.getErro(e)
