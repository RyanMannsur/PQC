from flask import Blueprint, request
from db import Db, Mode
from valida import Valida
import util

auth_bp = Blueprint("api", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    
    codCPF = data.get('cpf')
    valida = Valida()
    valida.codCPF(codCPF)
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        SELECT A.nomUsuario,
               A.idtTipoUsuario,
               A.codCampus, 
               A.codUnidade,
               A.codPredio,
               A.codLaboratorio,
               B.codCampus, 
               B.codUnidade,
               B.codPredio,
               B.codLaboratorio,
               B.nomLocal  
          FROM usuario A
     LEFT JOIN localEstocagem B
            ON B.codCPFResponsavel = A.codCPF 
         WHERE A.codCPF = %s 
    """
    params = (codCPF,)
    try:
        db = Db()
        usuario = db.execSql(sql, params, Mode.SELECT)
        if not usuario:
            return util.formataAviso("Credenciais inválidas")
    except Exception as e:
        return db.getErro(e)
    
    
    usuario_dict = {}
    labs = []
    ind = 0
    for index, usu in enumerate(usuario):
        if index == 0:  
            usuario_dict = {
                "codCPF": codCPF,
                "nomUsuario": usu[0],
                "idtTipoUsuario": usu[1],
                "indCorrente": 0,
                "laboratorios": labs
            } 
            codCampusAtu = usu[2] 
            codUnidadeAtu = usu[3]
            codPredioAtu = usu[4]
            codLaboratorioAtu = usu[5]
            
        if codCampusAtu == usu[6] and codUnidadeAtu == usu[7] and codPredioAtu == usu[8] and codLaboratorioAtu == usu[9]:
            ind = index 

        # Adicionar labs
        labs.append({
            "codCampus": usu[6],
            "codUnidade": usu[7],
            "codPredio": usu[8],
            "codLaboratorio": usu[9],
            "nomLocal": usu[10]
        })
    
    
    usuario_dict['indCorrente'] = ind   
    usuario_dict['laboratorios'] = labs

    print("--- Detalhes do Usuário ---")
    for key, value in usuario_dict.items():
    # Verifica se o valor é a lista de laboratórios para exibir de forma diferente
        if key == "laboratorios":
            print(f"\n--- Lista de Laboratórios ---")
            for i, lab in enumerate(value):
                print(f"Laboratório {i + 1}:")
                # Loop aninhado para exibir as chaves e valores de cada laboratório
                for lab_key, lab_value in lab.items():
                    print(f"    - {lab_key}: {lab_value}")
            print("\n--- Fim da Lista ---")
        else:
            # Exibe as outras chaves e valores do dicionário
            print(f"- {key}: {value}")


    return usuario_dict

@auth_bp.route('/alterarLaboratorioCorrente', methods=['PUT'])
def atu_lab_corrente():
    data = request.get_json()
 
    codCPF = data.get('codCPF')
    codCampus = data.get('codCampus')
    codUnidade = data.get('codUnidade')
    codPredio = data.get('codPredio')
    codLaboratorio = data.get('codLaboratorio')
           
    valida = Valida()
    valida.codCPF(codCPF)
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    valida.codPredio(codPredio)
    valida.codLaboratorio(codLaboratorio)
    
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        UPDATE Usuario 
           SET codCampus = %s,
               codUnidade = %s,
               codPredio = %s,
               codLaboratorio = %s
         WHERE codCPF = %s            
    """
    params = (codCampus, codUnidade, codPredio, codLaboratorio, codCPF,)
    
    db = Db()
    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)

