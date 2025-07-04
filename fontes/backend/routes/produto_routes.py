# routes/produto_routes.py 
from flask import Blueprint, request, jsonify
import calendar, datetime
from datetime import date
from flask import jsonify
produto_bp = Blueprint("produto_bp", __name__)
import sys
from db import Db, Mode
from valida import Valida
import util

print("Debugging informações...", file=sys.stdout)

# funcoes privadas
def ultimo_dia_do_mes(mes, ano):
    ultimo_dia = calendar.monthrange(ano, mes)[1]
    return f"{ano}-{mes:02d}-{ultimo_dia:02d}" 

# Rota para listar todos os produtos
@produto_bp.route("/produtos", methods=["GET"])
def get_produtos():
    sql = """
        SELECT codProduto,
               nomProduto,
               nomLista,
               perPureza,
               vlrDensidade
          FROM Produto
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

    produto_formatado = []
    for produto in produtos: 
        produto_formatado.append({
            "codProduto": produto[0],
            "nomProduto": produto[1],
            "nomLista": produto[2],
            "perPureza": produto[3],
            "vlrDensidade": produto[4]
        })

    return produto_formatado

# Rota para obter um produto e quais são os seus repectivos orgaos de controle
@produto_bp.route("/obterProdutoPorId/<int:codProduto>", methods=["GET"])
def obter_produto(codProduto):
    sql = """
        SELECT A.codProduto,
               A.nomProduto, 
               A.nomLista, 
               A.perPureza,
               A.vlrDensidade, 
               B.codOrgaoControle,
               C.nomOrgaoControle
        FROM Produto A
        JOIN ProdutoOrgaoControle B
          ON B.codProduto = A.codProduto
        JOIN OrgaoControle C
          ON C.codOrgaoControle = B.codOrgaoControle
        WHERE A.codProduto = %s
          AND A.idtAtivo
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
                "orgaosControle": []
            }
            
        # Adicionar órgãos de controle à lista
        orgaoControle.append({
            "codOrgaoControle": produto[5],
            "nomOrgaoControle": produto[6]
        })

    # Adicionar a lista de órgãos de controle ao dicionário principal
    produto_dict["orgaosControle"] = orgaoControle

    return produto_dict

# Rota para obter os Locais de Estocagem que o Usuario é o responsavel
@produto_bp.route("/obterLocaisEstoque/<int:codSiape>", methods=["GET"])
def obter_Locais_Estoque(codSiape):
    sql = """
        SELECT codCampus, 
               codUnidade,
               codPredio,
               codLaboratorio,
               nomLocal 
          FROM LocalEstocagem        
         WHERE codSiapeResponsavel = %s 
         ORDER BY nomLocal           
        """
    params = (codSiape,)

    try:
        db = Db()
        locais = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    if not locais:
        return util.formataAviso("Usuário não é responsável por nenhum Local de Estogem de Produtos Químicos Controlados!")
        
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
   

@produto_bp.route("/obterProdutosPorLaboratorio/<string:codCampus>/<string:codUnidade>/<string:codPredio>/<string:codLaboratorio>", methods=["GET"])
def obter_produtos_por_laboratorio(codCampus, codUnidade, codPredio, codLaboratorio):
    sql = """
        SELECT A.codProduto,
               A.nomProduto,
               A.nomLista,
               A.perPureza,
               A.vlrDensidade  
          FROM Produto A
          JOIN MovtoEstoque B
            ON B.codProduto = A.codProduto        
         WHERE A.idtAtivo
           AND B.codCampus = %s 
           AND B.codUnidade = %s
           AND B.codPredio = %s
           AND B.codLaboratorio = %s
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
            "vlrDensidade": produto[4]
        })

    return produtos_formatado


# sem uso
@produto_bp.route("/quantidadeProdutosImplantados/<string:codCampus>/<string:codUnidade>/<string:codPredio>/<string:codLaboratorio>", methods=["GET"])
def verifica_local_estocagem_Ja_implantado(codCampus, codUnidade, codPredio, codLaboratorio):
    sql = """
        SELECT count(*)  
          FROM MovtoEstoque 
         WHERE codCampus = %s 
           AND codUnidade = %s
           AND codPredio = %s
           AND codLaboratorio = %s
           AND idtTipoMovto = 'IM'
    """
    params = (codCampus, codUnidade, codPredio, codLaboratorio,)

    try:
        db = Db()
        qtde = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    return qtde

#Rota para obter os produtos de um local com o saldo de estoque atual
@produto_bp.route("/obterEstoqueLocalEstocagem/<string:codCampus>/<string:codUnidade>/<string:codPredio>/<string:codLaboratorio>", methods=["GET"])
def obter_estoque_local_estocagem(codCampus, codUnidade, codPredio, codLaboratorio):

    sql = """
        SELECT max(datMovto)
          FROM MovtoEstoque 
         WHERE codCampus = %s
           AND codUnidade = %s
           AND codPredio = %s
           AND codLaboratorio = %s
           AND idtTipoMovto = %s
    """
    params = (codCampus, codUnidade, codPredio, codLaboratorio, 'IN',)

    try:
        db = Db()
        datUltInventario = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    if datUltInventario:
        datInicio = datUltInventario[0]
    else:
        try:
            params = (codCampus, codUnidade, codPredio, codLaboratorio, 'IM')
            datImplantacao = db.execSql(sql, params, Mode.SELECT)
        except Exception as e:
            return db.getErro(e)

        if datImplantacao:
            datInicio = datImplantacao[0]
        else: 
            return util.formataAviso("Local de estocagem necessita de fazer a implantação!")  

    print(f"data inicio {datInicio}")
    sql = """
       SELECT A.codProduto,
              A.nomProduto,
              A.perPureza,
              A.vlrDensidade,
              B.seqItem,
              B.datValidade,
              sum(C.qtdEstoque) AS qtdEstoque
         FROM Produto A
         JOIN ProdutoItem B
           ON B.codProduto = A.codProduto
         JOIN MovtoEstoque C
           ON C.codProduto = B.codProduto
          AND C.seqItem = B.seqItem
        WHERE C.datMovto >= %s 
          AND C.codCampus = %s
          AND C.codUnidade = %s
          AND C.codPredio = %s
          AND C.codLaboratorio = %s 
        GROUP BY 1,2,3,4,5,6
        ORDER By 2, 5
    """
    params = (datInicio, codCampus, codUnidade, codPredio, codLaboratorio,)

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
        qtdEstoque = produto[6]

        if codProduto not in dictProduto:
            # cria a entrada do produto se ainda não existir
            dictProduto[codProduto] = {
                    "codProduto": codProduto,
                    "nomProduto": nomProduto,
                    "perPureza": perPureza,
                    "vlrDensidade": vlrDensidade,
                    "item": []
            }

        # adiciona o item na lista do produto
        dictProduto[codProduto]["item"].append({
            "seqItem": seqItem,
            "datValidade": datValidade,
            "qtdEstoque": float(qtdEstoque),
        })

    # converte para lista
    return list(dictProduto.values())
   
#Rota para consulta em grid
@produto_bp.route("/consultaPQC/<int:codSiape>", methods=["GET"])
def consultarProdutos(codSiape):
    
    sql = """
       SELECT A.codProduto,
              A.nomProduto,
              A.perPureza,
              A.vlrDensidade,
              E.codCampus,
              E.nomCampus,
              F.codUnidade,
              F.nomUnidade,
              G.codLaboratorio,
              G.nomLocal,
              B.seqItem,
              B.seqEmbalagem,
              B.datValidade,
              desTipoMovto(C.idtTipoMovto) as desTipoMovto,
              C.datMovto,
              C.qtdEstoque
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
           ON F.codUnidade = C.codUnidade
         JOIN LocalEstocagem G
           ON G.codPredio = C.codPredio
          AND G.codLaboratorio = C.codLaboratorio
        WHERE D.codSiapeResponsavel = %s 
        ORDER By  A.nomProduto, E.nomCampus,  F.nomUnidade, G.nomLocal, B.seqItem
    """
    params = (codSiape,) 

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
        (codProduto, nomProduto, perPureza, vlrDensidade,
         codCampus, nomCampus, codUnidade, nomUnidade,
         codLaboratorio, nomLocal, seqItem, seqEmbalagem,
         datValidade, desTipoMovto, datMovto, qtdEstoque) = r
        
        pr = produtos_map.setdefault(codProduto, {
            "id": f"prod-{codProduto}",
            "codProduto": codProduto,
            "nomProduto": nomProduto,
            "perPureza": perPureza,
            "vlrDensidade": vlrDensidade,
            "totProduto": 0,
            "local": {}
        })

        pr["totProduto"] += qtdEstoque

        local_map = pr["local"].setdefault(codLaboratorio, {
            "id": f"loc-{codCampus}-{codUnidade}-{codLaboratorio}",
            "codCampus": codCampus,
            "nomCampus": nomCampus,
            "nomUnidade": nomUnidade,
            "nomLaboratorio": nomLocal,
            "totalLocais": 0,
            "items": {}
        })

        local_map["totalLocais"] += qtdEstoque

        item_map = local_map["items"].setdefault(seqItem, {
            "id": f"item-{codProduto}-{seqItem}",
            "seqItem": seqItem,
            "nomEmbalagem": seqEmbalagem,
            "datValidade": datValidade.strftime("%d-%m-%Y") if hasattr(datValidade, "strftime") else datValidade,
            "totalItem": 0,
            "movtos": []
        })

        item_map["totalItem"] += qtdEstoque

        item_map["movtos"].append({
            "id": f"mov-{codProduto}-{seqItem}-{desTipoMovto}",
            "idtTipoMovto": desTipoMovto,
            "datMovto": datMovto.strftime("%d-%m-%Y") if hasattr(datMovto, "strftime") else datMovto,
            "qtdMovto": qtdEstoque
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
   
#Rota para obter os produtos de um local
@produto_bp.route("/buscarProdutos", methods=["GET"])
def buscar_produtos_local_estocagem():
    data = request.get_json() 
    codCampus = data.get("codCampus")
    codUnidade = data.get("codUnidade")
    codPredio = data.get("codPredio")
    codLaboratorio = data.get("codLaboratorio")
    nomProduto = data.get("nomProduto")
    perPureza = data.get("perPureza")
    vlrDensidade = data.get("vlrDensidade")

    filtro = ''
    if nomProduto:
         filtro += f" AND A.nomProduto like '%{nomProduto}%'"

    if perPureza:
         filtro += f" AND A.perPureza = {perPureza}"

    if vlrDensidade:
         filtro += f" AND A.vlrDensidade = {vlrDensidade}"

    sql = f"""
       SELECT A.codProduto,
              A.nomProduto,
              A.perPureza,
              A.vlrDensidade,
              B.seqItem,
              B.datValidade,
              sum(C.qtdEstoque)
         FROM Produto A
         JOIN ProdutoItem B
           ON B.codProduto = A.codProduto
         JOIN MovtoEstoque C
           ON C.codProduto = B.codProduto
          AND C.seqItem = B.seqItem
        WHERE C.datMovto >= (SELECT max(datMovto) FROM MovtoEstoque D
                              WHERE D.codProduto = A.codProduto
                                AND D.seqItem = B.seqItem
                                AND D.codCampus = C.codCampus
                                AND D.codUnidade = C.codUnidade
                                AND D.codPredio = C.codPredio
                                AND D.codLaboratorio = C.codLaboratorio
                                AND D.idtTipoMovto = 'IN') 
          AND C.codCampus = %s
          AND C.codUnidade = %s
          AND C.codPredio = %s
          AND C.codLaboratorio = %s 
          {filtro}
        GROUP BY 1,2,3,4,5,6
        ORDER By 2, 6
    """
    params = (codCampus, codUnidade, codPredio, codLaboratorio,)

    try:
        db = Db()
        produtos = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    if not produtos:
         return util.formataAviso("Nenhum produto encontrado no local corrente de estocagem do usuário!")  

    resultado = []
    itens = []
    for produto in produtos:
        resultado.append({
              "codProduto": produto[0],
              "nomProduto": produto[1],
              "perPureza": produto[2],
              "vlrDensidade": produto[3],
              "item": []})

        itens.append({
            "seqItem": produto[4],
            "datValidade": produto[5],
            "qtdEstoque": float(produto[6])
        })

    resultado["item"] = itens
    return resultado

@produto_bp.route("/ObterProdutoBYCodigoAndSequencia/<string:codCampus>/<string:codUnidade>/<string:codPredio>/<string:codLaboratorio>/<int:codProduto>/<int:seqItem>", methods=["GET"])
def obter_produto_por_codigo_e_sequencia(codCampus, codUnidade, codPredio, codLaboratorio, codProduto, seqItem):
    sql = """
       SELECT A.codProduto,
              A.nomProduto,
              A.perPureza,
              A.vlrDensidade,
              B.seqItem,
              B.datValidade,
              sum(C.qtdEstoque)
         FROM Produto A
         JOIN ProdutoItem B
           ON B.codProduto = A.codProduto
         JOIN MovtoEstoque C
           ON C.codProduto = B.codProduto
          AND C.seqItem = B.seqItem
        WHERE C.datMovto >= (SELECT max(datMovto) FROM MovtoEstoque D
                              WHERE D.codProduto = A.codProduto
                                AND D.seqItem = B.seqItem
                                AND D.codCampus = C.codCampus
                                AND D.codUnidade = C.codUnidade
                                AND D.codPredio = C.codPredio
                                AND D.codLaboratorio = C.codLaboratorio
                                AND D.idtTipoMovto = 'IN') 
          AND A.codProduto = %s
          AND B.seqItem = %s
          AND C.codCampus = %s
          AND C.codUnidade = %s
          AND C.codPredio = %s
          AND C.codLaboratorio = %s 
        GROUP BY 1,2,3,4,5,6
        ORDER By 2, 6
    """
    params = (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio,)

    try:
        db = Db()
        produtos = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    if not produtos:
         return util.formataAviso("Nenhum produto encontrado no local corrente de estocagem do usuário!")  

    resultado = []
   
    for produto in produtos:
        resultado.append({
              "codProduto": produto[0],
              "nomProduto": produto[1],
              "perPureza": produto[2],
              "vlrDensidade": produto[3],
              "seqItem": produto[4],
              "datValidade": produto[5],
              "qtdEstoque": float(produto[6])
        })

    return resultado

#------------------------------------------------------------------------------
# Se não houver item do produto no local de estocagem ele vai aparecer com qtdEstoque = 0
# Assim será inserido desde que o valor de estoque informado for diferente de zero
#---------------------------------------------------------------------------------    
@produto_bp.route("/obterEstoqueLocal", methods=["GET"])
def obter_Estoque_Local_Implantacao():
    data = request.get_json()

    codCampus = data.get('codCampus')
    codUnidade = data.get('codUnidade')
    codPredio = data.get('codPredio')
    codLaboratorio = data.get('codLaboratorio')
    datUltInventario = data.get("datUltInventario")

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
               A.perPureza,
               A.vlrDensidade,
               B.seqItem,
               C.datValidade,
               sum(coalesce(C.qtdEstoque, 0))
          FROM Produto A
     LEFT JOIN ProdutoItem B
            ON B.codProduto = A.codProduto
     LEFT JOIN MovtoEstoque C
            ON C.codProduto = B.codProduto
           AND C.SeqItem = B.SeqItem
         WHERE B.codCampus = %s
           AND B.codUnidade = %s
           AND B.codPredio = %s
           AND B.codLaboratorio = %s
           AND B.datMovto >= %s"
           AND B.idtTipoMovto in ('IN', 'TE', 'TS', 'EC', 'ED')
         GROUP BY 1,2,3,4,5,6 
        """  
    params = (codCampus, codUnidade, codPredio, codLaboratorio, datUltInventario,)
   
    try:
        db = Db()
        produtos = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)
   
    if not produtos:
         return util.formataAviso("Nenhum produto encontrado no local corrente de estocagem do usuário!")  

    resultado = []
    itens = []
    for produto in produtos:
        resultado.append({
              "codProduto": produto[0],
              "nomProduto": produto[1],
              "perPureza": produto[2],
              "vlrDensidade": produto[3],
              "item": []})

        itens.append({
            "seqItem": produto[4],
            "datValidade": produto[5],
            "qtdEstoque": float(produto[6])
        })

    resultado["item"] = itens
    return resultado

# Rota para selecionar OrgaosControle
@produto_bp.route("/obterOrgaoControle", methods=["GET"])
def obter_orgao_controle():
    sql = """
        SELECT codOrgaoControle,
               nomOrgaoControle 
          FROM OrgaoControle
    """
    try:
        db = Db()
        resultado = db.execSql(sql, None, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)
   
    if not resultado:
         return util.formataAviso("Nenhum orgao de controle encontrado!")  

    orgao_controle = []
    for orgao in resultado:
        orgao_controle.append({
              "codOrgaoControle": orgao[0],
              "nomProduto": orgao[1]
        })
    return orgao_controle  
   

@produto_bp.route("/obterNomeLocalEstocagem/<string:codCampus>/<string:codUnidade>/<string:codPredio>/<string:codLaboratorio>", methods=["GET"])
def obter_local_estocagem_por_id(codCampus, codUnidade, codPredio, codLaboratorio):
    sql = """
        SELECT nomLocal 
          FROM LocalEstocagem
         WHERE codCampus = %s
           AND codUnidade = %s
           AND codPredio = %s
           AND codLaboratorio = %s
        """
    params = (codCampus, codUnidade, codPredio, codLaboratorio,)
    
    try:
        db = Db()
        resultado = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)
   
    if not resultado:
         return util.formataAviso("Nenhum local de estocagem encontrado!")  

    local_formatado = []
    for local in resultado:
        local_formatado.append({
            "nomLocal": local[0]
        })
    return local_formatado

#Rota para obter produto pelo codigo
@produto_bp.route("/obterProdutoPeloCodigo/<int:codProduto>", methods=["GET"])
def obter_produto_pelo_codigo(codProduto):
    sql = """
        SELECT codProduto,
               nomProduto,
               nomLista,
               perPureza,
               vlrDensidade
          FROM Produto
          WHERE codProduto = %s;
      """
    params = (codProduto,)

    try:
        db = Db()
        produto = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)
   
    if not produto:
         return util.formataAviso("Nenhum produto encontrado!")  

    produto_formatado = []
    
    produto_formatado.append({
              "codProduto": produto[0],
              "nomProduto": produto[1],
              "nomLista": produto[2],
              "perPureza": float(produto[3]) if produto[3] is not None else None,
              "vlrDensidade": float(produto[4]) if produto[4] is not None else None
          })
    
    return produto_formatado
    
# Consulta para obter todos os produtos com movimentações
@produto_bp.route("/relatorioProdutos", methods=["GET"])
def relatorio_produtos():
    datInicial = request.args.get("dataInicial")  # Opcional
    datFinal = request.args.get("dataFinal")      # Opcional

    sql = """     
        SELECT A.codProduto,
               A.nomProduto,
               A.nomLista,
               A.perPureza,
               A.vlrDensidade,
               B.seqItem,
               TO_CHAR(C.datMovto, 'DD-MM-YYYY') AS datMovto,
               C.idtTipoMovto,
               C.qtdEstoque,
               C.txtJustificativa,
               D.codLaboratorio,
               D.nomLocal              
          FROM Produto A
          JOIN ProdutoItem B
            ON B.codProduto = A.codProduto
          JOIN MovtoEstoque C
            ON C.codProduto = B.codProduto
           AND C.SeqItem = B.SeqItem
          JOIN LocalEstocagem D
            ON D.codLaboratorio = C.codLaboratorio
         WHERE A.idtAtivo
         ORDER BY 1, 6
    """
    params = None
    if datInicial and datFinal: 
        sql += ' AND C.datMovto >= %s AND C.datMovto <= %s'
        params = (datInicial, datFinal,)
    
    try:
        db = Db()
        produtos = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)
   
    if not produtos:
         return util.formataAviso("Nenhum produto encontrado!") 

    produtos_dict = {}
    qtdTotal = 0
    for row in produtos:
        (
        codProduto, nomProduto, nomLista, perPureza, vlrDensidade,
        seqItem, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa, codLaboratorio, nomLocal 
        ) = row

    if codProduto not in produtos_dict:
        produtos_dict[codProduto] = {
            "produto": {
                "codProduto": codProduto,
                "nomProduto": nomProduto,
                "nomLista": nomLista,
                "perPureza": perPureza,
                "vlrDensidade": vlrDensidade,
                "qtdTotal": qtdTotal
            },
            "itens": {}
        }

    itens_dict = produtos_dict[codProduto]["itens"]

    if seqItem not in itens_dict:
        itens_dict[seqItem] = {
            "seqItem": seqItem,
            "movimentacoes": []
        }

    itens_dict[seqItem]["movimentacoes"].append({
        "datMovto": datMovto,
        "idtTipoMovto": idtTipoMovto,
        "qtdEstoque": float(qtdEstoque),
        "txtJustificativa": txtJustificativa,
        "nomLocal": nomLocal,
        "codLaboratorio": codLaboratorio
    })

    # Agora converte para lista e formata como saída final
    saida_final = []

    for produto in produtos_dict.values():
        produto_formatado = {
            "produto": produto["produto"],
            "itens": list(produto["itens"].values())
        }
    saida_final.append(produto_formatado)
     
    return saida_final

@produto_bp.route("/obterProdutosNaoImplantadosPorLocal/<string:codCampus>/<string:codUnidade>/<string:codPredio>/<string:codLaboratorio>", methods=["GET"])
def produtos_implantados_por_laboratorio(codCampus, codUnidade, codPredio, codLaboratorio):

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
               A.vlrDensidade
          FROM Produto A
         WHERE A.idtAtivo
           AND codProduto not in (SELECT distinct codProduto 
                                    FROM MovtoEstoque B
                                   WHERE B.codProduto = A.codProduto
                                     AND B.codCampus = %s
                                     AND B.codUnidade = %s
                                     AND B.codPredio = %s
                                     AND B.codLaboratorio = %s)
                                 ;
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
              "vlrDensidade": row[4]
          }
          for row in produtos
      ]

    return (produto_formatado)

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

    codProduto = data.get("codProduto")
    nomProduto = data.get("nomProduto")
    nomLista = data.get("nomLista")
    perPureza = data.get("perPureza"),
    vlrDensidade = data.get("vlrDensidade"), 
    uniMedida = data.get("uniMedida")
  
    valida = Valida()
    valida.codProduto(codProduto)
    valida.nomProduto(nomProduto)
    valida.nomLista(nomLista)
    valida.perPureza(perPureza)
    valida.vlrDensidade(vlrDensidade)
    valida.uniMedida(uniMedida)
  
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        INSERT INTO Produto (codProduto, nomProduto, nomLista, perPureza, vlrDensidade, uniMedida) 
            VALUES (%s, %s, %s, %s, %s, %s)
    """
    params = (codProduto, nomProduto, nomLista, perPureza, vlrDensidade, uniMedida, )

    db = Db()
    try: 
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)

# Rota para atualizar um produto e os orgaosControladores
@produto_bp.route("/produtos/<int:codProduto>", methods=["PUT"])
def update_produto(codProduto):
    data = request.get_json()

    codProduto = data.get("codProduto")
    nomProduto = data.get("nomProduto")
    nomLista = data.get("nomLista")
    perPureza = data.get("perPureza"),
    vlrDensidade = data.get("vlrDensidade"), 
    uniMedida = data.get("uniMedida")
 
    valida = Valida()
    valida.codProduto(codProduto)  
    valida.nomProduto(nomProduto)
    valida.nomLista(nomLista)
    valida.perPureza(perPureza)
    valida.vlrDensidade(vlrDensidade)
    valida.uniMedida(uniMedida)
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        UPDATE Produto 
            SET nomProduto = %s,
                nomLista = %s,
                perPureza = %s,
                vlrDensidade = %s,
                uniMedida = %
          WHERE codProduto = %s
    """
    params = (nomProduto, nomLista, perPureza, vlrDensidade, uniMedida, codProduto,)

    db = Db()
    try:   
        resultado = db.execSql(sql, params, Mode.BEGIN)
    except Exception as e:
        return db.getErro(e)
    if resultado != '':
        return resultado
        
    sql = """
        "DELETE FROM ProdutoOrgaoControle
          WHERE codProduto = %s
    """
    params = (codProduto,)
            
    try:   
        resultado = db.execSql(sql, params, Mode.DEFAULT)
    except Exception as e:
        return db.getErro(e)
    if resultado != '':
        return resultado

    sql = """
        INSERT INTO ProdutoOrgaoControle
          (codProduto, codOrgaoControle)
                    VALUES
    """
    
    valores = [] 
    params = []
    # juntando todos os orgaos para fazer insert único
    for orgaoControle in data["orgaosControle"]:
        codOrgaoControle = orgaoControle.get('codOrgaoControle')
       
        valores.append('(%s, %s,)')
        params += [codProduto, codOrgaoControle]        

    sql += ', '.join(valores)
    
    try:   
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

    sql = """
        DELETE FROM Produto
         WHERE codProduto = %s
    """
    params = (codProduto,)

    try:
        db = Db()   
        return db.execSql(sql, params, Mode.COMMIT)
    except Exception as e:
        return db.getErro(e)


@produto_bp.route("/atualizar_estoque", methods=["POST"])
def atualizar_estoque():
    data = request.get_json()
    
    for item in data:
        codCampus = item.get("codCampus")
        codUnidade = item.get("codUnidade")
        codPredio = item.get("codPredio")
        codLaboratorio = item.get("codLaboratorio")
                        
        for produto in item.values():
            if isinstance(produto, dict):  # Filtrar apenas os objetos produto
                codProduto = produto["codProduto"]
                idNFe = produto["idNFe"]
                datValidade = produto["datValidade"]
                datMovto = produto["datMovto"]
                idtTipoMovto = produto["idtTipoMovto"]
                qtdEstoque = produto["qtdEstoque"]
                txtJustificativa = produto["txtJustificativa"]

                    # Inserir no ProdutoItem
                sql = """
                        INSERT INTO ProdutoItem (codProduto,  idNFe, datValidade, seqEmbalagem)
                        VALUES (%s, %s, %s, %s, %s)
                        ON CONFLICT (codProduto, seqItem) DO UPDATE
                        SET idNFe = EXCLUDED.idNFe,
                            datValidade = EXCLUDED.datValidade
                    """, (codProduto, idNFe, datValidade, 'UNID')

                    # Inserir no MovtoEstoque
                sql = """
                        INSERT INTO MovtoEstoque (codProduto, seqItem, codCampus, codUnidade, codPredio, 
                                                  codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificatica)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (codProduto, seqItem, codUnidade, codPredio, codLaboratorio) DO UPDATE
                        SET datMovto = EXCLUDED.datMovto,
                            idtTipoMovto = EXCLUDED.idtTipoMovto,
                            qtdEstoque = EXCLUDED.qtdEstoque,
                            txtJustificatica = EXCLUDED.txtJustificatica
                    ", (codProduto, seqItem, codCampus, codUnidade, codPredio, 
                          codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa))
                    """





# Rota para atualizar o inventario do estoque
@produto_bp.route("/confirmaInventario", methods=["POST"])
def confirma_inventario():
    data = request.get_json()

    mes = data.get("mes")
    ano = data.get("ano")
    codCampus = data.get("codCampus")
    codUnidade = data.get("codUnidade")
    codPredio = data.get("codPredio")
    codLaboratorio = data.get("codLaboratorio")

    valida = Valida()
    valida.mes(mes)
    valida.ano(ano)
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    valida.codPredio(codPredio)
    valida.codLaboratorio(codLaboratorio)  
    if valida.temMensagem():
        return valida.getMensagens()

    itens = data.get("itens")

    sql = """
        INSERT INTO MovtoEstoque
           (codProduto, seqItem, codCampus, codUnidade, codPredio, 
            codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    datMovto = ultimo_dia_do_mes(mes, ano)
        
    for item in itens:
            codProduto = item.get("codProduto")
            seqItem = item.get("seqItem")
            qtdEstoque = item.get("qtdEstoque")

            # Dados fixos (simulados para este exemplo)
            idtTipoMovto = "IN"
            txtJustificativa = ""

            # Inserir no MovtoEstoque
            sql = """
                INSERT INTO MovtoEstoque (codProduto, seqItem, codCampus, codUnidade, codPredio, 
                                          codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (codProduto, seqItem, codUnidade, codPredio, codLaboratorio) DO UPDATE
                SET datMovto = EXCLUDED.datMovto,
                    qtdEstoque = EXCLUDED.qtdEstoque,
                    txtJustificativa = EXCLUDED.txtJustificativa;
            """
            params = (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)

    try:
        db = Db()   
        return db.execSql(sql, params, Mode.COMMIT)
    except Exception as e:
        return db.getErro(e)


@produto_bp.route("/atualizarInventarioBySequencia", methods=["POST"])
def atualizar_inventario_by_sequencia():
    data = request.get_json()

    codProduto = data.get("codProduto")
    seqItem = data.get("seqItem")
    qtdEstoque = data.get("qtdEstoque")
    codCampus = data.get("codCampus")
    codUnidade = data.get("codUnidade")
    codPredio = data.get("codPredio")
    codLaboratorio = data.get("codLaboratorio")
    idtTipoMovto = data.get("idtTipoMovto")  # Agora é dinâmico e recebido pelo JSON
    txtJustificativa = data.get("txtJustificativa", "Atualização de inventário") 

    valida = Valida()
    valida.codProduto(codProduto)
    valida.ano(qtdEstoque)
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    valida.codPredio(codPredio)
    valida.codLaboratorio(codLaboratorio)
    valida.idtTipoMovto(idtTipoMovto)  
    if valida.temMensagem():
        return valida.getMensagens()

    
    # Define a data do movimento como a data atual
    datMovto = datetime.now()

    sql = """
        INSERT INTO MovtoEstoque
           (codProduto, seqItem, codCampus, codUnidade, codPredio, 
            codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    params = (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa,)

    try:
        db = Db()   
        return db.execSql(sql, params, Mode.COMMIT)
    except Exception as e:
        return db.getErro(e)
 


#Rota para adiconar 1 produto no laboratorio
@produto_bp.route("/adicionar_produto/<codProduto>", methods=["POST"])
def adicionar_produto(codProduto):
    data = request.get_json()

    codProduto = data.get('codProduto')
    #seqItem = data.get('seqItem)
    codCampus = data.get('codCampus')
    codUnidade = data.get('codUnidade')
    codLaboratorio = data.get('codLaboratorio')
    codPredio = data.get('codPredio')
    datMovto = data.get('datMovto')
    qtdEstoque = data.get('qtdEstoque')
    idtTipoMovto = data.get('idtTipoMovto')
    seqEmbalagem = data.get('seqEmbalagem')
    datValidade = data.get('datValidade')
    txtJustificativa = data.get('txtJustificativa')

    valida = Valida()
    valida.codCampus(codCampus)  
    valida.codUnidade(codUnidade)
    valida.codLaboratorio(codLaboratorio)
    valida.codPredio(codPredio)
    valida.datMovto(datMovto)
    #valida.qtdEstoque(datEstoque)
    valida.idtTipoMovto(idtTipoMovto)
    valida.seqEmbalagem(seqEmbalagem)
    #valida.datuniMedida(uniMedida)
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """  
        INSERT INTO ProdutoItem
           (codProduto, seqItem, idNFe, datValidade, seqEmbalagem)
          VALUES
            (%s, %s, %s, %s, %s)
    """
    params = (codProduto, seqItem, None, datValidade, seqEmbalagem)

    

    sql = """
        INSERT INTO MovtoEstoque
           (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, 
            datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
          VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    params = (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio,
              datMovto, idtTipoMovto, qtdEstoque, txtJustificativa,)


    """

        SELECT 1 FROM Produto WHERE codProduto = %s", (codProduto,))
        produto_existe = cursor.fetchone()
        if not produto_existe:
            return jsonify({"error": f"Produto com código {codProduto} não encontrado."}), 404

        # Buscar o próximo seqItem disponível
        cursor.execute("SELECT COALESCE(MAX(seqItem), 0) + 1 FROM ProdutoItem WHERE codProduto = %s", (codProduto,))
        seqItem = cursor.fetchone()[0]
        print(f"Próximo seqItem calculado para o Produto {codProduto}: {seqItem}")

        # Inserir no ProdutoItem
        cursor.execute(
            INSERT INTO ProdutoItem (codProduto, seqItem, idNFe, datValidade, seqEmbalagem)
            VALUES (%s, %s, %s, %s, %s)
         
        params = (codProduto,  None, data["datValidade"], data["seqEmbalagem"]))
        

        # Inserir no MovtoEstoque
        cursor.execute(
            INSERT INTO MovtoEstoque (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, 
                                      datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        , (codProduto, seqItem, data["codCampus"], data["codUnidade"], data["codPredio"],
              data["codLaboratorio"], data["datMovto"], data["idtTipoMovto"], data["qtdEstoque"], data["txtJustificativa"]))
        print(f"MovtoEstoque inserido: codProduto={codProduto}, seqItem={seqItem}")

        # Finalizar transação
        conn.commit()
        cursor.close()
        conn.close()
        print("Conexão com o banco de dados fechada.")
        return jsonify({"message": "Produto adicionado com sucesso"}), 201

    except Exception as e:
        print(f"Erro durante a execução: {str(e)}")
        return jsonify({"error": str(e)}), 500
    """

#Rota para atualizar um inventario
@produto_bp.route("/atualizarQuantidadeProdutosLaboratorio", methods=["POST"])
def atualizar_quantidade_produtos_laboratorio():
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

            print(f"codProduto {codProduto}")
            print(f"seqItem  {seqItem}")
            print(f"qtdEstoque {qtdEstoque}")
            print(f"qtdNova {qtdNova}")

            # Determina o tipo de ajuste com base na diferença
            if diferenca > 0:
                idtTipoMovto_ajuste = "AE"  # Ajuste Entrada
            else:
                if diferenca < 0:
                    idtTipoMovto_ajuste = "AC"  # Ajuste Consumo
                else:
                    idtTipoMovto_ajuste = None

            if idtTipoMovto_ajuste: 
                params.extend([codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio,
                            datMovto, idtTipoMovto_ajuste, diferenca, txtJustificativa])
                movto.append("(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")

            idtTipoMovto_ajuste = "IN" 
            params.extend([codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio,
                        datMovto, idtTipoMovto_ajuste, qtdNova, txtJustificativa])
            movto.append("(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
    
            print(f"params  {params}")
            print(f"movto  {movto}")
    
        print("salvar")
        # 2. Inserção em lote para MovtoEstoque
        #if len(params) != len(movto):
        #    print(f"Número de placeholders {len(movto)} e params {len(params)} diferem")
        #    return util.formataAviso(f"Número de placeholders {len(movto)} e params {len(params)} diferem")

        sql = f"""
            INSERT INTO MovtoEstoque (
                codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio,
                datMovto, idtTipoMovto, qtdEstoque, txtJustificativa
            ) VALUES {', '.join(movto)};
        """
        print(f"SQL  {sql}")
    except Exception as e:
        print(f"Erro ao preparar SQL de bloco -> {e}")
        return util.formataAviso(f"Erro ao preparar SQL de bloco -> {e}")


    db = Db()
    try:
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)



@produto_bp.route("/implantarItensLaboratorio", methods=["POST"])
def implantar_itens_laboratorio():
    data = request.get_json()

    produtos = data.get("produtos")  # Lista de produtos com codProduto e seus itens
    codCampus = data.get("codCampus")
    codUnidade = data.get("codUnidade")
    codPredio = data.get("codPredio")
    codLaboratorio = data.get("codLaboratorio")

    print(f"codigo campus {codCampus}")
    print(f"codigo unidade {codUnidade}")
    print(f"codigo Predio {codPredio}")
    print(f"codigo Laboratorio {codLaboratorio}")
 

    valida = Valida()
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    valida.codPredio(codPredio)
    valida.codLaboratorio(codLaboratorio)
    if valida.temMensagem():
        return valida.getMensagens()

    sqlProduto = """
        INSERT INTO ProdutoItem (codProduto, datValidade, seqEmbalagem)
        VALUES (%s, %s, %s)
        RETURNING codProduto, seqItem
    """

    sqlMovto = """
        INSERT INTO MovtoEstoque (
            codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio,
            datMovto, idtTipoMovto, qtdEstoque, txtJustificativa
        ) VALUES
    """
    
    params_movto = []
    values_movto = []

    db = Db()

    primeiro = True
    modo = Mode.BEGIN
    datMovto = date.today().strftime('%Y-%m-%d')

    # 1. Inserir cada ProdutoItem individualmente e capturar seqItem
    for produto in produtos:
        codProduto = produto.get("codProduto")
        
        for item in produto.get("items", []):
            datValidade = item.get("datValidade")
            seqEmbalagem = item.get("seqdEmbalagem")
            qtdEstoque = item.get("qtdEstoque")
            txtJustificativa = item.get("txtJustificativa")

            if qtdEstoque is None or datValidade is None or seqEmbalagem is None:
                continue

            params = (codProduto, datValidade, seqEmbalagem,)
            try:
                if primeiro:
                    primeiro = False
                else:
                    modo = Mode.DEFAULT

                resultado = db.execSql(sqlProduto, params, modo, True)
                seqItem = db.getIdInsert(1)
            except Exception as e:
                print(db.getErro(e))
                return db.getErro(e)
        
            print(f"seqitem {seqItem}")
            print(f"resultado {resultado}")
            

            params_movto.append((codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio,
                                 datMovto, qtdEstoque, txtJustificativa,))
            values_movto.append("(%s, %s, %s, %s, %s, %s, %s, 'IM', %s, %s)")
            print(f"movto  {params_movto}  - {values_movto}")

    # 2. Inserção em lote para MovtoEstoque
    try:
        # Monta SQL final com placeholders
        movto_sql_final = sqlMovto + ", ".join(values_movto)


        print(f"movto  {movto_sql_final}  - {sum(params_movto, ())}")
        return db.execSql(movto_sql_final, sum(params_movto, ()), Mode.COMMIT)
    except Exception as e:
        return db.getErro(e)

@produto_bp.route("/cadastrarProdutos", methods=["POST"])
def cadastrar_produtos():
 data = request.get_json()

 # Validação dos dados recebidos
 if not data or "tipoCadastro" not in data or "codCampus" not in data or "codUnidade" not in data or "codPredio" not in data or "codLaboratorio" not in data or "produtos" not in data:
     return jsonify({"error": "JSON inválido. Deve conter 'tipoCadastro', 'codCampus', 'codUnidade', 'codPredio', 'codLaboratorio' e 'produtos'."}), 400

 tipo_cadastro = data["tipoCadastro"] 
 codCampus = data["codCampus"]
 codUnidade = data["codUnidade"]
 codPredio = data["codPredio"]
 codLaboratorio = data["codLaboratorio"]
 produtos = data["produtos"]  

 try:
     conn = get_connection()
     cursor = conn.cursor()

     
     datMovto = datetime.now().date()

     for produto in produtos:
         codProduto = produto["codProduto"]
         items = produto["items"]  

         
         cursor.execute("""
             SELECT COALESCE(MAX(seqItem), 0)
               FROM ProdutoItem
              WHERE codProduto = %s
         """, (codProduto,))
         ultimo_seq_item = cursor.fetchone()[0]

         for item in items:
             qtd = item["qtd"]
             datValidade = item["validade"]
             seqEmbalagem = item["embalagem"]

             
             seqItem = ultimo_seq_item + 1
             ultimo_seq_item = seqItem

             cursor.execute("""
                 INSERT INTO ProdutoItem (codProduto, seqItem, idNFe, datValidade, seqEmbalagem)
                 VALUES (%s, %s, NULL, %s, %s)
             """, (codProduto, seqItem, datValidade, seqEmbalagem))

             cursor.execute("""
                 INSERT INTO MovtoEstoque (codProduto, seqItem, codCampus, codUnidade, codPredio, 
                                           codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
             """, (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, datMovto, tipo_cadastro, qtd, "Cadastro de produto"))

     conn.commit()
     cursor.close()
     conn.close()

     return jsonify({"message": "Produtos cadastrados com sucesso!"}), 200

 except Exception as e:
     return jsonify({"error": str(e)}), 500


