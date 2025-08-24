from flask import Blueprint, request, jsonify
from db import Db, Mode
from valida import Valida
import util

usuarios_bp = Blueprint("usuarios_bp", __name__)

@usuarios_bp.route("/usuarios/<codCPF>/localestocagem/disponiveis", methods=["GET"])
def listar_locais_disponiveis_usuario(codCPF):
    try:
        db = Db()
        sql = """
            SELECT codCampus, 
                   codUnidade,
                   codPredio,
                   codLaboratorio, 
                   nomLocal
              FROM localestocagem 
             WHERE codCPFResponsavel != %s
        """
        params = (codCPF,)
        result = db.execSql(sql, params, Mode.SELECT)
        locais = [
            {
                "codCampus": r[0],
                "codUnidade": r[1],
                "codPredio": r[2],
                "codLaboratorio": r[3],
                "nomLocal": r[4],
                "chave": f"{r[0]}-{r[1]}-{r[2]}-{r[3]}"
            } for r in result
        ]
        return jsonify(locais), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@usuarios_bp.route('/usuario', methods=['GET'])
def listar_usuario():
    sql = """
        SELECT codCPF,
               nomUsuario,
               idtTipoUsuario
          FROM Usuario
         ORDER BY 2
    """

    db = Db()
    try:
        usuarios = db.execSql(sql, None, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    if not usuarios:
        return util.formataAviso("Usuarios não encontrado")

    usuario_formatado = []
    for usuario in usuarios: 
        usuario_formatado.append({
            "codCPF": usuario[0],
            "nomUsuario": usuario[1],
            "idtTipoUsuario": usuario[2],
        })

    return usuario_formatado

@usuarios_bp.route('/obterResponsaveis', methods=['GET'])
def obter_usuariosResponsaveis():
    sql = """
        SELECT codCPF,
               nomUsuario,
               idtTipoUsuario
          FROM Usuario
         ORDER BY nomUsuario
    """

    db = Db()
    try:
        usuarios = db.execSql(sql, None, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    if not usuarios:
        return util.formataAviso("Usuarios não encontrado")

    usuario_formatado = []
    for usuario in usuarios: 
        usuario_formatado.append({
            "codCPFResponsavel": usuario[0],
            "nomUsuario": usuario[1],
            "idtTipoUsuario": usuario[2],
        })

    return usuario_formatado


@usuarios_bp.route('/usuario', methods=['POST'])
def cadastrar_usuario():
    data = request.get_json()
 
    codCPF = data.get('codCPF')
    nomUsuario = data.get('nomUsuario')
    idtTipoUsuario = data.get('idtTipoUsuario')
       
    valida = Valida()
    valida.codCPF(codCPF)
    valida.nomUsuario(nomUsuario)
    valida.idtTipoUsuario(idtTipoUsuario)
    
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        INSERT INTO usuario 
           (codCPF, nomUsuario, idtTipoUsuario)
             VALUES (%s, %s, %s)
    """
    params = (codCPF, nomUsuario, idtTipoUsuario,)
    
    db = Db()
    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)
    
@usuarios_bp.route('/usuario/<codCPF>', methods=['PUT'])
def atualizar_usuarios(codCPF):
    data = request.get_json()
    
    nomUsuario = data.get('nomUsuario')
    idtTipoUsuario = data.get('idtTipoUsuario')
       
    valida = Valida()
    valida.codCPF(codCPF)
    valida.nomUsuario(nomUsuario)
    valida.idtTipoUsuario(idtTipoUsuario)
    
    if valida.temMensagem():
        return valida.getMensagens()


    sql = """
        UPDATE Usuario
           SET nomUsuario = %s,
               idtTipoUsuario = %s
         WHERE codCPF = %s
    """
    params = (nomUsuario, idtTipoUsuario, codCPF,)
    
    db = Db()
    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)


@usuarios_bp.route('/usuario/<codCPF>', methods=['DELETE'])
def excluir_usuario(codCPF):
    valida = Valida()
    valida.codCPF(codCPF)
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        DELETE FROM Usuario
         WHERE codCPF = %s
    """
    params = (codCPF,)

    db = Db()
    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)

