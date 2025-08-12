# routes/siproquim_routes.py 
from flask import Blueprint, request, jsonify
import calendar, datetime
from datetime import datetime
siproquim_bp = Blueprint("siproquim_bp", __name__)
import sys
import os
# Add parent directory to path to find db module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db import Db, Mode
import util

# Passo 0 - Executando o arquivo
# Inicie o docker
# cole o url no navegador:
# http://localhost:8088/api/gerarArquivoSiproquim

#funções auxílio
def split(str, num):
    return [str[start:start+num] for start in range(0, len(str), num)]
def inserirPonto(str):
    stringSplit = split(str, 3)
    if not stringSplit:  # input vazio
        return str
    strFinal = stringSplit[0]
    for i in range(1, len(stringSplit)):
        strFinal = f'{strFinal}.{stringSplit[i]}'
    return strFinal
def convertYMDtoDMY(data): # converte o modelo de data no bd para o modelo do relatório
    if not data:
        return ''
    partes = data.split('-')
    if len(partes) != 3:
        return ''
    dia = partes[2]
    mes = partes[1]
    ano = partes[0]
    return f'{dia}/{mes}/{ano}'

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

   lin =  f'{tipo}{cnpj}{mes}{ano}{comercializacaoNac}{comercializacaoInt}'
   lin += f'{producao}{transformacao}{consumo}{fabricacao}{transporte}{armazenamento}\n'
   return lin

"""
3.1.2. Seção Demonstrativo Geral (DG): 
Descreverá os produtos controlados (PR) e os produtos compostos (PC) de 
substâncias controladas (SC) trabalhados pelo declarante. Essa seção poderá ser composta de uma subseção 
denominada Identificação do Resíduo Controlado (RC) caso o declarante trabalhe com resíduos de produtos 
químicos controlados. 
"""
def secaoDemonstrativoGeral(codProduto, nomProduto, perPureza, vlrDensidade):
    tipo  = 'PR'   
    NCM = codProduto  # 11 Alfanumerico
    nomeComercial = (nomProduto[:70].ljust(70)) if len(nomProduto) > 70 else nomProduto.ljust(70) # 70 Alfanumerico
    concentracao = f'{int(round(float(perPureza), 0)):03d}'    
    densidade = f'{round(float(vlrDensidade), 2):05.2f}'.replace('.', ',')   

    return f'{tipo}{NCM}{nomeComercial}{concentracao}{densidade}\n'

"""
3.1.3. Seção Movimentação Nacional de Produtos Químicos (MVN): 
Descreverá as operações de entrada e saída em função de 
compra (COM), venda (VEN), doação (DOA), remessa (REM), retorno (RET) e transferência (TRA) 
de PQC. 
"""
def secaoMovimentacaoNacional(operac, cnpj, razaoSocial, numeroNfe, dataEmissaoNfe, armazenagemNfe, transporteNfe):
    tipo = 'MVN'
    if operac in ['AC', 'IN']:
        return ''
    if operac in ['EC', 'ED', 'TE', 'AE']:
        entradaSaida = 'E'  # Movimentação de Entrada
    else:
        entradaSaida = 'S'  # Movimentação de Saída
    if operac == 'TE': operacao = 'ET'; #formatação da norma
    elif operac == 'AE': operacao = 'EF'; #formatação da norma
    elif operac == 'TS' : operacao = 'ST'
    else: operacao = operac

    cnpjFornecedor = (cnpj[:14].ljust(14)) if len(cnpj) > 14 else cnpj.ljust(14)
    razaoSocialFornecedor = (razaoSocial[:69].ljust(69)) if len(razaoSocial) > 69 else razaoSocial.ljust(69) 
    numero = (numeroNfe[:10].ljust(10)) if len(numeroNfe) > 10 else numeroNfe.ljust(10) 
    dataEmissao = convertYMDtoDMY(dataEmissaoNfe)  # Formato DD/MM/AAAA
    return f'{tipo}{entradaSaida}{operacao}{cnpjFornecedor}{razaoSocialFornecedor}{numero}{dataEmissao}{armazenagemNfe}{transporteNfe}\n'

"""
3.1.3.1. Subseção  Movimento  (MM):  Registra  efetiva  movimentação  de  produtos  químicos  controlados 
e/ou resíduo. Ressalta-se que os produtos elencados nessa subseção deverão estar previamente 
inseridos na seção Demonstrativo Geral (DG). Seguir a seguinte estrutura:
"""
def subsecMovimento(codProduto, perPureza, vlrDensidade, quant, unidMedida):
    tipo = 'MM'
    NCM = f'PC{codProduto}'
    concentracao = f'{int(round(float(perPureza), 0)):03d}'    
    densidade = f'{round(float(vlrDensidade), 2):05.2f}'.replace('.', ',')
    quantInt = int(round(float(quant), 0))
    quantFloat = (float(quant) - quantInt) * 1000
    quantidade = f'{inserirPonto(str(quantInt).zfill(9))},{int(quantFloat):3d}' # 9 num inteiro, 3 casa decimal, 2 pontos e 1 vírgula

    return f'{tipo}{NCM}{concentracao}{densidade}{quantidade}{unidMedida}\n'

"""
3.1.3.2. Subseção Transporte (MT): Caso o transporte dos produtos químicos movimentados na NF tenha 
sido realizado sob responsabilidade de uma empresa (T) Terceirizada, descrita no item da seção 
3.1.3, deverão ser informados detalhes da transportadora.
"""
def subsecTransporte(cnpjTransp, razaoSoc):
    tipo = 'MT'
    if cnpjTransp == '':
        return ''
    cnpjTransportadora = cnpjTransp
    razaoSocial = (razaoSoc[:70].ljust(70)) if len(razaoSoc) > 70 else razaoSoc.ljust(70)
    razaoSocial = razaoSocial.upper()
    return f'{tipo}{cnpjTransportadora}{razaoSocial}\n'

"""
3.1.3.3. Subseção Armazenagem (MA): Descreverá as informações relacionadas ao endereço de 
armazenagem. Essa subseção deve ser informada quando for indicado no preenchimento da seção 
3.1.3  que  se  trata  de  uma  operação  de  saída  -  com  indicação  do  endereço  do  responsável  pela 
armazenagem, ou caso seja uma operação de entrada com endereço do local de entrega diferente 
do endereço de cadastro.
"""
def subsecArmazenagem(cnpjArmaz, razaoSocialArmaz, enderecoArmaz, cepArmaz, numeroArmaz, complementoArmaz, bairroArmaz, ufArmaz, municipioArmaz):
    tipo = 'MA'
    cnpj = cnpjArmaz
    razaoSocial = (razaoSocialArmaz[:70].ljust(70)) if len(razaoSocialArmaz) > 70 else razaoSocialArmaz.ljust(70)
    endereco = (enderecoArmaz[:70].ljust(70)) if len(enderecoArmaz) > 70 else enderecoArmaz.ljust(70)
    cep = cepArmaz # com máscara 99.999-999
    numero = (numeroArmaz[:5].ljust(5)) if len(numeroArmaz) > 5 else numeroArmaz.ljust(5)
    complemento = (complementoArmaz[:20].ljust(20)) if len(complementoArmaz) > 20 else complementoArmaz.ljust(20)
    bairro = (bairroArmaz[:30].ljust(30)) if len(bairroArmaz) > 30 else bairroArmaz.ljust(30)
    bairro = bairro.upper()
    uf = ufArmaz # MA, MG, ES, ets
    municipio = municipioArmaz # Código IBGE município (observar tabela oficial)

    return f'{tipo}{cnpj}{razaoSocial}{endereco}{cep}{numero}{complemento}{bairro}{uf}{municipio}\n'

"""
3.1.4. Seção Movimentação Internacional de Produtos Químicos (MVI): Descreverá as operações exportação (E), 
Importação (I), e Importação por Conta e Ordem (C) de PQC.
"""
def secMovimentacaoInternacional(operacao, idPaisAF, razaoSocialAF, numLi, dataRestricaoEmbarque, dataCoEmbarque, numDue, dataDue, numDi, dataDi, responsavelArmazenagem, responsavelTransporte, localEntrega):
    tipo = 'MVI'
    operac = operacao # (E)xportação,(I)mportação,Importação (C)onta e Ordem
    idPais = idPaisAF # Ver tabela oficial
    razaoSocial = (razaoSocialAF[:70].ljust(70)) if len(razaoSocialAF) > 70 else razaoSocialAF.ljust(70)
    nLi = numLi # 99/9999999-9
    dataRestrEmbarque = convertYMDtoDMY(dataRestricaoEmbarque)
    dataCEmbarque = convertYMDtoDMY(dataCoEmbarque)
    nDue = numDue #15 num
    datDue = convertYMDtoDMY(dataDue)
    nDi = numDi #12 num
    datDi = convertYMDtoDMY(dataDi)
    respArmazenagem = responsavelArmazenagem # Exportação: Próprio (E)xportador, Empresa (T)erceirizada; # Importação: deixar em branco; # Importação  por  Conta  e  Ordem:  Próprio  (I)mportador,  Próprio  (A)dquirente,  (T)erceirizada Nacional
    respTransporte = responsavelTransporte # Exportação:  Próprio  (E)xportador,  Empresa  (T)erceirizada  Nacional,  (A)dquirente/Terceirizada Internacional; # Importação: Próprio (I)mportador, (T)erceirizada Nacional, (F)ornecedor/Terceirizada Internacional; # Importação  por  Conta  e  Ordem:  Próprio  (I)mportador,  Próprio  Adquirente  (Q),  (T)erceirizada Nacional, (F)ornecedor/Terceirizada Internacional
    locEntrega = localEntrega # Próprio  (I)mportador,  Empresa  (T)erceirizada.  Se  não  for importação, deixar campo em branco

    return f'{tipo}{operac}{idPais}{razaoSocial}{nLi}{dataRestrEmbarque}{dataCEmbarque}{nDue}{datDue}{nDi}{datDi}{respArmazenagem}{respTransporte}{locEntrega}\n'

"""
3.1.4.1. Subseção Responsável pelo Transporte (TRA): Descreverá as informações da pessoa responsável 
pelo transporte. Deve ser preenchido ao informar na Movimentação Internacional que o 
responsável pelo transporte é uma Terceirizada Nacional.
"""
def subsecResponsavelPeloTransporte(cnpjTransp, razaoSoc):
    tipo = 'TRA'
    if cnpjTransp == '':
        return ''
    cnpjTransportadora = cnpjTransp
    razaoSocial = (razaoSoc[:70].ljust(70)) if len(razaoSoc) > 70 else razaoSoc.ljust(70)
    razaoSocial = razaoSocial.upper()
    return f'{tipo}{cnpjTransportadora}{razaoSocial}\n'

"""
3.1.4.2. Subseção Responsável pelo Transporte (TRI): Descreverá as informações da pessoa responsável 
pelo transporte. Deve ser preenchido ao informar na Movimentação Internacional que o 
responsável pelo transporte é uma Terceirizada Internacional. 
"""
def subsecResponsavelPeloTransporte(razaoSoc):
    tipo = 'TRI'
    razaoSocial = (razaoSoc[:70].ljust(70)) if len(razaoSoc) > 70 else razaoSoc.ljust(70)
    razaoSocial = razaoSocial.upper()
    return f'{tipo}{razaoSocial}\n'

# Rota para listar todos os produtos
@siproquim_bp.route("/gerarArquivoSiproquim", methods=["GET"])
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
        file.write(secaoIdentificacao(mes, str(ano)))
        file.write('DG\n')
        for produto in produtos:
            file.write(secaoDemonstrativoGeral(produto[0], produto[1], produto[2], produto[3]))
        for produto in produtos:
            file.write(secaoMovimentacaoNacional(produto[4], "cnpj-fornecedor", "razao-social-fornecedor","numeroNfe", "2001-01-02", "F", "F"))
        for produto in produtos:
            file.write(subsecMovimento(produto[0], produto[2], produto[3], produto[5], "?")) # não tem unidade de medida no BD, tem q ser 'K' ou 'L'
        file.write(subsecTransporte("12345678901234", "razaoSocial"))
        file.write(subsecArmazenagem("12345678901234", "razaoSocial", "enderecoArmaz", "33333-333", "numer", "complementoArmaz", "bairroArmaz", "uf", "municipioArmaz"))
        file.write(secMovimentacaoInternacional('E', "idP", "razaoSocialDoAdquirenteOuFornecedor", "99/9999999-9", "1984-03-01", "1985-01-02", "numDaDUE0000000", "1986-01-03", "99/9999999-9", "1986-01-02", 'E', 'E', 'I'))
        file.write(subsecResponsavelPeloTransporte("12345678901234", "razaoSocial"))
        file.write(subsecResponsavelPeloTransporte("razaoSocial"))
    return jsonify({"message": f"Arquivo {nomeArquivo} gerado", "arquivo": nomeArquivo})