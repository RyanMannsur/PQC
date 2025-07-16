# routes/produto_routes.py 
from flask import Blueprint, request, jsonify
import calendar, datetime
from datetime import date
produto_bp = Blueprint("produto_bp", __name__)
import sys
from db import Db, Mode
from valida import Valida
import util

# Função auxiliar para validar token
def validar_token(token):
    """Valida se o token existe na base de dados."""
    sql = "SELECT COUNT(*) as count FROM usuario WHERE token = %s"
    params = (token,)
    
    try:
        db = Db()
        result = db.execSql(sql, params, Mode.SELECT)
        return result[0][0] > 0 if result else False
    except Exception:
        return False

# Função para obter laboratórios do usuário por token
def obter_laboratorios_usuario(token):
    """Obtém os laboratórios associados ao token do usuário."""
    sql = """
        SELECT ul.codCampus, 
               ul.codUnidade,
               ul.codPredio,
               ul.codLaboratorio,
               le.nomLocal 
          FROM usuariolocalestocagem ul
          JOIN LocalEstocagem le
            ON le.codCampus = ul.codCampus
           AND le.codUnidade = ul.codUnidade
           AND le.codPredio = ul.codPredio
           AND le.codLaboratorio = ul.codLaboratorio
         WHERE ul.token = %s 
         ORDER BY le.nomLocal           
        """
    params = (token,)
    
    try:
        db = Db()
        return db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return []

# Adicionar endpoint para monitorar migrações
@produto_bp.route("/migrations/status", methods=["GET"])
def get_migrations_status():
    """Endpoint para verificar status das migrações."""
    try:
        import sys
        import os
        # Adicionar o diretório das migrações ao path
        migrations_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'migrations')
        sys.path.append(migrations_path)
        
        from auto_migrate import check_migration_status
        
        status = check_migration_status()
        
        if status is None:
            return jsonify({"error": "Erro ao verificar status das migrações"}), 500
        
        return jsonify({
            "status": "success",
            "data": status
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Erro interno: {str(e)}"}), 500

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
         WHERE "idtAtivo"
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
          AND A."idtAtivo"
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

# ROTAS BASEADAS EM TOKEN

# Rota para obter os Locais de Estocagem que o Usuario é o responsavel (por token)
@produto_bp.route("/obterLocaisEstoque/token/<string:token>", methods=["GET"])
def obter_Locais_Estoque_por_token(token):
    if not validar_token(token):
        return util.formataAviso("Token inválido!")
    
    locais = obter_laboratorios_usuario(token)
    
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

# Rota para consulta em grid (por token)
@produto_bp.route("/consultaPQC/token/<string:token>", methods=["GET"])
def consultarProdutos_por_token(token):
    if not validar_token(token):
        return util.formataAviso("Token inválido!")
    
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
         JOIN usuariolocalestocagem UL
           ON UL.codCampus = D.codCampus
          AND UL.codUnidade = D.codUnidade
          AND UL.codPredio = D.codPredio
          AND UL.codLaboratorio = D.codLaboratorio
         JOIN Campus E
           ON E.codCampus = C.codCampus
         JOIN UnidadeOrganizacional F
           ON F.codUnidade = C.codUnidade
         JOIN LocalEstocagem G
           ON G.codPredio = C.codPredio
          AND G.codLaboratorio = C.codLaboratorio
        WHERE UL.token = %s 
        ORDER By  A.nomProduto, E.nomCampus,  F.nomUnidade, G.nomLocal, B.seqItem
    """
    params = (token,) 

    try:
        db = Db()
        produtos = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    if not produtos:
        return util.formataAviso("Nenhum produto encontrado no inventário!")
        
    return produtos
   
   

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
         WHERE A."idtAtivo"
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
    
    # Buscar o último movimento de inventário (IN) para cada produto/item neste local
    sql_ultimo_inventario = """
        SELECT codProduto, seqItem, MAX(idMovtoEstoque) as ultimo_inventario_id
          FROM MovtoEstoque
         WHERE codCampus = %s
           AND codUnidade = %s
           AND codPredio = %s
           AND codLaboratorio = %s
           AND idtTipoMovto = 'IN'
         GROUP BY codProduto, seqItem
    """
    
    try:
        db = Db()
        params_inventario = (codCampus, codUnidade, codPredio, codLaboratorio,)
        ultimos_inventarios = db.execSql(sql_ultimo_inventario, params_inventario, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    # Construir a consulta principal considerando o último inventário
    # Usar uma única consulta que funciona para ambos os cenários
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
         LEFT JOIN (
            SELECT codProduto, seqItem, MAX(idMovtoEstoque) as ultimo_inventario_id
              FROM MovtoEstoque
             WHERE codCampus = %s
               AND codUnidade = %s
               AND codPredio = %s
               AND codLaboratorio = %s
               AND idtTipoMovto = 'IN'
             GROUP BY codProduto, seqItem
         ) UltInv ON UltInv.codProduto = C.codProduto AND UltInv.seqItem = C.seqItem
        WHERE C.codCampus = %s
          AND C.codUnidade = %s
          AND C.codPredio = %s
          AND C.codLaboratorio = %s
          AND (UltInv.ultimo_inventario_id IS NULL OR C.idMovtoEstoque >= UltInv.ultimo_inventario_id)
        GROUP BY 1,2,3,4,5,6
        HAVING sum(C.qtdEstoque) > 0
        ORDER By 2, 5
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
        qtdEstoque = produto[6]

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
            "qtdEstoque": float(qtdEstoque),
        })

    return list(dictProduto.values())
   
#Rota para obter os produtos de um local
@produto_bp.route("/buscarProdutos", methods=["GET"])
def buscar_produtos_local_estocagem():
    # Ler parâmetros da query string em vez do JSON body
    codCampus = request.args.get("codCampus")
    codUnidade = request.args.get("codUnidade")
    codPredio = request.args.get("codPredio")
    codLaboratorio = request.args.get("codLaboratorio")
    nomProduto = request.args.get("nomProduto")
    perPureza = request.args.get("perPureza")
    vlrDensidade = request.args.get("vlrDensidade")

    # Construir filtros dinâmicos
    filtro = ''
    if nomProduto:
         filtro += f" AND A.nomProduto like '%{nomProduto}%'"

    if perPureza:
         filtro += f" AND A.perPureza = {perPureza}"

    if vlrDensidade:
         filtro += f" AND A.vlrDensidade = {vlrDensidade}"

    # Usar a mesma lógica do inventário para considerar o último 'IN' como marco
    sql = f"""
       SELECT A.codProduto,
              A.nomProduto,
              A.perPureza,
              A.vlrDensidade,
              B.seqItem,
              B.datValidade,
              sum(C.qtdEstoque) as estoque_total
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
               AND idtTipoMovto = 'IN'
             GROUP BY codProduto, seqItem
         ) UltInv ON UltInv.codProduto = C.codProduto AND UltInv.seqItem = C.seqItem
        WHERE A."idtAtivo" = true
          AND C.codCampus = %s
          AND C.codUnidade = %s
          AND C.codPredio = %s
          AND C.codLaboratorio = %s
          AND (UltInv.ultimo_inventario_id IS NULL OR C.idMovtoEstoque >= UltInv.ultimo_inventario_id)
          {filtro}
        GROUP BY 1,2,3,4,5,6
        HAVING sum(C.qtdEstoque) > 0
        ORDER By 2, 6
    """
    params = (codCampus, codUnidade, codPredio, codLaboratorio, codCampus, codUnidade, codPredio, codLaboratorio,)

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
              "datValidade": produto[5].strftime("%Y-%m-%d") if hasattr(produto[5], 'strftime') else str(produto[5]),
              "qtdEstoque": float(produto[6])
        })

    return resultado

@produto_bp.route("/ObterProdutoBYCodigoAndSequencia/<string:codCampus>/<string:codUnidade>/<string:codPredio>/<string:codLaboratorio>/<int:codProduto>/<int:seqItem>", methods=["GET"])
def obter_produto_por_codigo_e_sequencia(codCampus, codUnidade, codPredio, codLaboratorio, codProduto, seqItem):
    # Usar a mesma lógica das outras funções para considerar o último 'IN' como marco
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
         LEFT JOIN (
            SELECT codProduto, seqItem, MAX(idMovtoEstoque) as ultimo_inventario_id
              FROM MovtoEstoque
             WHERE codCampus = %s
               AND codUnidade = %s
               AND codPredio = %s
               AND codLaboratorio = %s
               AND idtTipoMovto = 'IN'
               AND codProduto = %s
               AND seqItem = %s
             GROUP BY codProduto, seqItem
         ) UltInv ON UltInv.codProduto = C.codProduto AND UltInv.seqItem = C.seqItem
        WHERE A.codProduto = %s
          AND B.seqItem = %s
          AND C.codCampus = %s
          AND C.codUnidade = %s
          AND C.codPredio = %s
          AND C.codLaboratorio = %s
          AND (UltInv.ultimo_inventario_id IS NULL OR C.idMovtoEstoque >= UltInv.ultimo_inventario_id)
        GROUP BY 1,2,3,4,5,6
        ORDER By 2, 6
    """
    params = (codCampus, codUnidade, codPredio, codLaboratorio, codProduto, seqItem, codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio,)

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
         WHERE A."idtAtivo"
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
         WHERE A."idtAtivo" = true
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
                                                  codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (codProduto, seqItem, codUnidade, codPredio, codLaboratorio) DO UPDATE
                        SET datMovto = EXCLUDED.datMovto,
                            idtTipoMovto = EXCLUDED.idtTipoMovto,
                            qtdEstoque = EXCLUDED.qtdEstoque,
                            txtJustificativa = EXCLUDED.txtJustificativa
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

    # Converter tipos de dados se necessário
    try:
        codProduto = int(codProduto)
        seqItem = int(seqItem)
        qtdEstoque = float(qtdEstoque)
    except (ValueError, TypeError):
        return util.formataAviso("Erro: codProduto, seqItem e qtdEstoque devem ser números válidos")

    valida = Valida()
    valida.codProduto(codProduto)
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    valida.codPredio(codPredio)
    valida.codLaboratorio(codLaboratorio)
    valida.idtTipoMovto(idtTipoMovto)  
    if valida.temMensagem():
        return valida.getMensagens()

    
    # Define a data do movimento como a data atual
    datMovto = datetime.datetime.now()

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
    valida.idtTipoMovto(idtTipoMovto)
    valida.seqEmbalagem(seqEmbalagem)
    if valida.temMensagem():
        return valida.getMensagens()

    # Buscar o próximo seqItem disponível
    sql_ultimo_seq = """
        SELECT COALESCE(MAX(seqItem), 0) + 1
          FROM ProdutoItem
         WHERE codProduto = %s
    """
    
    try:
        db = Db()
        resultado_seq = db.execSql(sql_ultimo_seq, (codProduto,), Mode.SELECT)
        if isinstance(resultado_seq, list) and resultado_seq:
            seqItem = resultado_seq[0][0]
        else:
            seqItem = 1
            
        # Inserir item do produto
        sql_insert_item = """
            INSERT INTO ProdutoItem (codProduto, seqItem, idNFe, datValidade, seqEmbalagem)
            VALUES (%s, %s, NULL, %s, %s)
        """
        resultado_item = db.execSql(sql_insert_item, (codProduto, seqItem, datValidade, seqEmbalagem))
        if not isinstance(resultado_item, tuple) or resultado_item[1] != 200:
            return resultado_item

        # Inserir movimento de estoque
        sql_insert_movto = """
            INSERT INTO MovtoEstoque (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, 
                                      datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        resultado_movto = db.execSql(sql_insert_movto, (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa))
        if not isinstance(resultado_movto, tuple) or resultado_movto[1] != 200:
            return resultado_movto
            
        return jsonify({"message": "Produto adicionado com sucesso"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
    
        # 2. Inserção em lote para MovtoEstoque
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



@produto_bp.route("/implantarItensLaboratorio", methods=["POST"])
def implantar_itens_laboratorio():
    data = request.get_json()
    
    produtos = data.get("produtos")  # Lista de produtos com codProduto e seus itens
    codCampus = data.get("codCampus")
    codUnidade = data.get("codUnidade")
    codPredio = data.get("codPredio")
    codLaboratorio = data.get("codLaboratorio")

    valida = Valida()
    valida.codCampus(codCampus)
    valida.codUnidade(codUnidade)
    valida.codPredio(codPredio)
    valida.codLaboratorio(codLaboratorio)
    if valida.temMensagem():
        return valida.getMensagens()

    try:
        db = Db()
        datMovto = date.today().strftime('%Y-%m-%d')
        itens_processados = 0  # Contador de itens realmente inseridos

        # Processar cada produto individualmente sem transação global
        for produto in produtos:
            codProduto = produto.get("codProduto")
            
            # Buscar o último seqItem para este produto
            sql_ultimo_seq = """
                SELECT COALESCE(MAX(seqItem), 0)
                  FROM ProdutoItem
                 WHERE codProduto = %s
            """
            resultado_seq = db.execSql(sql_ultimo_seq, (codProduto,), Mode.SELECT)
            if isinstance(resultado_seq, list) and resultado_seq:
                ultimo_seq_item = resultado_seq[0][0]
            else:
                ultimo_seq_item = 0
            
            items = produto.get("items", [])
            
            for item in items:
                
                datValidade = item.get("datValidade")
                codEmbalagem = item.get("codEmbalagem")
                qtdEstoque = item.get("qtdEstoque")
                txtJustificativa = item.get("txtJustificativa", "Implantação")

                # Validar campos obrigatórios
                if qtdEstoque is None or qtdEstoque == 0:
                    continue
                    
                if datValidade is None or datValidade == "":
                    continue
                    
                if codEmbalagem is None or codEmbalagem == "":
                    return jsonify({"error": "Campo codEmbalagem é obrigatório e deve ser enviado pelo frontend"}), 400

                # Incrementar seqItem
                seqItem = ultimo_seq_item + 1
                ultimo_seq_item = seqItem
                
                # Inserir item do produto
                sql_insert_item = """
                    INSERT INTO ProdutoItem (codProduto, seqItem, idNFe, datValidade, codEmbalagem)
                    VALUES (%s, %s, NULL, %s, %s)
                """
                resultado_item = db.execSql(sql_insert_item, (codProduto, seqItem, datValidade, codEmbalagem))
                if not isinstance(resultado_item, tuple) or resultado_item[1] != 200:
                    return resultado_item

                # Inserir movimento de estoque
                sql_insert_movto = """
                    INSERT INTO MovtoEstoque (codProduto, seqItem, codCampus, codUnidade, codPredio, 
                                              codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                resultado_movto = db.execSql(sql_insert_movto, (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, datMovto, 'IM', qtdEstoque, txtJustificativa))
                if not isinstance(resultado_movto, tuple) or resultado_movto[1] != 200:
                    return resultado_movto
                
                # Incrementar contador de itens processados
                itens_processados += 1

        # Validar se pelo menos um item foi processado
        if itens_processados == 0:
            return jsonify({"error": "Nenhum item foi processado. Verifique os dados enviados."}), 400
        
        return jsonify({"message": f"Itens implantados com sucesso! Total: {itens_processados}"}), 200

    except Exception as e:
        return jsonify({"error": f"Erro interno: {str(e)}"}), 500

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
        db = Db()
        
        # Data atual para o movimento
        datMovto = datetime.datetime.now().date()
        itens_processados = 0  # Contador de itens realmente inseridos

        # Processar cada produto individualmente sem transação global
        for produto in produtos:
            codProduto = produto["codProduto"]
            items = produto["items"]  

            # Buscar o último seqItem para este produto
            sql_ultimo_seq = """
                SELECT COALESCE(MAX(seqItem), 0)
                  FROM ProdutoItem
                 WHERE codProduto = %s
            """
            resultado_seq = db.execSql(sql_ultimo_seq, (codProduto,), Mode.SELECT)
            if isinstance(resultado_seq, list) and resultado_seq:
                ultimo_seq_item = resultado_seq[0][0]
            else:
                ultimo_seq_item = 0

            for item in items:
                qtd = item["qtd"]
                datValidade = item.get("validade")
                codEmbalagem = item.get("embalagem")

                # Pular itens com dados inválidos
                if qtd is None or qtd == 0 or codEmbalagem is None:
                    continue

                # Incrementar seqItem
                seqItem = ultimo_seq_item + 1
                ultimo_seq_item = seqItem

                # Inserir item do produto
                sql_insert_item = """
                    INSERT INTO ProdutoItem (codProduto, seqItem, idNFe, datValidade, codEmbalagem)
                    VALUES (%s, %s, NULL, %s, %s)
                """
                resultado_item = db.execSql(sql_insert_item, (codProduto, seqItem, datValidade, codEmbalagem))
                if not isinstance(resultado_item, tuple) or resultado_item[1] != 200:
                    return resultado_item

                # Inserir movimento de estoque
                sql_insert_movto = """
                    INSERT INTO MovtoEstoque (codProduto, seqItem, codCampus, codUnidade, codPredio, 
                                              codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                resultado_movto = db.execSql(sql_insert_movto, (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, datMovto, tipo_cadastro, qtd, "Cadastro de produto"))
                if not isinstance(resultado_movto, tuple) or resultado_movto[1] != 200:
                    return resultado_movto
                
                # Incrementar contador de itens processados
                itens_processados += 1

        # Validar se pelo menos um item foi processado
        if itens_processados == 0:
            return jsonify({"error": "Nenhum item foi processado. Verifique os dados enviados."}), 400

        return jsonify({"message": f"Produtos cadastrados com sucesso! Total: {itens_processados}"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ROTAS DE AUTENTICAÇÃO

@produto_bp.route("/auth/login", methods=["POST"])
def login():
    """Rota para autenticação de usuários."""
    data = request.get_json()
    
    if not data or 'cpf' not in data or 'senha' not in data:
        return jsonify({"error": "CPF e senha são obrigatórios"}), 400
    
    cpf = data['cpf']
    senha = data['senha']
    
    sql = """
        SELECT token, cpf, id, isADM 
        FROM usuario 
        WHERE cpf = %s AND senha = %s
    """
    params = (cpf, senha)
    
    try:
        db = Db()
        result = db.execSql(sql, params, Mode.SELECT)
        
        if not result:
            return jsonify({"error": "Credenciais inválidas"}), 401
        
        usuario = result[0]
        
        # Buscar laboratórios do usuário
        laboratorios = obter_laboratorios_usuario(usuario[0])  # usuario[0] é o token
        
        return jsonify({
            "token": usuario[0],
            "cpf": usuario[1],
            "id": usuario[2],
            "isADM": usuario[3],
            "laboratorios": laboratorios
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@produto_bp.route("/auth/validate", methods=["POST"])
def validate_token():
    """Rota para validar token."""
    data = request.get_json()
    
    if not data or 'token' not in data:
        return jsonify({"error": "Token é obrigatório"}), 400
    
    token = data['token']
    
    if not validar_token(token):
        return jsonify({"error": "Token inválido"}), 401
    
    # Buscar dados do usuário
    sql = """
        SELECT token, cpf, id, isADM 
        FROM usuario 
        WHERE token = %s
    """
    params = (token,)
    
    try:
        db = Db()
        result = db.execSql(sql, params, Mode.SELECT)
        
        if not result:
            return jsonify({"error": "Token inválido"}), 401
        
        usuario = result[0]
        
        # Buscar laboratórios do usuário
        laboratorios = obter_laboratorios_usuario(token)
        
        return jsonify({
            "token": usuario[0],
            "cpf": usuario[1],
            "id": usuario[2],
            "isADM": usuario[3],
            "laboratorios": laboratorios
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
