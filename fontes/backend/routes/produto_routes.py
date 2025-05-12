# routes/produto_routes.py
import os 
from flask import Blueprint, request, jsonify
from db import get_connection
from datetime import datetime
import calendar
from flask import jsonify
import psycopg2
produto_bp = Blueprint("produto_bp", __name__)
from datetime import datetime, timedelta 
import sys
print("Debugging informações...", file=sys.stdout)

# funcoes privadas
def ultimo_dia_do_mes(mes, ano):
    ultimo_dia = calendar.monthrange(ano, mes)[1]
    return f"{ano}-{mes:02d}-{ultimo_dia:02d}" 

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
               AND idtTipoMovto in ('IM', 'IN', 'TE', 'TS', 'EC', 'ED', 'AC', 'AE')
               AND datMovto <= NOW() 
        """
        cursor.execute(query, (codCampus, codUnidade, codPredio, codLaboratorio))
        max_data = cursor.fetchone()[0] 

        cursor.close()
        conn.close()

        return max_data

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_connection():
 """Função para obter a conexão com o banco de dados."""

 DATABASE_URL = os.getenv("DATABASE_URL")
 
 if not DATABASE_URL:
     raise Exception("A variável de ambiente DATABASE_URL não está definida.")


 return psycopg2.connect(DATABASE_URL)

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


#Rota para obter os produtos de um local
@produto_bp.route("/obterEstoqueLocalEstocagem/<string:codCampus>/<string:codUnidade>/<string:codPredio>/<string:codLaboratorio>", methods=["GET"])
def obter_estoque_local_estocagem(codCampus, codUnidade, codPredio, codLaboratorio):
  try:
      conn = get_connection()
      cursor = conn.cursor()

      print(f"Consultando estoque para: Campus={codCampus}, Unidade={codUnidade}, Prédio={codPredio}, Laboratório={codLaboratorio}")

      # Etapa 1: Consulta do inventário inicial com movimentação 'IN' mais recente
      query_inventario_inicial = """
          SELECT 
              PI.codProduto,
              PI.seqItem,
              P.nomProduto,
              P.perPureza,
              P.vlrDensidade,
              PI.datValidade,
              COALESCE((
                  SELECT ME.qtdEstoque
                  FROM MovtoEstoque ME
                  WHERE ME.codProduto = PI.codProduto
                    AND ME.seqItem = PI.seqItem
                    AND ME.codCampus = %s
                    AND ME.codUnidade = %s
                    AND ME.codPredio = %s
                    AND ME.codLaboratorio = %s
                    AND ME.idtTipoMovto = 'IN'
                  ORDER BY ME.idMovtoEstoque DESC
                  LIMIT 1
              ), 0) AS qtd_inventario,
              COALESCE((
                  SELECT ME.idMovtoEstoque
                  FROM MovtoEstoque ME
                  WHERE ME.codProduto = PI.codProduto
                    AND ME.seqItem = PI.seqItem
                    AND ME.codCampus = %s
                    AND ME.codUnidade = %s
                    AND ME.codPredio = %s
                    AND ME.codLaboratorio = %s
                    AND ME.idtTipoMovto = 'IN'
                  ORDER BY ME.idMovtoEstoque DESC
                  LIMIT 1
              ), 0) AS ultimo_id_movto
          FROM ProdutoItem PI
          JOIN Produto P ON PI.codProduto = P.codProduto;
      """

      # Executa a consulta com os parâmetros fornecidos
      cursor.execute(query_inventario_inicial, (codCampus, codUnidade, codPredio, codLaboratorio, codCampus, codUnidade, codPredio, codLaboratorio))
      inventario_inicial = cursor.fetchall()

      resultados = []

      # Etapa 2: Soma todas as movimentações subsequentes ao último 'IN'
      for item in inventario_inicial:
          codProduto = item[0]
          seqItem = item[1]
          nomProduto = item[2]
          perPureza = item[3]
          vlrDensidade = item[4]
          datValidade = item[5]
          qtd_inventario = item[6]  # Quantidade inicial do último 'IN'
          ultimo_id_movto = item[7]  # ID da última movimentação 'IN'

          print(f"Produto={codProduto}, SeqItem={seqItem}, Quantidade Inicial={qtd_inventario}, Último Movto 'IN'={ultimo_id_movto}")

          # Consulta todas as movimentações subsequentes ao último 'IN'
          query_movimentos_subsequentes = """
              SELECT 
                  ME.codProduto,
                  ME.seqItem,
                  SUM(ME.qtdEstoque) AS qtd_movimentos
              FROM MovtoEstoque ME
              WHERE ME.codProduto = %s
                AND ME.seqItem = %s
                AND ME.codCampus = %s
                AND ME.codUnidade = %s
                AND ME.codPredio = %s
                AND ME.codLaboratorio = %s
                AND ME.idMovtoEstoque > %s
              GROUP BY ME.codProduto, ME.seqItem;
          """
          cursor.execute(query_movimentos_subsequentes, 
                         (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, ultimo_id_movto))
          movimentacoes = cursor.fetchone()

          # Soma todas as movimentações subsequentes
          qtd_movimentos = movimentacoes[2] if movimentacoes else 0
          qtd_final = qtd_inventario + qtd_movimentos

          print(f"Produto={codProduto}, SeqItem={seqItem}, Estoque Final={qtd_final}")

          # Adiciona ao resultado
          resultados.append({
              "codProduto": codProduto,
              "nomProduto": nomProduto,
              "perPureza": perPureza,
              "vlrDensidade": vlrDensidade,
              "datValidade": datValidade,
              "seqItem": seqItem,
              "qtdEstoque": float(qtd_final)
          })

      cursor.close()
      conn.close()

      # Retorna os resultados ordenados por codProduto e seqItem
      return jsonify(sorted(resultados, key=lambda x: (x['codProduto'], x['seqItem'])))

  except Exception as e:
      print("Erro ao obter estoque:", str(e))
      return jsonify({"erro": str(e)}), 500

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

@produto_bp.route("/ObterProdutoBYCodigoAndSequencia/<string:codCampus>/<string:codUnidade>/<string:codPredio>/<string:codLaboratorio>/<int:codProduto>/<int:seqItem>", methods=["GET"])
def obter_produto_por_codigo_e_sequencia(codCampus, codUnidade, codPredio, codLaboratorio, codProduto, seqItem):
 try:
     conn = get_connection()
     cursor = conn.cursor()

     print(f"Consultando produto: Campus={codCampus}, Unidade={codUnidade}, Prédio={codPredio}, Laboratório={codLaboratorio}, Produto={codProduto}, SeqItem={seqItem}")

     # Passo 1: Busca o último `IN` para o produto e sequência especificados
     query_ultimo_inventario = """
         SELECT 
             COALESCE((
                 SELECT ME.qtdEstoque
                 FROM MovtoEstoque ME
                 WHERE ME.codProduto = %s
                   AND ME.seqItem = %s
                   AND ME.codCampus = %s
                   AND ME.codUnidade = %s
                   AND ME.codPredio = %s
                   AND ME.codLaboratorio = %s
                   AND ME.idtTipoMovto = 'IN'
                 ORDER BY ME.idMovtoEstoque DESC
                 LIMIT 1
             ), 0) AS qtd_inventario,
             COALESCE((
                 SELECT ME.idMovtoEstoque
                 FROM MovtoEstoque ME
                 WHERE ME.codProduto = %s
                   AND ME.seqItem = %s
                   AND ME.codCampus = %s
                   AND ME.codUnidade = %s
                   AND ME.codPredio = %s
                   AND ME.codLaboratorio = %s
                   AND ME.idtTipoMovto = 'IN'
                 ORDER BY ME.idMovtoEstoque DESC
                 LIMIT 1
             ), 0) AS ultimo_id_movto
     """
     cursor.execute(query_ultimo_inventario, (
         codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio,
         codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio
     ))
     inventario = cursor.fetchone()
     qtd_inventario = inventario[0] if inventario else 0
     ultimo_id_movto = inventario[1] if inventario else 0
     print(f"Último IN encontrado: ID={ultimo_id_movto}, Quantidade IN={qtd_inventario}")

     # Passo 2: Soma todas as movimentações posteriores ao último `IN`
     query_movimentos = """
         SELECT 
             SUM(COALESCE(ME.qtdEstoque, 0)) AS qtd_movimentos
         FROM MovtoEstoque ME
         WHERE 
             ME.codProduto = %s
             AND ME.seqItem = %s
             AND ME.codCampus = %s
             AND ME.codUnidade = %s
             AND ME.codPredio = %s
             AND ME.codLaboratorio = %s
             AND ME.idMovtoEstoque > %s
     """
     cursor.execute(query_movimentos, (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, ultimo_id_movto))
     movimentacoes = cursor.fetchone()
     qtd_movimentos = movimentacoes[0] if movimentacoes and movimentacoes[0] is not None else 0
     print(f"Soma das movimentações após o IN: {qtd_movimentos}")

     # Passo 3: Calcula o estoque final
     qtd_final = qtd_inventario + qtd_movimentos
     print(f"Estoque final calculado: {qtd_final}")

     # Passo 4: Busca informações adicionais sobre o produto
     query_produto = """
         SELECT 
             P.codProduto,
             P.nomProduto,
             P.perPureza,
             P.vlrDensidade,
             PI.datValidade,
             %s AS seqItem
         FROM Produto P
         LEFT JOIN ProdutoItem PI
             ON PI.codProduto = P.codProduto AND PI.seqItem = %s
         WHERE P.codProduto = %s
     """
     cursor.execute(query_produto, (seqItem, seqItem, codProduto))
     produto_info = cursor.fetchone()
     print(f"Informações adicionais do produto: {produto_info}")

     cursor.close()
     conn.close()

     # Monta o resultado final
     if produto_info:
         resultado = {
             "codProduto": produto_info[0],
             "nomProduto": produto_info[1],
             "perPureza": produto_info[2],
             "vlrDensidade": produto_info[3],
             "datValidade": produto_info[4],
             "seqItem": produto_info[5],
             "qtdEstoque": float(qtd_final)  # Convertendo Decimal para float
         }
         return jsonify(resultado)
     else:
         return jsonify({"message": "Produto não encontrado"}), 404

 except Exception as e:
     print("Erro durante a execução:", e)
     return jsonify({"error": str(e)}), 500
     

@produto_bp.route("/atualizarInventarioBySequencia", methods=["POST"])
def atualizar_inventario_by_sequencia():
    data = request.get_json()

    # Verifica se os dados necessários estão presentes
    required_fields = ["codProduto", "seqItem", "qtdEstoque", "codCampus", "codUnidade", "codPredio", "codLaboratorio", "idtTipoMovto"]
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({"error": f"JSON inválido. Campos obrigatórios ausentes: {', '.join(missing_fields)}"}), 400

    codProduto = data["codProduto"]
    seqItem = data["seqItem"]
    qtdEstoque = data["qtdEstoque"]
    codCampus = data["codCampus"]
    codUnidade = data["codUnidade"]
    codPredio = data["codPredio"]
    codLaboratorio = data["codLaboratorio"]
    idtTipoMovto = data["idtTipoMovto"]  # Agora é dinâmico e recebido pelo JSON
    txtJustificativa = data.get("txtJustificativa", "Atualização de inventário")  # Texto padrão caso não seja enviado

    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Define a data do movimento como a data atual
        datMovto = datetime.now()

        # Inserir no MovtoEstoque com o tipo de movimentação dinâmico
        cursor.execute("""
            INSERT INTO MovtoEstoque (codProduto, seqItem, codCampus, codUnidade, codPredio, 
                                      codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Inventário atualizado com sucesso"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@produto_bp.route("/buscarProdutos", methods=["GET"])
def buscar_produtos():
 codCampus = request.args.get("codCampus")
 codUnidade = request.args.get("codUnidade")
 codPredio = request.args.get("codPredio")
 codLaboratorio = request.args.get("codLaboratorio")
 nomeProduto = request.args.get("nomeProduto", "")
 pureza = request.args.get("pureza", "")
 densidade = request.args.get("densidade", "")

 try:
     conn = get_connection()
     cursor = conn.cursor()

     print(f"Consultando inventário para local: Campus={codCampus}, Unidade={codUnidade}, Prédio={codPredio}, Laboratório={codLaboratorio}")
     print(f"Filtros adicionais aplicados: nomeProduto={nomeProduto}, pureza={pureza}, densidade={densidade}")

     # Primeira consulta: Obtém os dados de inventário com filtros opcionais
     query_ultimo_inventario = """
         SELECT 
             PI.codProduto,
             PI.seqItem,
             P.nomProduto,
             P.perPureza,
             P.vlrDensidade,
             PI.datValidade,
             COALESCE((
                 SELECT ME.qtdEstoque
                 FROM MovtoEstoque ME
                 WHERE ME.codProduto = PI.codProduto
                   AND ME.seqItem = PI.seqItem
                   AND ME.codCampus = %s
                   AND ME.codUnidade = %s
                   AND ME.codPredio = %s
                   AND ME.codLaboratorio = %s
                   AND ME.idtTipoMovto = 'IN'
                 ORDER BY ME.idMovtoEstoque DESC
                 LIMIT 1
             ), 0) AS qtd_inventario,
             COALESCE((
                 SELECT ME.idMovtoEstoque
                 FROM MovtoEstoque ME
                 WHERE ME.codProduto = PI.codProduto
                   AND ME.seqItem = PI.seqItem
                   AND ME.codCampus = %s
                   AND ME.codUnidade = %s
                   AND ME.codPredio = %s
                   AND ME.codLaboratorio = %s
                   AND ME.idtTipoMovto = 'IN'
                 ORDER BY ME.idMovtoEstoque DESC
                 LIMIT 1
             ), 0) AS ultimo_id_movto
         FROM ProdutoItem PI
         JOIN Produto P ON PI.codProduto = P.codProduto
         WHERE 
             (%s = '' OR P.nomProduto ILIKE %s)
             AND (%s = '' OR P.perPureza::text ILIKE %s)
             AND (%s = '' OR P.vlrDensidade::text ILIKE %s)
         ORDER BY PI.codProduto, PI.seqItem;
     """

     # Executa a consulta com os parâmetros fornecidos
     cursor.execute(query_ultimo_inventario, (
         codCampus, codUnidade, codPredio, codLaboratorio,
         codCampus, codUnidade, codPredio, codLaboratorio,
         nomeProduto, f'%{nomeProduto}%',
         pureza, f'%{pureza}%',
         densidade, f'%{densidade}%'
     ))
     inventario = cursor.fetchall()
     print("Resultado da consulta de inventário (último IN):", inventario)

     resultados = []

     # Segunda consulta: Obtém todas as movimentações relevantes com base na lógica do último `IN`
     query_movimentos = """
         SELECT 
             SUM(ME.qtdEstoque) AS qtd_movimentos
         FROM MovtoEstoque ME
         WHERE 
             ME.codCampus = %s
             AND ME.codUnidade = %s
             AND ME.codPredio = %s
             AND ME.codLaboratorio = %s
             AND ME.codProduto = %s
             AND ME.seqItem = %s
             AND ME.idMovtoEstoque > %s
     """

     for item in inventario:
         codProduto = item[0]
         seqItem = item[1]
         nomProduto = item[2]
         perPureza = item[3]
         vlrDensidade = item[4]
         datValidade = item[5]
         qtd_inventario = item[6]  # Valor inicial do inventário
         ultimo_id_movto = item[7]  # Último ID do tipo `IN`

         print(f"Processando Produto={codProduto}, SeqItem={seqItem}, Último IN={ultimo_id_movto}, Quantidade IN={qtd_inventario}")

         # Consulta movimentações relevantes para este produto
         cursor.execute(
             query_movimentos,
             (codCampus, codUnidade, codPredio, codLaboratorio, codProduto, seqItem, ultimo_id_movto),
         )
         movimentacoes = cursor.fetchone()

         # Soma todas as movimentações subsequentes
         qtd_movimentos = movimentacoes[0] if movimentacoes and movimentacoes[0] is not None else 0
         print(f"Soma das movimentações para Produto={codProduto}, SeqItem={seqItem}: {qtd_movimentos}")

         # Calcula o estoque final
         qtd_final = qtd_inventario + qtd_movimentos
         print(f"Estoque final para Produto={codProduto}, SeqItem={seqItem}: Quantidade Final={qtd_final}")

         # Adiciona ao resultado
         resultados.append({
             "codProduto": codProduto,
             "nomProduto": nomProduto,
             "perPureza": perPureza,
             "vlrDensidade": vlrDensidade,
             "datValidade": datValidade,
             "seqItem": seqItem,
             "qtdEstoque": float(qtd_final)
         })

     cursor.close()
     conn.close()

     # Retorna os resultados
     print("Resultado final a ser retornado:", resultados)
     if resultados:
         return jsonify(resultados)
     else:
         return jsonify({"message": "Nenhum produto encontrado"}), 404

 except Exception as e:
     print("Erro durante a execução:", e)
     return jsonify({"error": str(e)}), 500


#Rota para adiconar 1 produto no laboratorio
@produto_bp.route("/adicionar_produto/<codProduto>", methods=["POST"])
def adicionar_produto(codProduto):
    data = request.get_json()

    if not data:
        return jsonify({"error": "JSON inválido ou ausente"}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()
        print(f"Conexão com o banco de dados estabelecida. CodProduto da URL: {codProduto}")

        # Verificar parâmetros obrigatórios no payload
        obrigatorios = ["qtdEstoque", "datMovto", "idtTipoMovto", "codEmbalagem", "datValidade", "codCampus", "codUnidade", "codPredio", "codLaboratorio"]
        for campo in obrigatorios:
            if campo not in data or not data[campo]:
                return jsonify({"error": f"Campo '{campo}' ausente ou vazio."}), 400

        # Verifica se o produto existe no banco
        cursor.execute("SELECT 1 FROM Produto WHERE codProduto = %s", (codProduto,))
        produto_existe = cursor.fetchone()
        if not produto_existe:
            return jsonify({"error": f"Produto com código {codProduto} não encontrado."}), 404

        # Buscar o próximo seqItem disponível
        cursor.execute("SELECT COALESCE(MAX(seqItem), 0) + 1 FROM ProdutoItem WHERE codProduto = %s", (codProduto,))
        seqItem = cursor.fetchone()[0]
        print(f"Próximo seqItem calculado para o Produto {codProduto}: {seqItem}")

        # Inserir no ProdutoItem
        cursor.execute("""
            INSERT INTO ProdutoItem (codProduto, seqItem, idNFe, datValidade, codEmbalagem)
            VALUES (%s, %s, %s, %s, %s)
        """, (codProduto, seqItem, None, data["datValidade"], data["codEmbalagem"]))
        print(f"ProdutoItem inserido: codProduto={codProduto}, seqItem={seqItem}, codEmbalagem={data['codEmbalagem']}")

        # Inserir no MovtoEstoque
        cursor.execute("""
            INSERT INTO MovtoEstoque (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, 
                                      datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (codProduto, seqItem, data["codCampus"], data["codUnidade"], data["codPredio"],
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

#Rota para obter todos laboratorio
@produto_bp.route("/obterTodosLaboratorios", methods=["GET"])
def obter_todos_laboratorios():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT codCampus, codUnidade, codPredio, codLaboratorio, nomLocal 
              FROM LocalEstocagem
        """
        cursor.execute(query)
        laboratorios = cursor.fetchall()

        cursor.close()
        conn.close()

        resultado = [
            {
                "codCampus": lab[0],
                "codUnidade": lab[1],
                "codPredio": lab[2],
                "codLaboratorio": lab[3],
                "nomLocal": lab[4]
            }
            for lab in laboratorios
        ]

        return jsonify(resultado)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#Rota para atualizar um inventario
@produto_bp.route("/atualizarQuantidadeProdutosLaboratorio", methods=["POST"])
def atualizar_quantidade_produtos_laboratorio():
 data = request.get_json()

 # Verifica se os dados necessários estão presentes
 if not data or "produtos" not in data or "codCampus" not in data or "codUnidade" not in data or "codPredio" not in data or "codLaboratorio" not in data:
     return jsonify({"error": "JSON inválido. Deve conter 'produtos', 'codCampus', 'codUnidade', 'codPredio' e 'codLaboratorio'."}), 400

 produtos = data["produtos"]  # Lista de produtos com codProduto, seqItem e qtdEstoque
 codCampus = data["codCampus"]
 codUnidade = data["codUnidade"]
 codPredio = data["codPredio"]
 codLaboratorio = data["codLaboratorio"]

 try:
     conn = get_connection()
     cursor = conn.cursor()

     # Define a data do movimento como a data atual e o dia seguinte
     datMovto = datetime.now().date()  # Data de hoje
     datInventario = datetime.now().date()

     for produto in produtos:
         codProduto = produto["codProduto"]
         seqItem = produto["seqItem"]
         qtdNova = produto["qtdEstoque"]  # Nova quantidade fornecida pelo usuário

         # Valida se já houve movimentações AE ou AC no dia atual
         cursor.execute("""
             SELECT COUNT(*)
               FROM MovtoEstoque
              WHERE codProduto = %s AND seqItem = %s AND codCampus = %s AND codUnidade = %s 
                AND codPredio = %s AND codLaboratorio = %s
                AND datMovto = %s
                AND idtTipoMovto IN ('AE', 'AC')
         """, (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, datMovto))

         movimentacoes_hoje = cursor.fetchone()[0]

         if movimentacoes_hoje > 0:
             return jsonify({"error": f"Já houve movimentações AE ou AC no dia de hoje para o produto {codProduto}, item {seqItem}."}), 400

         # Busca a última movimentação "IN" e soma todas as movimentações subsequentes
         cursor.execute("""
             SELECT COALESCE(MAX(datMovto), '1900-01-01') AS ultima_data_inventario,
                    COALESCE(SUM(CASE WHEN idtTipoMovto = 'IN' THEN qtdEstoque ELSE 0 END), 0) AS qtd_inventario,
                    COALESCE(SUM(CASE WHEN idtTipoMovto != 'IN' THEN qtdEstoque ELSE 0 END), 0) AS qtd_movimentos
               FROM MovtoEstoque
              WHERE codProduto = %s AND seqItem = %s AND codCampus = %s AND codUnidade = %s 
                AND codPredio = %s AND codLaboratorio = %s
         """, (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio))

         resultado = cursor.fetchone()
         ultima_data_inventario = resultado[0]
         qtd_inventario = resultado[1]  # Quantidade registrada na última movimentação "IN"
         qtd_movimentos = resultado[2]  # Soma das movimentações subsequentes

         # Calcula a quantidade atual com base na última movimentação "IN" e nas movimentações subsequentes
         qtdAtual = qtd_inventario + qtd_movimentos

         # Calcula a diferença entre a nova quantidade e a quantidade atual
         diferenca = qtdNova - qtdAtual

         # Determina o tipo de ajuste com base na diferença
         if diferenca > 0:
             idtTipoMovto_ajuste = "AE"  # Ajuste Entrada
         elif diferenca < 0:
             idtTipoMovto_ajuste = "AC"  # Ajuste Consumo
         else:
             # Se não houver diferença, não é necessário criar ajustes
             continue

         # Insere o movimento de ajuste (AE ou AC) com a data de hoje
         cursor.execute("""
             INSERT INTO MovtoEstoque (codProduto, seqItem, codCampus, codUnidade, codPredio, 
                                       codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
         """, (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, datMovto, idtTipoMovto_ajuste, diferenca, "Ajuste de estoque"))

         # Insere o movimento de inventário (IN) para o dia seguinte
         cursor.execute("""
             INSERT INTO MovtoEstoque (codProduto, seqItem, codCampus, codUnidade, codPredio, 
                                       codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
         """, (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, datInventario, "IN", qtdNova, "Atualização de inventário"))

     conn.commit()
     cursor.close()
     conn.close()

     return jsonify({"message": "Movimentações de estoque criadas com sucesso"}), 200

 except Exception as e:
     return jsonify({"error": str(e)}), 500


#Rota para obter produto pelo codigo
@produto_bp.route("/obterProdutoPeloCodigo/<int:codProduto>", methods=["GET"])
def obter_produto_pelo_codigo(codProduto):
  try:
      conn = get_connection()
      cursor = conn.cursor()

      # Consulta SQL para buscar o produto pelo codProduto
      query = """
          SELECT 
              codProduto,
              nomProduto,
              nomLista,
              perPureza,
              vlrDensidade
          FROM Produto
          WHERE codProduto = %s;
      """
      cursor.execute(query, (codProduto,))
      produto = cursor.fetchone()

      cursor.close()
      conn.close()

      # Verifica se o produto foi encontrado
      if produto:
          return jsonify({
              "codProduto": produto[0],
              "nomProduto": produto[1],
              "nomLista": produto[2],
              "perPureza": float(produto[3]) if produto[3] is not None else None,
              "vlrDensidade": float(produto[4]) if produto[4] is not None else None
          }), 200
      else:
          return jsonify({"message": f"Produto com código {codProduto} não encontrado."}), 404

  except Exception as e:
      print("Erro ao buscar produto:", str(e))
      return jsonify({"error": str(e)}), 500


@produto_bp.route("/implantarItensLaboratorio", methods=["POST"])
def implantar_itens_laboratorio():
 data = request.get_json()

 # Verifica se os dados necessários estão presentes
 if not data or "produtos" not in data or "codCampus" not in data or "codUnidade" not in data or "codPredio" not in data or "codLaboratorio" not in data:
     return jsonify({"error": "JSON inválido. Deve conter 'produtos', 'codCampus', 'codUnidade', 'codPredio' e 'codLaboratorio'."}), 400

 produtos = data["produtos"]  # Lista de produtos com codProduto e seus itens
 codCampus = data["codCampus"]
 codUnidade = data["codUnidade"]
 codPredio = data["codPredio"]
 codLaboratorio = data["codLaboratorio"]

 try:
     conn = get_connection()
     cursor = conn.cursor()

     # Define a data do movimento como a data atual
     datMovto = datetime.now().date()

     for produto in produtos:
         codProduto = produto["codProduto"]
         items = produto["items"]  # Lista de itens associados ao produto

         # Busca o maior seqItem já existente para o produto
         cursor.execute("""
             SELECT COALESCE(MAX(seqItem), 0)
               FROM ProdutoItem
              WHERE codProduto = %s
         """, (codProduto,))
         ultimo_seq_item = cursor.fetchone()[0]

         for item in items:
             qtd = item["qtd"]
             datValidade = item["datavalidade"]
             codEmbalagem = item["embalagem"]

             # Incrementa o seqItem para o novo item
             seqItem = ultimo_seq_item + 1
             ultimo_seq_item = seqItem

             # Insere o novo ProdutoItem
             cursor.execute("""
                 INSERT INTO ProdutoItem (codProduto, seqItem, idNFe, datValidade, codEmbalagem)
                 VALUES (%s, %s, NULL, %s, %s)
             """, (codProduto, seqItem, datValidade, codEmbalagem))

             # Gera a movimentação do tipo "IM" (Implantação)
             cursor.execute("""
                 INSERT INTO MovtoEstoque (codProduto, seqItem, codCampus, codUnidade, codPredio, 
                                           codLaboratorio, datMovto, idtTipoMovto, qtdEstoque, txtJustificativa)
                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
             """, (codProduto, seqItem, codCampus, codUnidade, codPredio, codLaboratorio, datMovto, "IM", qtd, "Implantação inicial de itens"))

     conn.commit()
     cursor.close()
     conn.close()

     return jsonify({"message": "Itens implantados com sucesso"}), 200

 except Exception as e:
     return jsonify({"error": str(e)}), 500



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
             codEmbalagem = item["embalagem"]

             
             seqItem = ultimo_seq_item + 1
             ultimo_seq_item = seqItem

             cursor.execute("""
                 INSERT INTO ProdutoItem (codProduto, seqItem, idNFe, datValidade, codEmbalagem)
                 VALUES (%s, %s, NULL, %s, %s)
             """, (codProduto, seqItem, datValidade, codEmbalagem))

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


@produto_bp.route("/produtosImplantadosPorLaboratorio", methods=["GET"])
def produtos_implantados_por_laboratorio():
  codCampus = request.args.get("codCampus")
  codUnidade = request.args.get("codUnidade")
  codPredio = request.args.get("codPredio")
  codLaboratorio = request.args.get("codLaboratorio")

  if not codCampus or not codUnidade or not codPredio or not codLaboratorio:
      return jsonify({"error": "Parâmetros inválidos. Deve conter 'codCampus', 'codUnidade', 'codPredio' e 'codLaboratorio'."}), 400

  try:
      conn = get_connection()
      cursor = conn.cursor()

      # Executa a consulta SQL
      cursor.execute("""
          SELECT DISTINCT p.codProduto, p.nomProduto, p.nomLista, p.perPureza, p.vlrDensidade
          FROM Produto p
          JOIN MovtoEstoque m ON p.codProduto = m.codProduto
          WHERE m.codCampus = %s
            AND m.codUnidade = %s
            AND m.codPredio = %s
            AND m.codLaboratorio = %s;
      """, (codCampus, codUnidade, codPredio, codLaboratorio))

      produtos = cursor.fetchall()

      # Formata os resultados como uma lista de dicionários
      resultado = [
          {
              "codProduto": row[0],
              "nomProduto": row[1],
              "nomLista": row[2],
              "perPureza": row[3],
              "vlrDensidade": row[4]
          }
          for row in produtos
      ]

      cursor.close()
      conn.close()

      return jsonify(resultado), 200

  except Exception as e:
      return jsonify({"error": str(e)}), 500


@produto_bp.route("/relatorioProdutos", methods=["GET"])
def relatorio_produtos():
  data_inicial = request.args.get("dataInicial")  # Opcional
  data_final = request.args.get("dataFinal")      # Opcional

  try:
      conn = get_connection()
      cursor = conn.cursor()

      # Consulta para obter todos os produtos com movimentações
      cursor.execute("""
          SELECT DISTINCT p.codProduto, p.nomProduto, p.nomLista, p.perPureza, p.vlrDensidade
          FROM Produto p
          JOIN MovtoEstoque m ON p.codProduto = m.codProduto;
      """)
      produtos = cursor.fetchall()

      resultado = []

      for produto in produtos:
          codProduto = produto[0]

          # Consulta para obter as movimentações do produto
          if data_inicial and data_final:
              # Filtrar por data inicial e final, se fornecidas
              cursor.execute("""
                  SELECT m.seqItem, m.datMovto, m.idtTipoMovto, m.qtdEstoque, m.txtJustificativa,
                         le.nomLocal, m.codLaboratorio
                  FROM MovtoEstoque m
                  JOIN LocalEstocagem le
                    ON m.codCampus = le.codCampus
                   AND m.codUnidade = le.codUnidade
                   AND m.codPredio = le.codPredio
                   AND m.codLaboratorio = le.codLaboratorio
                  WHERE m.codProduto = %s
                    AND m.datMovto > %s AND m.datMovto <= (%s::date + INTERVAL '1 day')
                  ORDER BY m.seqItem ASC, m.datMovto ASC;
              """, (codProduto, data_inicial, data_final))
          else:
              # Sem filtro de data
              cursor.execute("""
                  SELECT m.seqItem, m.datMovto, m.idtTipoMovto, m.qtdEstoque, m.txtJustificativa,
                         le.nomLocal, m.codLaboratorio
                  FROM MovtoEstoque m
                  JOIN LocalEstocagem le
                    ON m.codCampus = le.codCampus
                   AND m.codUnidade = le.codUnidade
                   AND m.codPredio = le.codPredio
                   AND m.codLaboratorio = le.codLaboratorio
                  WHERE m.codProduto = %s
                  ORDER BY m.seqItem ASC, m.datMovto ASC;
              """, (codProduto,))
          
          movimentacoes = cursor.fetchall()

          # Consulta para calcular a quantidade geral atual do produto
          cursor.execute("""
              SELECT COALESCE(SUM(m.qtdEstoque), 0)
              FROM MovtoEstoque m
              WHERE m.codProduto = %s;
          """, (codProduto,))
          qtd_geral = cursor.fetchone()[0]

          # Adicionar os dados do produto ao resultado
          resultado.append({
              "produto": {
                  "codProduto": produto[0],
                  "nomProduto": produto[1],
                  "nomLista": produto[2],
                  "perPureza": produto[3],
                  "vlrDensidade": produto[4]
              },
              "movimentacoes": [
                  {
                      "seqItem": row[0],
                      "datMovto": row[1].strftime("%Y-%m-%d"),
                      "idtTipoMovto": row[2],
                      "qtdEstoque": float(row[3]),
                      "txtJustificativa": row[4],
                      "nomLocal": row[5],  # Nome do laboratório
                      "codLaboratorio": row[6]  # Código do laboratório
                  }
                  for row in movimentacoes
              ],
              "qtdGeralAtual": float(qtd_geral)
          })

      cursor.close()
      conn.close()

      return jsonify(resultado), 200

  except Exception as e:
      return jsonify({"error": str(e)}), 500