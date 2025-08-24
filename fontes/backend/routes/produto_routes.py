# routes/produto_routes.py 
from flask import Blueprint, request
import calendar, datetime
from datetime import datetime, date
produto_bp = Blueprint("produto_bp", __name__)
from db import Db, Mode
from valida import Valida
import xmltodict
import util
import json

from nfe import NFe

# funcoes privadas
def ultimo_dia_do_mes(mes, ano):
    ultimo_dia = calendar.monthrange(ano, mes)[1]
    return f"{ano}-{mes:02d}-{ultimo_dia:02d}" 

# Função para obter laboratórios do usuário
def obter_laboratorios_usuario(codCPF):
    valida = Valida()
    valida.codCPF(codCPF)
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        SELECT codCampus, 
               codUnidade,
               codPredio,
               codLaboratorio,
               nomLocal 
          FROM LocalEstocagem 
         WHERE codCPFResponsavel = %s 
         ORDER BY nomLocal           
    """
    params = (codCPF,)
    
    try:
        db = Db()
        return db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

# Rota para listar todos os produtos
@produto_bp.route("/produtos", methods=["GET"])
def get_produtos():
    sql = """
        SELECT A.codProduto,
               A.nomProduto,
               A.nomLista,
               A.perPureza,
               A.vlrDensidade,
               A.ncm,
               A.idtAtivo,
               B.codOrgaoControle,
               B.nomOrgaoControle,
               (C.codProduto IS NOT NULL) AS idtControla
          FROM Produto A
         CROSS JOIN orgaoControle B
          LEFT JOIN ProdutoOrgaoControle C
            ON C.codProduto = A.codProduto  
           AND C.codOrgaoControle = B.codOrgaoControle
         ORDER BY A.nomProduto, B.nomOrgaoControle;
        """
		
    try:
        db = Db()
        produtos = db.execSql(sql, None, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    if not isinstance(produtos, list):
        return produtos
    
    if not produtos:
        return util.formataAviso("Produto não encontrado")

    produtos_agrupados = {}

    for produto in produtos:
        codProduto = produto[0]
        
        # Se o produto ainda não está no nosso dicionário de agrupamento
        if codProduto not in produtos_agrupados:
            produtos_agrupados[codProduto] = {
                "codProduto": produto[0],
                "nomProduto": produto[1],
                "nomLista": produto[2],
                "perPureza": produto[3],
                "vlrDensidade": produto[4],
                "ncm": produto[5],
                "idtAtivo": produto[6],
                "orgaosControle": [] 
            }
        
        # Adiciona o órgão de controle ao array do produto
        produtos_agrupados[codProduto]["orgaosControle"].append({
            "codOrgaoControle": produto[7],
            "nomOrgaoControle": produto[8],
            "idtControla": produto[9]
        })

    # Converte os valores do dicionário de volta para uma lista
    produto_formatado = list(produtos_agrupados.values())
   
    return produto_formatado

# Rota para obter um produto e quais são os seus repectivos orgaos de controle
@produto_bp.route("/obterProdutoPorId/<int:codProduto>", methods=["GET"])
def obter_produto(codProduto):
    valida = Valida()
    valida.codProduto(codProduto)
    if valida.temMensagem():
        return valida.getMensagens()
    
    sql = """
        SELECT A.codProduto,
               A.nomProduto, 
               A.nomLista, 
               A.perPureza,
               A.vlrDensidade,
               A.ncm,
               B.codOrgaoControle,
               C.nomOrgaoControle
        FROM Produto A
        JOIN ProdutoOrgaoControle B
          ON B.codProduto = A.codProduto
        JOIN OrgaoControle C
          ON C.codOrgaoControle = B.codOrgaoControle
        WHERE A.codProduto = %s
          AND A.idtAtivo = true
        ORDER BY A.nomProduto, C.nomOrgaoControle
    """
    params = (codProduto,)

    try:
        db = Db()
        produtos = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    if not produtos:
        return util.formataAviso("Produto não cadastrado!")
       
    # Estruturar o JSON de resposta
    produto_dict = {}
    orgaoControle = []

    for index, produto in enumerate(produtos):
        if index == 0:  # Primeira linha (produto principal)
            produto_dict = {
                "codProduto": produto[0],
                "nomProduto": produto[1],
                "nomLista": produto[2],
                "perPureza": float(produto[3]),
                "vlrDensidade": float(produto[4]),
                "ncm": produto[5],
                "orgaosControle": []
            }
            
        # Adicionar órgãos de controle à lista
        orgaoControle.append({
            "codOrgaoControle": produto[6],
            "nomOrgaoControle": produto[7]
        })

    # Adicionar a lista de órgãos de controle ao dicionário principal
    produto_dict["orgaosControle"] = orgaoControle

    return produto_dict

@produto_bp.route("/obterProdutosPorLaboratorio/<string:codCampus>/<string:codUnidade>/<string:codPredio>/<string:codLaboratorio>", methods=["GET"])
def obter_produtos_por_laboratorio(codCampus, codUnidade, codPredio, codLaboratorio):
    valida = Valida()
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    valida.codPredio(codPredio)
    valida.codLaboratorio(codLaboratorio)
    if valida.temMensagem():
        return valida.getMensagens()
    
    sql = """
        SELECT codProduto,
               nomProduto,
               nomLista,
               perPureza,
               vlrDensidade,
               ncm  
          FROM Produto A
         WHERE A.codProduto in (SELECT distinct codProduto
                                  FROM MovtoEstoque
                                 WHERE codCampus = %s 
                                   AND codUnidade = %s
                                   AND codPredio = %s
                                   AND codLaboratorio = %s)
           AND idtAtivo
         ORDER BY nomProduto  
        """
    params = (codCampus, codUnidade, codPredio, codLaboratorio,)

    try:
        db = Db()
        produtos = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    if not produtos:
        return util.formataAviso("Nenhum produto encontrado no local corrente de estocagem do usuário!")
    
    produtos_formatado = []
    for produto in produtos: 
        produtos_formatado.append({
            "codProduto": produto[0],
            "nomProduto": produto[1],
            "nomLista": produto[2],
            "perPureza": produto[3],
            "vlrDensidade": produto[4],
            "ncn": produto[5]
        })

    return produtos_formatado

# Rota para obter os Locais de Estocagem que o Usuario é o responsavel 
@produto_bp.route("/obterLocaisEstoque/<string:codCPF>", methods=["GET"])
def obter_Locais_Estoque_por_CPF(codCPF):
    valida = Valida()
    valida.codCPF(codCPF)
    if valida.temMensagem():
        return valida.getMensagens()
       
    sql = """
        SELECT codCampus, 
               codUnidade,
               codPredio,
               codLaboratorio,
               nomLocal 
          FROM LocalEstocagem 
         WHERE codCPFResponsavel = %s 
         ORDER BY nomLocal           
    """
    params = (codCPF,)
    
    try:
        db = Db()
        return db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)
"""
    locais = obter_laboratorios_usuario(codCPF)
    
    if not locais:
        return util.formataAviso("Usuário não é responsável por nenhum Local de Estocagem de Produtos Químicos Controlados!")
        
    locais_formatado = []
    for local in locais: 
        locais_formatado.append({
            "codCampus": local[0],
            "codUnidade": local[1],
            "codPredio": local[2],
            "codLaboratorio": local[3],
            "nomLocal": local[4]
        })

    return locais_formatado
    """

# Rota para consulta em grid 
@produto_bp.route("/consultaPQC/<string:codCPF>", methods=["GET"])
def consultarProdutos(codCPF):
    valida = Valida()
    valida.codCPF(codCPF)
    if valida.temMensagem():
        return valida.getMensagens()
    
    sql = """
       SELECT A.codProduto,
              A.nomProduto,
              A.perPureza,
              A.vlrDensidade,
              A.ncm,
              E.codCampus,
              E.nomCampus,
              F.codUnidade,
              F.nomUnidade,
              C.codPredio,
              C.codLaboratorio,
              D.nomLocal,
              B.seqItem,
              B.codEmbalagem,
              TO_CHAR(B.datValidade, 'DD-MM-YYYY') AS datValidade,
              C.idMovtoEstoque,
              desTipoMovto(C.idtTipoMovto) as desTipoMovto,
              TO_CHAR(C.datMovto, 'DD-MM-YYYY') AS datMovto,
              C.qtdEstoque,
              C.txtJustificativa
         FROM Produto A
         JOIN ProdutoItem B
           ON B.codProduto = A.codProduto
         JOIN MovtoEstoque C
           ON C.codProduto = B.codProduto
          AND C.seqItem = B.seqItem
         JOIN LocalEstocagem D
           ON D.codCampus = C.codCampus
          AND D.codUnidade = C.codUnidade
          AND D.codPredio = C.codPredio
          AND D.codLaboratorio = C.codLaboratorio
         JOIN Campus E
           ON E.codCampus = C.codCampus
         JOIN UnidadeOrganizacional F
           ON F.codCampus = C.codCampus
          AND F.codUnidade = C.codUnidade
        WHERE D.codCPFResponsavel = %s 
        ORDER By A.nomProduto, E.nomCampus,  F.nomUnidade, D.nomLocal, B.seqItem
    """
    params = (codCPF,) 

    try:
        db = Db()
        produtos = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    if not produtos:
         return util.formataAviso("Nenhum produto encontrado no local corrente de estocagem do usuário!")  

    print(produtos)
    produtos_map = {}
    
    for r in produtos:
        (codProduto, nomProduto, perPureza, vlrDensidade, ncm,
         codCampus, nomCampus, codUnidade, nomUnidade, codPredio,
         codLaboratorio, nomLocal, seqItem, codEmbalagem,
         datValidade, idMovtoEstoque, desTipoMovto, datMovto, qtdEstoque, txtJustificativa) = r
        
        
        pr = produtos_map.setdefault(codProduto, {
            "id": f"prod-{codCampus}-{codUnidade}-{codPredio}-{codLaboratorio}-{codProduto}-{seqItem}",
            "codProduto": codProduto,
            "nomProduto": nomProduto,
            "perPureza": perPureza,
            "vlrDensidade": vlrDensidade,
            "ncm": ncm,
            "totProduto": 0,
            "local": {}
        })

        pr["totProduto"] += qtdEstoque

        local_map = pr["local"].setdefault(codLaboratorio, {
            "id": f"loc-{codCampus}-{codUnidade}-{codPredio}-{codLaboratorio}",
            "codCampus": codCampus,
            "nomCampus": nomCampus,
            "nomUnidade": nomUnidade,
            "nomLaboratorio": nomLocal,
            "totalLocais": 0,
            "items": {}
        })

        local_map["totalLocais"] += qtdEstoque

        item_map = local_map["items"].setdefault(seqItem, {
            "id": idMovtoEstoque,
            "seqItem": seqItem,
            "codEmbalagem": codEmbalagem,
            "datValidade": datValidade,
            "totalItem": 0,
            "movtos": []
        })

        item_map["totalItem"] += qtdEstoque

        item_map["movtos"].append({
            "id": idMovtoEstoque,
            "idtTipoMovto": desTipoMovto,
            "datMovto": datMovto,
            "qtdMovto": qtdEstoque,
            "txtJustificativa": txtJustificativa,
        })

    result = []
    for prod in produtos_map.values():
        prod_out = {**prod, "local": []}
        for loc in prod["local"].values():
            camp_out = {**loc, "items": []}
            for item in loc["items"].values():
                camp_out["items"].append(item)
            prod_out["local"].append(camp_out)
        result.append(prod_out)

    return result
   
#Rota para obter os produtos de um local com o saldo de estoque atual
@produto_bp.route("/obterEstoqueLocalEstocagem/<string:codCampus>/<string:codUnidade>/<string:codPredio>/<string:codLaboratorio>", methods=["GET"])
def obter_estoque_local_estocagem(codCampus, codUnidade, codPredio, codLaboratorio):
    valida = Valida()
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    valida.codPredio(codPredio)
    valida.codLaboratorio(codLaboratorio)
    if valida.temMensagem():
        return valida.getMensagens()
    
    # Construir a consulta principal considerando o último inventário
    # Usar uma única consulta que funciona para ambos os cenários
    sql = """
       SELECT A.codProduto,
              A.nomProduto,
              A.perPureza,
              A.vlrDensidade,
              B.seqItem,
              B.datValidade,
              B.codEmbalagem,
              sum(C.qtdEstoque) AS qtdEstoque
         FROM Produto A
         JOIN ProdutoItem B
           ON B.codProduto = A.codProduto
         JOIN MovtoEstoque C
           ON C.codProduto = B.codProduto
          AND C.seqItem = B.seqItem
         LEFT JOIN (
            SELECT codProduto, seqItem, MAX(idMovtoEstoque) as ultimo_inventario_id
              FROM MovtoEstoque
             WHERE codCampus = %s
               AND codUnidade = %s
               AND codPredio = %s
               AND codLaboratorio = %s
               AND idtTipoMovto in ('IN', 'IM') -- se ainda não houver inventário tem de usar implantação
             GROUP BY codProduto, seqItem
         ) UltInv 
           ON UltInv.codProduto = C.codProduto 
          AND UltInv.seqItem = C.seqItem
        WHERE C.codCampus = %s
          AND C.codUnidade = %s
          AND C.codPredio = %s
          AND C.codLaboratorio = %s
          AND (C.idMovtoEstoque >= UltInv.ultimo_inventario_id)
        GROUP BY 1,2,3,4,5,6,7
        HAVING sum(C.qtdEstoque) > 0
        ORDER By A.nomProduto, B.datValidade
    """
    params = (codCampus, codUnidade, codPredio, codLaboratorio, codCampus, codUnidade, codPredio, codLaboratorio,)

    try:
        db = Db()
        produtos = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    if not produtos:
         return util.formataAviso("Nenhum produto encontrado no local corrente de estocagem do usuário!")  

    dictProduto = {}

    for produto in produtos:
        codProduto = produto[0]
        nomProduto = produto[1]
        perPureza = produto[2]
        vlrDensidade = produto[3]
        seqItem = produto[4]
        datValidade = produto[5]
        codEmbalagem = produto[6]
        qtdEstoque = produto[7]

        if codProduto not in dictProduto:
            dictProduto[codProduto] = {
                    "codProduto": codProduto,
                    "nomProduto": nomProduto,
                    "perPureza": perPureza,
                    "vlrDensidade": vlrDensidade,
                    "item": []
            }

        dictProduto[codProduto]["item"].append({
            "seqItem": seqItem,
            "datValidade": datValidade,
            "codEmbalagem": codEmbalagem,
            "qtdEstoque": float(qtdEstoque),
        })

    return list(dictProduto.values())

@produto_bp.route("/obterProdutosNaoImplantadosPorLocal/<string:codCampus>/<string:codUnidade>/<string:codPredio>/<string:codLaboratorio>", methods=["GET"])
def produtos_nao_implantados_por_laboratorio(codCampus, codUnidade, codPredio, codLaboratorio):

    valida = Valida()
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    valida.codPredio(codPredio)
    valida.codLaboratorio(codLaboratorio)
  
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        SELECT A.codProduto,
               A.nomProduto,
               A.nomLista,
               A.perPureza,
               A.vlrDensidade,
               A.ncm
          FROM Produto A
         WHERE A.idtAtivo = true
           AND A.codProduto not in (SELECT distinct codProduto 
                                    FROM MovtoEstoque B
                                   WHERE B.codProduto = A.codProduto
                                     AND B.codCampus = %s
                                     AND B.codUnidade = %s
                                     AND B.codPredio = %s
                                     AND B.codLaboratorio = %s)
         ORDER BY A.nomProduto
    """
    params = (codCampus, codUnidade, codPredio, codLaboratorio,)
    
    try:
        db = Db()
        produtos = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)
   
    if not produtos:
        return util.formataAviso("Nenhum produto encontrado!") 

    produto_formatado = [
          {
              "codProduto": row[0],
              "nomProduto": row[1],
              "nomLista": row[2],
              "perPureza": row[3],
              "vlrDensidade": row[4],
              "ncm": row[5]
          }
          for row in produtos
      ]

    return (produto_formatado)

@produto_bp.route("/verificarSeTeveImplantacao/<string:codCampus>/<string:codUnidade>/<string:codPredio>/<string:codLaboratorio>", methods=["GET"])
def verificar_implantacao(codCampus, codUnidade, codPredio, codLaboratorio):
    valida = Valida()
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    valida.codPredio(codPredio)
    valida.codLaboratorio(codLaboratorio)

    if valida.temMensagem():
        return valida.getMensagens()
    
    sql = """
        SELECT count(*)
          FROM Produto A
          JOIN MovtoEstoque B
            ON B.codProduto = A.codProduto        
         WHERE A.idtAtivo = true
           AND B.codCampus = %s 
           AND B.codUnidade = %s
           AND B.codPredio = %s
           AND B.codLaboratorio = %s
           AND B.idtTipoMovto = 'IM'
        """
    params = (codCampus, codUnidade, codPredio, codLaboratorio,)

    try:
        db = Db()
        produtos = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    if not produtos:
        return util.formataAviso("Nenhum produto encontrado no local corrente de estocagem do usuário!")
    
    produto = produtos[0]
    produtos_formatado = {'qtdItensImplantados': produto[0]}

    return produtos_formatado


#Rota para obter todos laboratorio
@produto_bp.route("/obterTodosLaboratorios", methods=["GET"])
def obter_todos_laboratorios():
    sql = """
        SELECT codCampus,
               codUnidade, 
               codPredio, 
               codLaboratorio,
               nomLocal 
          FROM LocalEstocagem
         ORDER BY codCampus, nomLocal
        """
    
    try:
        db = Db()
        locais = db.execSql(sql, None, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)
 
    if not locais:
        return util.formataAviso("Nenhum local de estocagem encontrado!") 
    
    local_formatado = [
            {
                "codCampus": lab[0],
                "codUnidade": lab[1],
                "codPredio": lab[2],
                "codLaboratorio": lab[3],
                "nomLocal": lab[4]
            }
            for lab in locais
        ]

    return local_formatado

# Rota para adicionar um novo produto
@produto_bp.route("/produtos", methods=["POST"])
def add_produto():
    data = request.get_json()

    nomProduto = data.get("nomProduto")
    nomLista = data.get("nomLista")
    perPureza = data.get("perPureza") 
    vlrDensidade = data.get("vlrDensidade") 
    idtAtivo = data.get("idtAtivo")
    ncm = data.get("ncm") 
  
    valida = Valida()
    valida.nomProduto(nomProduto)
    valida.nomLista(nomLista)
    valida.perPureza(perPureza)
    valida.vlrDensidade(vlrDensidade)
    valida.ncm(ncm)
    valida.idtAtivo(idtAtivo)

    temOrgaoControle = False
    for orgaoControle in data.get("orgaosControle"):
        temOrgaoControle = True
        codOrgaoControle = orgaoControle.get('codOrgaoControle')
        valida.codOrgaoControle(codOrgaoControle)
   
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        INSERT INTO Produto
           (nomProduto, nomLista, perPureza, vlrDensidade, ncm, idtAtivo) 
            VALUES 
            (%s, %s, %s, %s, %s, %s)
            RETURNING codProduto
    """
    params = (nomProduto, nomLista, perPureza, vlrDensidade,  ncm, idtAtivo)

    db = Db()
    try: 
        resultado = db.execSql(sql, params )
        if resultado != '':
            return resultado
        
        codProduto = db.getIdInsert()
    
        if temOrgaoControle:
            # INSERT órgãos de controle (se houver)
            sql = """
                INSERT INTO ProdutoOrgaoControle
                  (codProduto, codOrgaoControle)
                VALUES
            """
            valores = []
            params = []
            for orgaoControle in data.get("orgaosControle"):
                if orgaoControle.get('idtControla'):
                   codOrgaoControle = orgaoControle.get('codOrgaoControle')
                
                   valores.append('(%s, %s)')
                   params.append(codProduto)
                   params.append(codOrgaoControle)
               
            sql += ', '.join(valores)
            return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)

# Rota para atualizar um produto e os orgaosControladores
@produto_bp.route("/produtos/<int:codProduto>", methods=["PUT"])
def update_produto(codProduto):
    data = request.get_json()

    nomProduto = data.get("nomProduto")
    nomLista = data.get("nomLista")
    perPureza = data.get("perPureza")
    vlrDensidade = data.get("vlrDensidade")
    ncm = data.get("ncm")
    idtAtivo = data.get("idtAtivo")
  
    valida = Valida()
    valida.codProduto(codProduto)  
    valida.nomProduto(nomProduto)
    valida.nomLista(nomLista)
    valida.perPureza(perPureza)
    valida.vlrDensidade(vlrDensidade)
    valida.ncm(ncm)
    valida.idtAtivo(idtAtivo)

    temOrgaoControle = False
    for orgaoControle in data.get("orgaosControle"):
        temOrgaoControle = True
        codOrgaoControle = orgaoControle.get('codOrgaoControle')
        valida.codOrgaoControle(codOrgaoControle)

    if valida.temMensagem():
        return valida.getMensagens()

    db = Db()
    try:
        sql = """
            UPDATE Produto 
            SET nomProduto = %s,
                nomLista = %s,
                perPureza = %s,
                vlrDensidade = %s,
                ncm = %s,
                idtAtivo = %s
            WHERE codProduto = %s
        """
        params = (nomProduto, nomLista, perPureza, vlrDensidade, ncm, idtAtivo, codProduto)
    
        db.execSql(sql, params, Mode.BEGIN)

        # DELETE órgãos de controle
        sql = """
            DELETE FROM ProdutoOrgaoControle
             WHERE codProduto = %s
        """
        params = (codProduto,)
        
        if temOrgaoControle:
            db.execSql(sql, params, Mode.DEFAULT)

            # INSERT órgãos de controle (se houver)
            sql = """
                INSERT INTO ProdutoOrgaoControle
                  (codProduto, codOrgaoControle)
                VALUES
            """
            valores = []
            params = []
            for orgaoControle in data.get("orgaosControle"):
                if orgaoControle.get('idtControla'):
                   codOrgaoControle = orgaoControle.get('codOrgaoControle')
                
                   valores.append('(%s, %s)')
                   params.append(codProduto)
                   params.append(codOrgaoControle)
               
            sql += ', '.join(valores)
            return db.execSql(sql, params, Mode.COMMIT)
        else:
            return db.execSql(sql, params, Mode.COMMIT)
    except Exception as e:
        return db.getErro(e)
   

# Rota para excluir um produto
@produto_bp.route("/produtos/<int:codProduto>", methods=["DELETE"])
def delete_produto(codProduto):
    valida = Valida()
    valida.codProduto(codProduto)  
    if valida.temMensagem():
        return valida.getMensagens()
    
    db = Db() 

    sql = """
        SELECT count(*)
          FROM MovtoEstoque
         WHERE codProduto = %s
    """
    params = (codProduto,)

    try:
        resultado = db.execSql(sql, params, Mode.SELECT)
        qtdMovto = resultado[0][0]
        if qtdMovto > 0:
            return util.formataAviso(f"Produto possui {qtdMovto} movimentações no estoque. Não pode ser removido!")                    

        sql = """
           DELETE FROM MovtoEstoque 
            WHERE codProduto = %s
        """
        params = (codProduto,)
        resultado = db.execSql(sql, params, Mode.BEGIN)
        if resultado != '':
            return resultado
        
        sql = """
           DELETE FROM ProdutoOrgaoControle 
            WHERE codProduto = %s
        """
        params = (codProduto,)
        resultado = db.execSql(sql, params, Mode.DEFAULT)
        if resultado != '':
            return resultado
        
        sql = """
           DELETE FROM ProdutoItem 
            WHERE codProduto = %s
        """
        params = (codProduto,)
        resultado = db.execSql(sql, params, Mode.DEFAULT)
        if resultado != '':
            return resultado
        
        sql = """
           DELETE FROM Produto 
            WHERE codProduto = %s
        """
        params = (codProduto,)
        return db.execSql(sql, params, Mode.COMMIT)
    except Exception as e:
        return db.getErro(e)


#Rota para atualizar um inventario
@produto_bp.route("/atualizarInventario", methods=["POST"])
def atualizar_inventario():
    data = request.get_json()

    codCampus = data.get('codCampus')
    codUnidade = data.get('codUnidade')
    codLaboratorio = data.get('codLaboratorio')
    codPredio = data.get('codPredio')

    produtos = data.get('produtos')   

    valida = Valida()
    valida.codCampus(codCampus)  
    valida.codUnidade(codUnidade)
    valida.codLaboratorio(codLaboratorio)
    valida.codPredio(codPredio)
    if valida.temMensagem():
        return valida.getMensagens()

    datMovto = date.today().strftime('%Y-%m-%d')
    txtJustificativa = ''

    params = []
    movto = []

    try:
        for produto in produtos:
            codProduto = produto.get('codProduto')
            seqItem = produto.get('seqItem')
            qtdEstoque = produto.get('qtdEstoque')
            qtdNova = produto.get('qtdNova')  # Nova quantidade fornecida pelo usuário
        
            # Calcula a diferença entre a nova quantidade e a quantidade atual
            diferenca = qtdNova - qtdEstoque

            # Determina o tipo de ajuste com base na diferença
            if diferenca > 0:
                idtTipoMovto_ajuste = "AE"  # Ajuste Entrada
            else:
                if diferenca < 0:
                    idtTipoMovto_ajuste = "AC"  # Ajuste Consumo
                else:
                    idtTipoMovto_ajuste = None

            
            if idtTipoMovto_ajuste: 
                # Só gera inventário se houver diferença de saldo
                params.extend([codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio,
                            datMovto, idtTipoMovto_ajuste, diferenca, txtJustificativa])
                movto.append("(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")

                idtTipoMovto_ajuste = "IN" 
                params.extend([codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio,
                            datMovto, idtTipoMovto_ajuste, qtdNova, txtJustificativa])
                movto.append("(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
    
        # Inserção em lote para MovtoEstoque
        sql = f"""
            INSERT INTO MovtoEstoque (
                codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio,
                datMovto, idtTipoMovto, qtdEstoque, txtJustificativa
            ) VALUES {', '.join(movto)};
        """
    except Exception as e:
        return util.formataAviso(f"Erro ao preparar SQL de bloco -> {e}")


    db = Db()
    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)

#Rota para atualizar a transferencia
@produto_bp.route("/atualizarTransferencia", methods=["POST"])
def atualizar_transferencia():
    data = request.get_json()

    codCampusOrigem = data.get('codCampusOrigem')
    codUnidadeOrigem = data.get('codUnidadeOrigem')
    codPredioOrigem = data.get('codPredioOrigem')
    codLaboratorioOrigem = data.get('codLaboratorioOrigem')
    
    codCampusDestino = data.get('codCampusDestino')
    codUnidadeDestino = data.get('codUnidadeDestino')
    codPredioDestino = data.get('codPredioDestino')
    codLaboratorioDestino = data.get('codLaboratorioDestino')

    valida = Valida()
    valida.codCampus(codCampusOrigem)  
    valida.codUnidade(codUnidadeOrigem)
    valida.codPredio(codPredioOrigem)
    valida.codLaboratorio(codLaboratorioOrigem)

    valida.codCampus(codCampusDestino)  
    valida.codUnidade(codUnidadeDestino)
    valida.codPredio(codPredioDestino)
    valida.codLaboratorio(codLaboratorioDestino)

    produtos = data.get('produtos')   

    for produto in produtos:
        codProduto = produto.get('codProduto')
        seqItem = produto.get('seqItem')
        qtdEstoque = produto.get('qtdEstoque')
        qtdTransferir = produto.get('qtdTransferir')  

        valida.codProduto(codProduto)
        valida.qtdEstoque(qtdEstoque)
        valida.qtdTransferir(qtdTransferir)
        valida.transferencia(qtdEstoque, qtdTransferir)

    if valida.temMensagem():
        return valida.getMensagens()

    txtJustificativa = ''

    params = []
    movto = []

    try:
        for produto in produtos:
            codProduto = produto.get('codProduto')
            seqItem = produto.get('seqItem')
            qtdEstoque = produto.get('qtdEstoque')
            qtdTransferir = produto.get('qtdTransferir')  
        
            txtJustificativa = (f"Transferido para: {codCampusDestino}/{codUnidadeDestino}/{codLaboratorioDestino}")
            movto.append("(%s, %s, %s, %s, %s, %s, NOW(), 'TS', %s, %s)")
            params.extend([codProduto, seqItem, codCampusOrigem, codUnidadeOrigem, codPredioOrigem, codLaboratorioOrigem,
                           qtdTransferir*(-1), txtJustificativa])

            txtJustificativa = (f"Transferido de: {codCampusOrigem}/{codUnidadeOrigem}/{codLaboratorioOrigem}")
            if qtdTransferir == qtdEstoque:
                # Significa que o frasco será transferido
                movto.append("(%s, %s, %s, %s, %s, %s, NOW(), 'TE', %s, %s)")
                params.extend([codProduto, seqItem, codCampusDestino, codUnidadeDestino, codPredioDestino, codLaboratorioDestino,
                               qtdTransferir, txtJustificativa])
            else:
                # Significa que parte do conteudo do frasco foi transferido para um novo frasco
                movto.append("(%s, %s, %s, %s, %s, %s, NOW(), 'IM', %s, %s)")
                params.extend([codProduto, seqItem, codCampusDestino, codUnidadeDestino, codPredioDestino, codLaboratorioDestino,
                               qtdTransferir, txtJustificativa])

     
        # Inserção em lote para MovtoEstoque
        sql = f"""
            INSERT INTO MovtoEstoque (
                codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio,
                datMovto, idtTipoMovto, qtdEstoque, txtJustificativa
            ) VALUES {', '.join(movto)};
        """
    except Exception as e:
        return util.formataAviso(f"Erro ao preparar SQL de bloco -> {e}")

    db = Db()
    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)

# Função usando na implantação e na Entrada por Doação ou Compra sem NFe
def atualizaItemMovto(data, idtTipoMovto):
    codCampus = data.get("codCampus")
    codUnidade = data.get("codUnidade")
    codPredio = data.get("codPredio")
    codLaboratorio = data.get("codLaboratorio")
    produtos = data.get("produtos")

    valida = Valida()
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    valida.codPredio(codPredio)
    valida.codLaboratorio(codLaboratorio)
    valida.idtTipoMovto(idtTipoMovto)
    if valida.temMensagem():
        return valida.getMensagens()  

    totItens = 0
    for produto in produtos:
        codProduto = produto.get("codProduto")
        valida.codProduto(codProduto)
        items = produto.get("items")  

        for item in items:
            qtdEstoque = item.get("qtdEstoque")
            datValidade = item.get("datValidade")
            codEmbalagem = item.get("codEmbalagem")

            valida.qtdEstoque(qtdEstoque)
            valida.datValidade(datValidade)
            valida.codEmbalagem(codEmbalagem)
            totItens += 1
            
    if valida.temMensagem():
        return valida.getMensagens()  
    
    if totItens == 0:
        return util.formataAviso("Não foram informados produtos para processar!")

    try:
        db = Db()
        mode = Mode.BEGIN

        sql_insert_item = """
            INSERT INTO ProdutoItem (codProduto, datValidade, codEmbalagem)
                    VALUES (%s, %s, %s)
                    RETURNING seqItem
        """

        sql_insert_movto = """
            INSERT INTO MovtoEstoque 
                (codProduto, seqItem, codCampus, codUnidade, codPredio, 
                 codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
                 values 
        """
              
        valores_movtoEstoque = []
        params_movtoEstoque = []
        mode = Mode.BEGIN
     
        for produto in produtos:
            codProduto = produto.get("codProduto")
                     
            items = produto.get("items")  

            for item in items:
                qtdEstoque = item.get("qtdEstoque")
                datValidade = item.get("datValidade")
                codEmbalagem = item.get("codEmbalagem")
                txtJustificativa = item.get('txtJustificativa')           

                params = (codProduto, datValidade, codEmbalagem)

                resultado = db.execSql(sql_insert_item, params, mode, True)
                if resultado != '':
                    return resultado
                
                mode = Mode.DEFAULT

                seqItem = db.getIdInsert()

                valores_movtoEstoque.append("(%s, %s, %s, %s, %s, %s, NOW(), %s, %s, %s)")
                params_movtoEstoque.append(codProduto)
                params_movtoEstoque.append(seqItem)
                params_movtoEstoque.append(codCampus)
                params_movtoEstoque.append(codUnidade)
                params_movtoEstoque.append(codPredio)
                params_movtoEstoque.append(codLaboratorio)
                params_movtoEstoque.append(idtTipoMovto)
                params_movtoEstoque.append(qtdEstoque)
                params_movtoEstoque.append(txtJustificativa)
 
        sql_insert_movto += ', '.join(valores_movtoEstoque)   
        
        return db.execSql(sql_insert_movto, params_movtoEstoque, Mode.COMMIT)
    except Exception as e:
        return db.getErro(e)                


# Executado toda vez que for incluido um novo produto - Implantação
@produto_bp.route("/implantarItensLaboratorio", methods=["POST"])
def implantar_itens_laboratorio():
    data = request.get_json()
    return atualizaItemMovto(data, 'IM')
      
# Executado para toda vez que for criado um novo produtoItem - Compra Doacao
# Se o produto não existir para receber tem de cadastrá-lo primeiro
@produto_bp.route("/atualizarMovtoEstoqueCompraDoacao", methods=["POST"])
def atualizarMovtoEstoqueCompraDoacao():
    data = request.get_json()

    idtTipoMovto = data.get("tipoCadastro") 
    return atualizaItemMovto(data, idtTipoMovto)

    
# rota de importação da NFe dando entrada no estoque
@produto_bp.route('/nfe', methods=['POST'])
def salvar_NFE():
    db = Db()
    def inverter_data_string(data_original):
        """
            Inverte uma data do formato 'aaaa-mm-dd' para 'dd/mm/aaaa'.
        """
        try:
            # Divide a string em partes (ano, mês, dia)
            partes = data_original.split('-')
            
            # Verifica se a string tem 3 partes
            if len(partes) != 3:
                return data_original
            
            # Inverte a ordem das partes e junta com '/'
            data_invertida = f"{partes[2]}/{partes[1]}/{partes[0]}"
            return data_invertida
        except:
            return "Ocorreu um erro ao processar a data."

    def produtoCadastrado(NCM):
        sql = """
            SELECT A.codProduto, max(B.seqItem)
              FROM Produto A
              JOIN ProdutoItem B
                ON B.codProduto = A.codProduto
             WHERE A.ncm = %s
             GROUP BY 1
        """
        params = (NCM,)

        try:
            return db.execSql(sql, params, Mode.SELECT)
        except Exception as e:
            return db.getErro(e)

      
    #------------ inicio -----------------------#
    data = request.get_json()
    
    codCampus = data.get('codCampus')
    codUnidade = data.get('codUnidade')
    codPredio = data.get('codPredio')
    codLaboratorio = data.get('codLaboratorio')

    nfeXML = data.get('nfeXML')

    valida = Valida()
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    valida.codPredio(codPredio)
    valida.codLaboratorio(codLaboratorio)

    valida.nfeXML(nfeXML)

    print(valida.getMensagens())
    if valida.temMensagem():
        return valida.getMensagens()
    
    naoProcessados = []        
   
    xml_dict = xmltodict.parse(nfeXML)

    #instanciando a classe nfe
    nfe = NFe(xml_dict)
    idNFe = nfe.get_chave_acesso()

    ide_data = nfe.get_ide()
    dhEmi_string = ide_data.get('dhEmi')
    dhEmi_obj = datetime.strptime(dhEmi_string, '%Y-%m-%dT%H:%M:%S%z')
    dhEmi_obj = datetime.strptime(dhEmi_string, '%Y-%m-%dT%H:%M:%S%z')
    datEmissao = dhEmi_obj.date()

    sql_produtoItem = """
        INSERT INTO ProdutoItem (codProduto, seqItem, idNFe, datValidade, codEmbalagem)
         values
    """
                                
    sql_movtoEstoque = """
        INSERT INTO MovtoEstoque (codProduto, seqItem, codCampus, codUnidade, codPredio, 
                                  codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
            values
    """
    
    valores_produtoItem = []
    valores_movtoEstoque = []

    detalhes_produtos = nfe.get_detalhes_produtos()

    if not detalhes_produtos:
        return util.formataAviso("Nota fiscal eletrônica sem produtos para processar!")
    
    for i, detProd in enumerate(detalhes_produtos):
        
        prod = detProd.get('prod')
        ncm = prod.get('NCM')
        resultado = produtoCadastrado(ncm)

        if len(resultado) == 0:
            naoProcessados.append({'NCM': ncm, 'nomProduto': prod.get('xProd')})
            continue
            
        codProduto = resultado[0][0]
        seqItem = resultado[0][1]

        print("seq item ", seqItem)
    
        unidadeMedida = prod.get('rastro').get('uCom') 
        qtd = int(float(prod.get('qCom'))) 

        nroLote = prod.get('rastro').get('qLote') 
        datFabricacao = inverter_data_string(prod.get('rastro').get('dFab'))
        datValidade = inverter_data_string(prod.get('rastro').get('dVal'))
        txtJustificativa = (f"Lote: {nroLote} fabricado em: {datFabricacao} validade até: {datValidade}")
                           
 
        params_produtoItem = []
        params_movtoEstoque = []
        
        # inseri um item para cada unidade da quantidade   
        for i in range(0, qtd):
            seqItem += 1
            valores_produtoItem.append('(%s, %s, %s, %s, %s)')
            params_produtoItem.append(codProduto)
            params_produtoItem.append(seqItem)
            params_produtoItem.append(idNFe)
            params_produtoItem.append(datValidade)
            params_produtoItem.append(unidadeMedida)
            
            valores_movtoEstoque.append("(%s, %s, %s, %s, %s, %s, %s, 'EC', %s, %s)")
            params_movtoEstoque.append(codProduto)
            params_movtoEstoque.append(seqItem)
            params_movtoEstoque.append(codCampus)
            params_movtoEstoque.append(codUnidade)
            params_movtoEstoque.append(codPredio)
            params_movtoEstoque.append(codLaboratorio)
            params_movtoEstoque.append(datEmissao)
            params_movtoEstoque.append(1) # avaliar o que passar
            params_movtoEstoque.append(txtJustificativa)
            
    sql_produtoItem += ', '.join(valores_produtoItem) 
    sql_movtoEstoque += ', '.join(valores_movtoEstoque)   
    
    print(sql_produtoItem) 
    print(sql_movtoEstoque)
    try:
        sql = """
             INSERT INTO NotaFiscal 
                (idNFe, txtJson)
              values (%s, %s)
        """
        params = (idNFe, json.dumps(xml_dict))

        resultado =  db.execSql(sql, params, Mode.BEGIN)
        if resultado != '':
            return resultado
        
        resultado = db.execSql(sql_produtoItem, params_produtoItem, Mode.DEFAULT )
        if resultado != '':
            return resultado
        
        resultado =  db.execSql(sql_movtoEstoque, params_movtoEstoque, Mode.COMMIT)
    
        for prod in naoProcessados:
            resultado += (f"NCM: {prod.ncm} - {prod.nomProduto} não foi atualizado por não estar cadastrado!")

        return resultado 

    except Exception as e:
        return db.getErro(e)                   

   
