import json
import psycopg2

# Configuração do banco de dados
DB_CONFIG = {
    "dbname": "PQC",
    "user": "postgres",
    "password": "postgres",
    "host": "localhost",
    "port": "5432"
}

# Função para conectar ao banco de dados
def get_connection():
    return psycopg2.connect(**DB_CONFIG)

# Função para inserir produtos no banco de dados
def insert_produtos_from_json(json_file):
    try:
        # Abre e lê o arquivo JSON
        with open(json_file, "r", encoding="utf-8") as file:
            produtos = json.load(file)

        # Conecta ao banco de dados
        conn = get_connection()
        cursor = conn.cursor()

        # Query SQL para inserção
        insert_query = """
            INSERT INTO Produto (codProduto, nomProduto, nomLista, perPureza, vlrDensidade, uniMedida) 
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (codProduto) DO NOTHING;
        """

        # Percorre os produtos e insere no banco
        for produto in produtos:
            cursor.execute(insert_query, (
                produto["codProduto"], 
                produto["nomProduto"], 
                produto["nomLista"], 
                produto.get("perPureza"), # retorna nulo se não existe no Json
                produto.get("vlrDensidade"), 
                produto.get("uniMedida")
            ))

        # Confirma a transação
        conn.commit()
        print("Produtos inseridos com sucesso!")

    except Exception as e:
        print("Erro ao inserir produtos:", e)
        conn.rollback()

    finally:
        cursor.close()
        conn.close()


def insert_campus_from_json(json_file):
    try:
        # Abre e lê o arquivo JSON
        with open(json_file, "r", encoding="utf-8") as file:
            campi = json.load(file)

        # Conecta ao banco de dados
        conn = get_connection()
        cursor = conn.cursor()

        # Query SQL para inserção
        insert_query = """
            INSERT INTO campus (codCampus, nomCampus) 
            VALUES (%s, %s)
            ON CONFLICT (codCampus) DO NOTHING;
        """

        # Percorre os campus e insere no banco
        for campus in campi:
            cursor.execute(insert_query, (
                campus["codCampus"], 
                campus["nomCampus"] 
            ))

        # Confirma a transação
        conn.commit()
        print("Campus inseridos com sucesso!")

    except Exception as e:
        print("Erro ao inserir campus:", e)
        conn.rollback()

    finally:
        cursor.close()
        conn.close()

def insert_usuarios_from_json(json_file):
    try:
        # Abre e lê o arquivo JSON
        with open(json_file, "r", encoding="utf-8") as file:
            usuarios = json.load(file)

        # Conecta ao banco de dados
        conn = get_connection()
        cursor = conn.cursor()

        # Query SQL para inserção
        insert_query = """
            INSERT INTO Usuario (codSiape, nomUsuario) 
            VALUES (%s, %s)
            ON CONFLICT (codSiape) DO NOTHING;
        """

        # Percorre os Usuarios e insere no banco
        for usuario in usuarios:
            try:
                cursor.execute(insert_query, (
                    usuario["codSiape"], 
                    usuario["nomUsuario"]
                ))
            except Exception as e_interno:
                print(f"Erro ao inserir usuário {usuario.get('codSiape', 'desconhecido')}: {e_interno}")
                conn.rollback()  # Rollback apenas do usuário com erro
      

        # Confirma a transação
        conn.commit()
        print("Usuarios inseridas com sucesso!")

    except json.JSONDecodeError as e_json:
        print(f"Erro ao decodificar arquivo JSON: {e_json}")
    except Exception as e:
        print("Erro ao inserir usuarios:", e)
        conn.rollback()

    finally:
        cursor.close()
        conn.close()

def insert_unidadeOrganizacional_from_json(json_file):
    try:
        # Abre e lê o arquivo JSON
        with open(json_file, "r", encoding="utf-8") as file:
            unidades = json.load(file)

        # Conecta ao banco de dados
        conn = get_connection()
        cursor = conn.cursor()

        # Query SQL para inserção
        insert_query = """
            INSERT INTO UnidadeOrganizacional (codCampus, codUnidade, sglUnidade, nomUnidade) 
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (codCampus, codUnidade) DO NOTHING;
        """

        # Percorre os Unidade e insere no banco
        for unidade in unidades:
            cursor.execute(insert_query, (
                unidade["codCampus"], 
                unidade["codUnidade"], 
                unidade["sglUnidade"], 
                unidade["nomUnidade"]
            ))

        # Confirma a transação
        conn.commit()
        print("Unidades Organizacionais inseridas com sucesso!")

    except Exception as e:
        print("Erro ao inserir unidade organizacional:", e)
        conn.rollback()

    finally:
        cursor.close()
        conn.close()

def insert_orgaoControle_from_json(json_file):
    try:
        # Abre e lê o arquivo JSON
        with open(json_file, "r", encoding="utf-8") as file:
            orgaosControle = json.load(file)

        # Conecta ao banco de dados
        conn = get_connection()
        cursor = conn.cursor()

        # Query SQL para inserção
        insert_query = """
            INSERT INTO OrgaoControle (codOrgaoControle, nomOrgaoControle) 
            VALUES (%s, %s)
            ON CONFLICT (codOrgaoControle) DO NOTHING;
        """

        # Percorre os OrgaoControle e insere no banco
        for orgaoControle in orgaosControle:
            cursor.execute(insert_query, (
                orgaoControle["codOrgaoControle"], 
                orgaoControle["nomOrgaoControle"] 
            ))

        # Confirma a transação
        conn.commit()
        print("OrgaoControle inseridas com sucesso!")

    except Exception as e:
        print("Erro ao inserir OrgaoControle:", e)
        conn.rollback()

    finally:
        cursor.close()
        conn.close()

def insert_ProdutoUnidadeOrganizacional_from_json(json_file):
    try:
        # Abre e lê o arquivo JSON
        with open(json_file, "r", encoding="utf-8") as file:
            produtosUnidadeOrganizacional = json.load(file)

        # Conecta ao banco de dados
        conn = get_connection()
        cursor = conn.cursor()

        # Query SQL para inserção
        insert_query = """
            INSERT INTO ProdutoUnidadeOrganizacional (codProduto, codCampus, codUnidade) 
            VALUES (%s, %s, %s)
            ON CONFLICT (codProduto, codCampus, codUnidade) DO NOTHING;
        """

        # Percorre os Produto Unidade Organizaciona e insere no banco
        for produtoUnidadeOrganizacional in produtosUnidadeOrganizacional:
            cursor.execute(insert_query, (
                produtoUnidadeOrganizacional["codProduto"], 
                produtoUnidadeOrganizacional["codCampus"], 
                produtoUnidadeOrganizacional["codUnidade"] 
            ))

        # Confirma a transação
        conn.commit()
        print("ProdutoUnidadeOrganizacional inseridos com sucesso!")

    except Exception as e:
        print("Erro ao inserir ProdutoUnidadeOrganizacional:", e)
        conn.rollback()

    finally:
        cursor.close()
        conn.close()

# Chamando a função para inserir os produtos
insert_produtos_from_json("produtos.json")
insert_campus_from_json("campus.json")
insert_usuarios_from_json("usuarios.json")
insert_unidadeOrganizacional_from_json("UnidadeOrganizacional.json")
insert_orgaoControle_from_json("OrgaoControle.json")
insert_ProdutoUnidadeOrganizacional_from_json("ProdutoUnidadeOrganizacional.json")