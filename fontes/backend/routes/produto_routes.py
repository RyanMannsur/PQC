# routes/produto_routes.py
from flask import Blueprint, request, jsonify
from db import get_connection
from datetime import datetime
import calendar
from flask import jsonify
import psycopg2
produto_bp = Blueprint("produto_bp", __name__)

# funcoes privadas
def ultimo_dia_do_mes(mes, ano):
    ultimo_dia = calendar.monthrange(ano, mes)[1]
    return f"{ano}-{mes:02d}-{ultimo_dia:02d}"  # Formato: YYYY-MM-DD

def datUltInventario(codCampus, codUnidade, codPredio, codLaboratorio):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT MAX(datMovto) 
              FROM MovtoEstoque 
             WHERE codCampus = %s
               AND codUnidade = %s
               AND codPredio = %s
               AND codLaboratorio = %s
               AND idtTipoMovto in ('IM', 'IN')
               AND datMovto <= NOW() 
        """
        cursor.execute(query, (codCampus, codUnidade, codPredio, codLaboratorio))
        max_data = cursor.fetchone()[0]  # Pega a data máxima

        cursor.close()
        conn.close()

        return max_data

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_connection():
    """Função para obter a conexão com o banco de dados."""
    return psycopg2.connect(
        dbname="PQC",
        user="postgres",
        password="postgres",
        host="localhost",
        port="5432"
    )

# Rota para listar todos os produtos
@produto_bp.route("/produtos", methods=["GET"])
def get_produtos():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Produto")
    produtos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(produtos)


# Rota para obter um produto e quais são os seus repectivos orgaos de controle
@produto_bp.route("/obterProdutoPorId/<int:codProduto>", methods=["GET"])
def obter_produto(codProduto):
    conn = get_connection()
    cursor = conn.cursor()

    # Buscar o produto na tabela Produto
    cursor.execute("""
        SELECT A.codProduto, A.nomProduto, A.nomLista, A.perPureza, A.vlrDensidade, 
               B.codOrgaoControle, C.nomOrgaoControle
        FROM Produto A
        JOIN ProdutoOrgaoControle B
          ON B.codProduto = A.codProduto
        JOIN OrgaoControle C
          ON C.codOrgaoControle = B.codOrgaoControle
        WHERE A.codProduto = %s
    """, (codProduto,))
    
    produtoControlado = cursor.fetchall()

    if not produtoControlado:
        cursor.close()
        conn.close()
        return jsonify({"error": "Produto não encontrado"}), 404
    
    # Estruturar o JSON de resposta
    produto_dict = {}
    orgaoControle = []

    for index, produto in enumerate(produtoControlado):
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

    cursor.close()
    conn.close()

    return jsonify(produto_dict)

# Rota para obter os Locais de Estocagem que o Usuario é o responsavel
@produto_bp.route("/obterLocaisEstoque/<int:codSiape>", methods=["GET"])
def obter_Locais_Estoque(codSiape):
    conn = get_connection()
    cursor = conn.cursor()

    print(codSiape)
    try:
        cursor.execute("""
            SELECT codCampus, 
                   codUnidade,
                   codPredio,
                   codLaboratorio,
                   nomLocal 
              FROM LocalEstocagem        
             WHERE codSiapeResponsavel = %s 
             ORDER BY nomLocal           
        """, (codSiape,))
        locais = cursor.fetchall()
        cursor.close()
        conn.close()

        if locais:
            return jsonify(locais)
        return jsonify({"message": "Usuário não é responsável por nenhum Local de Estogem de Produtos Químicos Controlados"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@produto_bp.route("/obterProdutosPorLaboratorio/<string:codCampus>/<string:codUnidade>/<string:codPredio>/<string:codLaboratorio>", methods=["GET"])
def obter_produtos_por_laboratorio(codCampus, codUnidade, codPredio, codLaboratorio):
    conn = get_connection()

    print (codCampus, codUnidade, codPredio, codLaboratorio)
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT A.codProduto, A.nomProduto, A.nomLista, A.perPureza, A.vlrDensidade  
              FROM Produto A
              JOIN MovtoEstoque B
                ON B.codProduto = A.codProduto        
             WHERE B.codCampus = %s 
               AND B.codUnidade = %s
               AND B.codPredio = %s
               AND B.codLaboratorio = %s
        """, (codCampus, codUnidade, codPredio, codLaboratorio))
        produtos = cursor.fetchall()
        cursor.close()
        conn.close()

        if produtos:
            return jsonify(produtos)
        return jsonify({"message": "Nenhum produto encontrado no local de armazenagem corrente do usuário"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@produto_bp.route("/quantidadeProdutosImplantados/<string:codCampus>/<string:codUnidade>/<string:codPredio>/<string:codLaboratorio>", methods=["GET"])
def verifica_local_estocagem_Ja_implantado(codCampus, codUnidade, codPredio, codLaboratorio):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT count(*)  
              FROM MovtoEstoque 
             WHERE codCampus = %s 
               AND codUnidade = %s
               AND codPredio = %s
               AND codLaboratorio = %s
               AND idtTipoMovto = 'IM'
        """, (codCampus, codUnidade, codPredio, codLaboratorio))
        qtdProdutosImplantados = cursor.fetchone()
        cursor.close()
        conn.close()
   
        return jsonify(qtdProdutosImplantados)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

##################################################################
@produto_bp.route("/obterEstoqueLocalEstocagem/<string:codCampus>/<string:codUnidade>/<string:codPredio>/<string:codLaboratorio>", methods=["GET"])
def obter_estoque_local_estocagem(codCampus, codUnidade, codPredio, codLaboratorio):
   
    try:
        query = """
            SELECT A.codProduto,
                   A.nomProduto,
                   A.perPureza,
                   A.vlrDensidade,
                   C.datValidade,
                   B.seqItem,
                   sum(coalesce(B.qtdEstoque, 0))
              FROM Produto A
              LEFT JOIN MovtoEstoque B
                ON B.codProduto = A.codProduto
              LEFT JOIN ProdutoItem C
                ON C.codProduto = B.codProduto
               AND C.SeqItem = B.SeqItem
             WHERE B.codCampus = %s
               AND B.codUnidade = %s
               AND B.codPredio = %s
               AND B.codLaboratorio = %s
               AND B.datMovto >= %s
               AND B.idtTipoMovto in ('IM', 'IN', 'TE', 'TS', 'EC', 'ED', 'AC', 'AE')
             GROUP BY 1,2,3,4,5,6 
            HAVING sum(coalesce(B.qtdEstoque, 0)) <> 0
            """
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(query, (codCampus, codUnidade, codPredio, codLaboratorio,
                               datUltInventario(codCampus, codUnidade, codPredio, codLaboratorio)))
        produtos = cursor.fetchall()

        cursor.close()
        conn.close()

        # Convertendo resultado para JSON
        if produtos:
            resultado = [
                {
                    "codProduto": p[0],
                    "nomProduto": p[1],
                    "perPureza": p[2],
                    "vlrDensidade": p[3],
                    "datValidade": p[4],
                    "seqItem": p[5],
                    "qtdEstoque": float(p[5]),  # Convertendo Decimal para float
                    "qtdEstoqueInventario": 0
                }
                for p in produtos
            ]
            return jsonify(resultado)
        else:
            return jsonify({"message": "Nenhum produto encontrado"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


####################
    
#------------------------------------------------------------------------------
# Se não houver item do produto no local de estocagem ele vai aparecer com qtdEstoque = 0
# Assim será inserido desde que o valor de estoque informado for diferente de zero
#---------------------------------------------------------------------------------    
@produto_bp.route("/obterEstoqueLocal", methods=["GET"])
def obter_Estoque_Local_Implantacao():
    data = request.get_json()

    # Verifica se os dados necessários estão presentes
    if not data or "codCampus" not in data or "codUnidade" not in data or "codPredio" not in data not in data or "codLaboratorio":
        return jsonify({"error": "JSON inválido. Deve conter 'codCampus', 'codUnidade', 'codPredio' e 'codLaboratorio'."}), 400

    codCampus = data["codCampus"]
    codUnidade = data["codUnidade"]
    codPredio = data["codPredio"]
    codLaboratorio = data["codLaboratorio"]
    datUltInventario = data["datUltInventario"]

    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT A.codProduto,
                   A.nomProduto,
                   A.perPureza,
                   A.vlrDensidade,
                   C.datValidade,
                   B.seqItem,
                   sum(coalesce(B.qtdEstoque, 0))
              FROM Produto A
              LEFT JOIN MovtoEstoque B
                ON B.codProduto = A.codProduto
              LEFT JOIN ProdutoItem C
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
       
        cursor.execute(query, (codCampus, codUnidade, codPredio, codLaboratorio, datUltInventario))
        produtos = cursor.fetchall()

        cursor.close()
        conn.close()

        # Convertendo resultado para JSON
        if produtos:
            resultado = [
                {
                    "codProduto": p[0],
                    "nomProduto": p[1],
                    "vlrPureza": p[2],
                    "vlrDensidade": p[3],
                    "datValidade": p[4],
                    "seqItem": p[5],
                    "qtdEstoque": float(p[5])  # Convertendo Decimal para float
                }
                for p in produtos
            ]
            return jsonify(resultado)
        else:
            return jsonify({"message": "Nenhum produto encontrado"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500



#------------------------------------------------------------------------------
# rota para atualizar inventario
#---------------------------------------------------------------------------------    
@produto_bp.route("/obterEstoqueLocalImplantacao", methods=["GET"])
def obter_estoque_local_implantacao():
    data = request.get_json()

    # Verifica se os dados necessários estão presentes
    if not data or "codCampus" not in data or "codUnidade" not in data or "codPredio" not in data not in data or "codLaboratorio":
        return jsonify({"error": "JSON inválido. Deve conter 'codCampus', 'codUnidade', 'codPredio' e 'codLaboratorio'."}), 400

    codCampus = data["codCampus"]
    codUnidade = data["codUnidade"]
    codPredio = data["codPredio"]
    codLaboratorio = data["codLaboratorio"]
    datUltInventario = data["datUltInventario"]

    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT A.codProduto,
                   A.nomProduto,
                   A.perPureza,
                   A.vlrDensidade,
                   C.datValidade,
                   B.seqItem,
                   sum(coalesce(B.qtdEstoque, 0))
              FROM Produto A
              LEFT JOIN MovtoEstoque B
                ON B.codProduto = A.codProduto
              LEFT JOIN ProdutoItem C
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
       
        cursor.execute(query, (codCampus, codUnidade, codPredio, codLaboratorio, datUltInventario))
        produtos = cursor.fetchall()

        cursor.close()
        conn.close()

        # Convertendo resultado para JSON
        if produtos:
            resultado = [
                {
                    "codProduto": p[0],
                    "nomProduto": p[1],
                    "vlrPureza": p[2],
                    "vlrDensidade": p[3],
                    "datValidade": p[4],
                    "seqItem": p[5],
                    "qtdEstoque": float(p[5])  # Convertendo Decimal para float
                }
                for p in produtos
            ]
            return jsonify(resultado)
        else:
            return jsonify({"message": "Nenhum produto encontrado"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Rota para adicionar um novo produto
@produto_bp.route("/produtos", methods=["POST"])
def add_produto():
    data = request.get_json()
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO Produto (codProduto, nomProduto, nomLista, perPureza, vlrDensidade, uniMedida) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (data["codProduto"], data["nomProduto"], data["nomLista"], data.get("perPureza"), data.get("vlrDensidade"), data.get("uniMedida")))
        conn.commit()
        return jsonify({"message": "Produto inserido com sucesso"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Rota para atualizar um produto e os orgaosControladores
@produto_bp.route("/produtos/<int:codProduto>", methods=["PUT"])
def update_produto(codProduto):
    data = request.get_json()
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Atualiza os dados do Produto
        cursor.execute("""
            UPDATE Produto 
            SET nomProduto = %s, nomLista = %s, perPureza = %s, vlrDensidade = %s
            WHERE codProduto = %s
        """, (data["nomProduto"], data["nomLista"], data.get("perPureza"), data.get("vlrDensidade"), codProduto))
        
        # Verifica se o produto foi atualizado
        if cursor.rowcount == 0:
            conn.rollback()
            return jsonify({"error": "Produto não encontrado"}), 404

        # Atualizar os órgãos de controle (se houver no JSON)
        if "orgaosControle" in data:
            # Remove órgãos de controle antigos
            cursor.execute("DELETE FROM ProdutoOrgaoControle WHERE codProduto = %s", (codProduto,))
            
            # Insere os novos órgãos de controle
            for codOrgaoControle in data["orgaosControle"]:
                cursor.execute("""
                    INSERT INTO ProdutoOrgaoControle (codProduto, codOrgaoControle)
                    VALUES (%s, %s)
                """, (codProduto, codOrgaoControle))

        # Confirma as alterações no banco de dados
        conn.commit()
        return jsonify({"message": "Produto atualizado com sucesso"})

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# Rota para excluir um produto
@produto_bp.route("/produtos/<int:codProduto>", methods=["DELETE"])
def delete_produto(codProduto):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM Produto WHERE codProduto = %s", (codProduto,))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Produto não encontrado"}), 404
        return jsonify({"message": "Produto excluído com sucesso"})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()



@produto_bp.route("/atualizar_estoque", methods=["POST"])
def atualizar_estoque():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "JSON inválido ou ausente"}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()

        for item in data:
            codCampus = item["codCampus"]
            codUnidade = item["codUnidade"]
            codPredio = item["codPredio"]
            codLaboratorio = item["codLaboratorio"]
                        
            for produto in item.values():
                if isinstance(produto, dict):  # Filtrar apenas os objetos produto

                    cursor.execute("SELECT COALESCE(MAX(seqItem), 1) FROM ProdutoItem WHERE codProduto = %s", (codProduto,))
                    seqItem = cursor.fetchone()[0]

                    codProduto = produto["codProduto"]
                    idNFe = produto["idNFe"]
                    datValidade = produto["datValidade"]
                    datMovto = produto["datMovto"]
                    idtTipoMovto = produto["idtTipoMovto"]
                    qtdEstoque = produto["qtdEstoque"]
                    txtJustificativa = produto["txtJustificativa"]

                    # Inserir no ProdutoItem
                    cursor.execute("""
                        INSERT INTO ProdutoItem (codProduto, seqItem, idNFe, datValidade, codEmbalagem)
                        VALUES (%s, %s, %s, %s, %s)
                        ON CONFLICT (codProduto, seqItem) DO UPDATE
                        SET idNFe = EXCLUDED.idNFe,
                            datValidade = EXCLUDED.datValidade
                    """, (codProduto, seqItem, idNFe, datValidade, 'UNID'))  # codEmbalagem fixo para 'UNID'

                    # Inserir no MovtoEstoque
                    cursor.execute("""
                        INSERT INTO MovtoEstoque (codProduto, seqItem, codCampus, codUnidade, codPredio, 
                                                  codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificatica)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (codProduto, seqItem, codUnidade, codPredio, codLaboratorio) DO UPDATE
                        SET datMovto = EXCLUDED.datMovto,
                            idtTipoMovto = EXCLUDED.idtTipoMovto,
                            qtdEstoque = EXCLUDED.qtdEstoque,
                            txtJustificatica = EXCLUDED.txtJustificatica
                    """, (codProduto, seqItem, codCampus, codUnidade, codPredio, 
                          codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa))


        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Dados inseridos/atualizados com sucesso"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Rota para atualizar o inventario do estoque
@produto_bp.route("/confirmaInventario", methods=["POST"])
def confirma_inventario():
    data = request.get_json()

    # Verifica se os dados necessários estão presentes
    if not data or "mes" not in data or "ano" not in data or "itens" not in data:
        return jsonify({"error": "JSON inválido. Deve conter 'mes', 'ano' e 'itens'."}), 400

    mes = data["mes"]
    ano = data["ano"]
    codCampus = data["codCampus"]
    codUnidade = data["codUnidade"]
    codPredio = data["codPredio"]
    codLaboratorio = data["codLaboratorio"]

    itens = data["itens"]

    # Verifica se a lista de itens não está vazia
    if not isinstance(itens, list) or len(itens) == 0:
        return jsonify({"error": "Lista de itens vazia ou inválida."}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Define a data do movimento como o último dia do mês
        datMovto = ultimo_dia_do_mes(mes, ano)
        
        for item in itens:
            codProduto = item["codProduto"]
            seqItem = item["seqItem"]
            qtdEstoque = item["qtdEstoque"]

            # Dados fixos (simulados para este exemplo)
            idtTipoMovto = "IN"
            txtJustificativa = ""

            # Inserir no MovtoEstoque
            cursor.execute("""
                INSERT INTO MovtoEstoque (codProduto, seqItem, codCampus, codUnidade, codPredio, 
                                          codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (codProduto, seqItem, codUnidade, codPredio, codLaboratorio) DO UPDATE
                SET datMovto = EXCLUDED.datMovto,
                    qtdEstoque = EXCLUDED.qtdEstoque,
                    txtJustificativa = EXCLUDED.txtJustificativa;
            """, (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Inventário confirmado com sucesso"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Rota para selecionar OrgaosControle
@produto_bp.route("/obterOrgaoControle", methods=["GET"])
def obter_orgao_controle():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT codOrgaoControle, nomOrgaoControle FROM OrgaoControle")
    produtos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(produtos)
    conn = get_connection()
    cursor = conn.cursor()
   

@produto_bp.route("/obterLocalEstocagemPorId/<string:codCampus>/<string:codUnidade>/<string:codPredio>/<string:codLaboratorio>", methods=["GET"])
def obter_local_estocagem_por_id(codCampus, codUnidade, codPredio, codLaboratorio):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT codCampus, 
                   codUnidade,
                   codPredio,
                   codLaboratorio,
                   nomLocal 
              FROM LocalEstocagem
             WHERE codCampus = %s
               AND codUnidade = %s
               AND codPredio = %s
               AND codLaboratorio = %s
        """
        cursor.execute(query, (codCampus, codUnidade, codPredio, codLaboratorio))
        local_estocagem = cursor.fetchone()

        cursor.close()
        conn.close()

        if local_estocagem:
            resultado = {
                "codCampus": local_estocagem[0],
                "codUnidade": local_estocagem[1],
                "codPredio": local_estocagem[2],
                "codLaboratorio": local_estocagem[3],
                "nomLocal": local_estocagem[4]
            }
            return jsonify(resultado)
        else:
            return jsonify({"message": "Local de estocagem não encontrado"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
