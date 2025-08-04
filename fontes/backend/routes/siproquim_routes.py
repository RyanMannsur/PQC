# routes/siproquim_routes.py 
from flask import Blueprint, request, jsonify
import calendar, datetime
from datetime import date
from flask import jsonify
produto_bp = Blueprint("produto_bp", __name__)
import sys
from db import Db, Mode
import util

# Passo 0 - Executando o arquivo
# Abra um novo terminal, execute os seguintes comandos:
# docker exec -it backend sh
# python siproquim_routes.py
# ver bd:   docker exec -it bd-postgres psql -U postgres -d PQC

print("Debugging informações...", file=sys.stdout)
"""
3.1.1. Seção de Identificação da Empresa/Mapa (EM): 
Identificará a empresa e o mapa de referência para a declaração mensal.   
"""
def secaoIdentificacao(mmm, aaaa):
   tipo = 'EM'              # 2 Alfanumerico
   cnpj = '17220203000196'  # 14 Alfanumerico
   mes = mmm                # 3 Alfanumerico (JAN, FEV, ETC)
   ano = aaaa               # 4 NUMERICO
   comercializacaoNac = '0' #não 1 Numerico
   comercializacaoInt = '0' #nao 1 Numerico
   producao = '0'           #não 1 Numerico
   transformacao = '0'      #nao 1 Numerico
   consumo = '1'            #sim 1 Numerico
   fabricacao = '0'         #não 1 Numerico
   transporte = '0'         #nao 1 Numerico
   armazenamento = '1'      #sim 1 Numerico

   lin =  tipo + cnpj + mes + ano + comercializacaoNac + comercializacaoInt
   lin += producao + transformacao + consumo + fabricacao + transporte + armazenamento = 
   return lin

"""
3.1.2. Seção Demonstrativo Geral (DG): 
Descreverá os produtos controlados (PR) e os produtos compostos (PC) de 
substâncias controladas (SC) trabalhados pelo declarante. Essa seção poderá ser composta de uma subseção 
denominada Identificação do Resíduo Controlado (RC) caso o declarante trabalhe com resíduos de produtos 
químicos controlados. 
"""
def secaoDemonstrativoGeral(codProduto, nomProduto, perPureza, vlrDensidade):
    tipo  = 'DG'   
    NCM = codProduto            # 11 Alfanumerico
    nomeComercial = rpad(trunc(nomProduto, 70), 70 '')  # 70 Alfanumerico
    concentracao = f'{int(round(float(perPureza), 0)):03d}'    
    densidade = f'{round(float(vlrDensidade), 2):05.2f}'.replace('.', ',')   
   
    return tipo + NCM + nomeComercial + concentracao + densidade

"""
3.1.3. Seção Movimentação Nacional de Produtos Químicos (MVN): 
Descreverá as operações de entrada e saída em função de 
compra (COM), venda (VEN), doação (DOA), remessa (REM), retorno (RET) e transferência (TRA) 
de PQC. 
"""
def secaoMovimentacaoNacional(operac, cnpj, razaoSocial, numeroNfe, dataEmissaoNfe, armazenagemNfe, transporteNfe)
    tipo = 'MVN'
    if(operacao == 'EC' or operacao == 'ED' or operacao == 'TE' or operacao == 'AE'):
        entradaSaida = 'E'  # Movimentação de Entrada
    else:
        entradaSaida = 'S'  # Movimentação de Saída
    if(operac == 'TE'): operacao = 'ET'; #formatação da norma
    elif(operac == 'AE'): operacao = 'EF'; #formatação da norma
    elif(operac == 'TS'): operacao = 'ST'
    else operacao = operac

    cnpjFornecedor = rpad(trunc(cnpj, 14), 14 '')
    razaoSocialFornecedor = rpad(trunc(razaoSocial, 69), 69 '')
    numero = rpad(trunc(nomProduto, 10), 10 '')
    data = dataEmissaoNfe.split('-')
    dataEmissao = f'{produto[2]}/{produto[1]}/{produto[0]}'  # Formato DD/MM/AAAA
    return tipo + entradaSaida + operacao + cnpjFornecedor + razaoSocialFornecedor + numero + dataEmissao + armazenagemNfe + transporteNfe

# Rota para listar todos os produtos
@produto_bp.route("/gerarArquivoSiproquim", methods=["GET"])
def gerar_arquivo():
    sql = """
       SELECT A.codProduto,
              A.nomProduto,
              A.perPureza,
              A.vlrDensidade,
              C.idtTipoMovto,
              sum(C.qtdEstoque)
         FROM Produto A
         JOIN ProdutoItem B
           ON B.codProduto = A.codProduto
         JOIN MovtoEstoque C
           ON C.codProduto = B.codProduto
          AND C.seqItem = B.seqItem
         JOIN (SELECT codCampus,
                      codUnidade,
                      codPredio,
                      codLaboratorio,
                      max(datMovto) datUltInventario
                 FROM MovtoEstoque D 
                WHERE idtTipoMovto = 'IN'
                GROUP BY 1,2,3,4) AS Tab
            ON C.codCampus = Tab.codCampus
           AND C.codUnidade = Tab.codUnidade
           AND C.codPredio = Tab.codPredio
           AND C.codLaboratorio = tab.codLaboratorio
           AND C.datMovto = Tab.datUltInventario
        GROUP BY 1,2,3,4,5
        ORDER By 1
    """
    
    try:
        db = Db()
        produtos = db.execSql(sql, None, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    if not produtos:
         return util.formataAviso("Nenhum produto encontrado!")  

    arquivoDeMapas = "M"
    date = datetime.now()
    mesesPt = [
        "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
        "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"
    ]
    mes = mesesPt[date.month-1] # mostra JAN, FEB, etc.
    ano = date.year
    cnpj = "17220203000196" #14 caracteres
    nomeArquivo = f'{arquivoDeMapas}{ano}{mes}{cnpj}.txt'
  
    with open(nomeArquivo, 'w', encoding='utf-8') as file:
        file.write(secaoIdentificacao(mmm, aaaa))
        
        for produto in produtos:
            file.write(secaoDemonstrativoGeral(produto[0], produto[1], produto[2], produto[3]))
        for produto in produtos:
            file.write(secaoMovimentacaoNacional(produto[4], "cnpj-fornecedo", "razao-social-fornecedor"))
        
gerar_arquivo()