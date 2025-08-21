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

def ajustarTamanhoStr(str, size):
    return (str[:size].ljust(size)) if len(str) > size else str.ljust(size)

# funções gerais
def descreverEnderecoDeEmpresa(tipoEmp, cnpjEmp, razaoSocialEmp, enderecoEmp, cepEmp, numeroEmp, complementoEmp, bairroEmp, ufEmp, municipioEmp):
    tipo = tipoEmp
    cnpj = cnpjEmp
    razaoSocial = ajustarTamanhoStr(razaoSocialEmp, 70)
    endereco = ajustarTamanhoStr(enderecoEmp, 70)
    cep = cepEmp # com máscara 99.999-999
    numero = ajustarTamanhoStr(numeroEmp, 5)
    complemento = ajustarTamanhoStr(complementoEmp, 20)
    bairro = ajustarTamanhoStr(bairroEmp, 30)
    bairro = bairro.upper()
    uf = ufEmp # MA, MG, ES, ets
    municipio = municipioEmp # Código IBGE município (observar tabela oficial)

    return f'{tipo}{cnpj}{razaoSocial}{endereco}{cep}{numero}{complemento}{bairro}{uf}{municipio}\n'

def descreverQuantidadeDeProduto(tipo, codProduto, perPureza, vlrDensidade, quant, unidMedida):
    NCM = f'PC{codProduto}'
    concentracao = f'{int(round(float(perPureza), 0)):03d}'    
    densidade = f'{round(float(vlrDensidade), 2):05.2f}'.replace('.', ',')
    quantInt = int(round(float(quant), 0))
    quantFloat = (float(quant) - quantInt) * 1000
    quantidade = f'{inserirPonto(str(quantInt).zfill(9))},{int(quantFloat):03d}' # 9 num inteiro, 3 casa decimal, 2 pontos e 1 vírgula

    return f'{tipo}{NCM}{concentracao}{densidade}{quantidade}{unidMedida}\n'

def identificarEmpresa(cpfCnpjEmpresa, nomeEmpresa):
    empresa = ajustarTamanhoStr(cpfCnpjEmpresa, 14)
    nome = ajustarTamanhoStr(nomeEmpresa, 70)
    return f'{empresa}{nome}'

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
    nomeComercial = ajustarTamanhoStr(nomProduto, 70) # 70 Alfanumerico
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
    # TODO: revisar essa lógica depois
    cnpjFornecedor = ajustarTamanhoStr(cnpj, 14)
    razaoSocialFornecedor = ajustarTamanhoStr(razaoSocial, 69) 
    numero = ajustarTamanhoStr(numeroNfe, 10) 
    dataEmissao = convertYMDtoDMY(dataEmissaoNfe)  # Formato DD/MM/AAAA
    return f'{tipo}{entradaSaida}{operacao}{cnpjFornecedor}{razaoSocialFornecedor}{numero}{dataEmissao}{armazenagemNfe}{transporteNfe}\n'

"""
3.1.3.1. Subseção  Movimento  (MM):  Registra  efetiva  movimentação  de  produtos  químicos  controlados 
e/ou resíduo. Ressalta-se que os produtos elencados nessa subseção deverão estar previamente 
inseridos na seção Demonstrativo Geral (DG). Seguir a seguinte estrutura:
"""
def subsecMovimento(codProduto, perPureza, vlrDensidade, quant, unidMedida):
    tipo = 'MM'
    return descreverQuantidadeDeProduto(tipo, codProduto, perPureza, vlrDensidade, quant, unidMedida)
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
    razaoSocial = ajustarTamanhoStr(razaoSoc, 70)
    razaoSocial = razaoSocial.upper()
    return f'{tipo}{cnpjTransportadora}{razaoSocial}\n'

"""
3.1.3.3. Subseção Armazenagem (MA): Descreverá as informações relacionadas ao endereço de 
armazenagem. Essa subseção deve ser informada quando for indicado no preenchimento da seção 
3.1.3  que  se  trata  de  uma  operação  de  saída  -  com  indicação  do  endereço  do  responsável  pela 
armazenagem, ou caso seja uma operação de entrada com endereço do local de entrega diferente 
do endereço de cadastro.
"""
def subsecArmazenagemMA(cnpj, razaoSocial, endereco, cep, numero, complemento, bairro, uf, municipio):
    tipo = 'MA'
    return descreverEnderecoDeEmpresa(tipo, cnpj, razaoSocial, endereco, cep, numero, complemento, bairro, uf, municipio)

"""
3.1.4. Seção Movimentação Internacional de Produtos Químicos (MVI): Descreverá as operações exportação (E), 
Importação (I), e Importação por Conta e Ordem (C) de PQC.
"""
def secMovimentacaoInternacional(operacao, idPaisAF, razaoSocialAF, numLi, dataRestricaoEmbarque, dataCoEmbarque, numDue, dataDue, numDi, dataDi, responsavelArmazenagem, responsavelTransporte, localEntrega):
    tipo = 'MVI'
    operac = operacao # (E)xportação,(I)mportação,Importação (C)onta e Ordem
    idPais = idPaisAF # Ver tabela oficial
    razaoSocial = ajustarTamanhoStr(razaoSocialAF, 70)
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

3.1.4.2. Subseção Responsável pelo Transporte (TRI): Descreverá as informações da pessoa responsável 
pelo transporte. Deve ser preenchido ao informar na Movimentação Internacional que o 
responsável pelo transporte é uma Terceirizada Internacional. 
"""
def subsecResponsavelPeloTransporte(razaoSoc, cnpjTransp = ''):
    tipo = 'TRA'
    if cnpjTransp == '':
        tipo = 'TRI'
    cnpjTransportadora = cnpjTransp
    razaoSocial = ajustarTamanhoStr(razaoSoc, 70)
    razaoSocial = razaoSocial.upper()
    return f'{tipo}{cnpjTransportadora}{razaoSocial}\n'

"""
3.1.4.3. Subseção Responsável pela Armazenagem (AMZ): Descreverá o endereço da pessoa responsável 
pela  armazenagem.  Deve  ser  preenchido  ao  realizar  uma  movimentação  de  Exportação  ou  de 
Importação  por  Conta  e  Ordem  cujo  responsável  pelo  transporte  seja  o  próprio  importador  ou 
uma terceirizada nacional. 
"""
def subsecResponsavelArmazenagem(cnpj, razaoSocial, endereco, cep, numero, complemento, bairro, uf, municipio):
    tipo = 'AMZ'
    return descreverEnderecoDeEmpresa(tipo, cnpj, razaoSocial, endereco, cep, numero, complemento, bairro, uf, municipio)

"""
3.1.4.4. Subseção Local de Entrega (TER): Descreverá o endereço do local de entrega. Deve ser preenchido 
ao realizar uma movimentação de Importação.
"""
def subsecLocalEntregaTER(cnpj, razaoSocial, endereco, cep, numero, complemento, bairro, uf, municipio):
    tipo = 'TER'
    return descreverEnderecoDeEmpresa(tipo, cnpj, razaoSocial, endereco, cep, numero, complemento, bairro, uf, municipio)

"""
3.1.4.5. Subseção Adquirente (ADQ): Descreverá o endereço do adquirente da movimentação. Deve ser 
preenchido ao realizar uma movimentação de Importação por Conta e Ordem. 
"""
def subsecAdquirente(cnpj, razaoSocial, endereco, cep, numero, complemento, bairro, uf, municipio):
    tipo = 'ADQ'
    return descreverEnderecoDeEmpresa(tipo, cnpj, razaoSocial, endereco, cep, numero, complemento, bairro, uf, municipio)
"""
3.1.4.6. Subseção Nota Fiscal (NF): Descreverá as informações referentes a nota fiscal, e seus produtos. 
Deve  ser  preenchido  em  qualquer  tipo  de  movimentação  internacional. Atentar  que,  para 
Importação por Conta e Ordem, deve ser informado a nota fiscal de entrada e de saída uma após 
a outra, antes de informar os produtos.
"""
def subsecNotaFiscalCabecalho(numeroNf, dataNf, codigoOperacao):
    tipo = 'NF'
    numero = numeroNf
    data = convertYMDtoDMY(dataNf)
    codigo = codigoOperacao # (E)ntrada ou (S)aída
    return f'{tipo}{numero}{data}{codigo}\n'

def subsecNotaFiscalProduto(codProduto, perPureza, vlrDensidade, quant, unidMedida):
    NCM = f'PC{codProduto}'
    concentracao = f'{int(round(float(perPureza), 0)):03d}'    
    densidade = f'{round(float(vlrDensidade), 2):05.2f}'.replace('.', ',')
    quantInt = int(round(float(quant), 0))
    quantFloat = (float(quant) - quantInt) * 1000
    quantidade = f'{inserirPonto(str(quantInt).zfill(9))},{int(quantFloat):03d}' # 9 num inteiro, 3 casa decimal, 2 pontos e 1 vírgula

    return f'{NCM}{concentracao}{densidade}{quantidade}{unidMedida}\n'

"""
3.1.5. Seção Utilização para Produção (UP): Registra os efetivos quantitativos consumidos pelo declarante no mês 
de  referência  (UP)  para  a  produção  de  produtos  químicos controlados  diversos  (UF).  Os  produtos  químicos 
elencados  nessa  Seção  deverão  ser  anteriormente  registrados  na  seção  Demonstrativo  Geral
"""
def secUtilizacaoProducao(codProduto, perPureza, vlrDensidade, quant, unidMedida):
    tipo = 'UP'
    return descreverQuantidadeDeProduto(tipo, codProduto, perPureza, vlrDensidade, quant, unidMedida)

"""
3.1.5.1. Subseção  Produto  Final  Produzido  –  Produto  Químico  Controlado  (UF):  Registra  os  efetivos 
quantitativos  de  produtos  químicos  produzidos  pelo  declarante  no  mês  de  referência  (UP).  Os 
produtos  químicos  elencados  nessa  Seção  deverão  ser  anteriormente  registrados  na  seção 
Demonstrativo Geral. Essa seção deve ser informada caso a produção tenha como produto final 
um Produto Químico Controlado. 
""" # Não sei se existirá no produto final, mas de qualquer forma vai ficar já pronto
def subsecProdutoFinalProduzido(codProduto, perPureza, vlrDensidade, quant, unidMedida, descricaoProducao, dataProduzida):
    tipo = 'UF'
    qtdProduto = descreverQuantidadeDeProduto(tipo, codProduto, perPureza, vlrDensidade, quant, unidMedida)[:-1] #Slicing pra remover o newline
    descricao = ajustarTamanhoStr(descricaoProducao, 200)
    data = convertYMDtoDMY(dataProduzida)
    return f'{qtdProduto}{descricao}{data}\n'

"""
3.1.6. Seção Utilização para Transformação (UT): Registra os efetivos quantitativos consumidos pelo declarante no 
mês de referência (UT) para a transformação em produtos químicos controlados diversos (UZ). Os produtos 
químicos elencados nessa Seção deverão ser anteriormente registrados na seção Demonstrativo Geral 
"""
def secUtilizacaoParaTransformacao(codProduto, perPureza, vlrDensidade, quant, unidMedida, dataTransformacao):
    tipo = 'UT'
    qtdProduto = descreverQuantidadeDeProduto(tipo, codProduto, perPureza, vlrDensidade, quant, unidMedida)[:-1] #Slicing pra remover o newline
    data = convertYMDtoDMY(dataTransformacao)
    return f'{qtdProduto}{data}\n'

"""
3.1.6.1. Subseção Produto Final Produzido na Transformação (UZ): Registra os efetivos quantitativos de 
produtos  químicos  transformados  pelo  declarante  no  mês  de  referência  (UP).  Os  produtos 
químicos elencados nessa Seção deverão ser anteriormente registrados na seção Demonstrativo 
Geral
"""
def subsecProdutoFinalProduzidoTransformacao(codProduto, perPureza, vlrDensidade, quant, unidMedida, dataTransformacao, descricaoReacaoQuimica):
    tipo = 'UZ'
    qtdProduto = descreverQuantidadeDeProduto(tipo, codProduto, perPureza, vlrDensidade, quant, unidMedida)[:-1] #Slicing pra remover o newline
    reacaoQuimica = ajustarTamanhoStr(descricaoReacaoQuimica, 200)
    data = convertYMDtoDMY(dataTransformacao)
    return f'{qtdProduto}{data}{reacaoQuimica}\n'

"""
3.1.7. Seção Utilização para consumo (UC): Registra os efetivos quantitativos consumidos pelo declarante no mês 
de referência. Os produtos químicos elencados nessa Seção deverão ser anteriormente registrados na seção 
Demonstrativo Geral
"""
def secUtilizacaoConsumo(codProduto, perPureza, vlrDensidade, quant, unidMedida, codigoConsumo, observacaoConsumo, dataConsumo):
    tipo = 'UC'
    qtdProduto = descreverQuantidadeDeProduto(tipo, codProduto, perPureza, vlrDensidade, quant, unidMedida)[:-1] #Slicing pra remover o newline
    codigo = str(codigoConsumo) # 1 - Limpeza e Manutenção # 2 - Análises Laboratoriais # 3 - Outros # 4 - Processo Produtivo # 5 - Tratamento de Afluentes e Efluentes
    observacao = ajustarTamanhoStr(observacaoConsumo, 62)
    data = convertYMDtoDMY(dataConsumo)
    return f'{qtdProduto}{codigo}{observacao}{data}\n'

"""
3.1.8. Seção Fabricação (FB): Registra os efetivos quantitativos de produtos químicos controlados fabricados pelo 
declarante  no  mês  de  referência  com  base  em  produtos  químicos  não  controlados.  Os  produtos  químicos 
elencados  nessa  Seção  deverão  ser  anteriormente  registrados  na  seção  Demonstrativo  Geral 
"""
def secFabricacao(codProduto, perPureza, vlrDensidade, quant, unidMedida, dataFabricacao):
    tipo = 'FB'
    qtdProduto = descreverQuantidadeDeProduto(tipo, codProduto, perPureza, vlrDensidade, quant, unidMedida)[:-1] #Slicing pra remover o newline
    data = convertYMDtoDMY(dataFabricacao)
    return f'{qtdProduto}{data}\n'

"""
3.1.9. Seção Transporte Nacional (TN): Registra a movimentação de produtos químicos transportados. Essa seção 
deverá ser utilizada por empresas cuja atividade (CNAE), principal ou secundária, seja transporte. Os produtos 
químicos elencados na seção, deverão ser anteriormente registrados na seção Demonstrativo Geral. 
"""
def secTransporteNacional(cpfCnpjContratante, nomeContratante, numeroNf, dataEmissaoNf, cpfCnpjOrigemCarga, razaoSocialOrigemCarga, cpfCnpjDestinoCarga, razaoSocialDestinoCarga, localRetirada, localEntrega):
    tipo = 'TN'
    contratante = ajustarTamanhoStr(cpfCnpjContratante, 14)
    nomeCont = ajustarTamanhoStr(nomeContratante, 70)
    numero = numeroNf #10 caracteres
    dataEmissao = convertYMDtoDMY(dataEmissaoNf)
    origemCarga = ajustarTamanhoStr(cpfCnpjOrigemCarga, 14)
    razaoSocialOrigem = ajustarTamanhoStr(razaoSocialOrigemCarga, 70)
    destinoCarga = ajustarTamanhoStr(cpfCnpjDestinoCarga, 14)
    razaoSocialDestino = ajustarTamanhoStr(razaoSocialDestinoCarga, 70)
    
    #(P)róprio ou (A)rmazenagem Terceirizada
    retirada = localRetirada
    entrega = localEntrega

    return f'{tipo}{contratante}{nomeCont}{numero}{dataEmissao}{origemCarga}{razaoSocialOrigem}{destinoCarga}{razaoSocialDestino}{retirada}{entrega}\n'

"""
3.1.9.1. Subseção Conhecimento de Carga (CC): O preenchimento dessa Subseção é obrigatório quando 
se  tratar  de  um  transporte  Intermunicipal  ou  Interestadual.  Registra  os  detalhes  acerca  dos 
conhecimentos de carga utilizados na operação de transporte.
"""
def subsecConhecimentoCarga(numero, dataConhecimentoCarga, dataRecebimentoCarga, responsavelRecebimento, *modalTransporte):
    tipo = 'CC'
    num = numero; #9 dig
    dataCC = convertYMDtoDMY(dataConhecimentoCarga)
    dataRC = convertYMDtoDMY(dataRecebimentoCarga)
    responsavel = ajustarTamanhoStr(responsavelRecebimento, 70)
    str =  f'{tipo}{num}{dataCC}{dataRC}{responsavel}'
    for modalidade in modalTransporte: # (RO)doviário, (AQ)uaviário, (FE)rroviário ou (AE)reo
        str += modalidade

    return f'{str}\n'

"""
3.1.9.2. Subseção Local de Retirada (LR): O preenchimento dessa Subseção é obrigatório para os casos de 
Local  de  Retirada  =  (A)  Armazenagem  Terceirizada  na  Seção  Transporte  Nacional  (TN). 
"""
def subsecLocalRetiradaLR(cpfCnpjTerceirizada, nomeTerceirizada):
    tipo = 'LR'
    return f'{tipo}{identificarEmpresa(cpfCnpjTerceirizada, nomeTerceirizada)}\n'

"""
Subseção Local de Entrega (LE): O preenchimento dessa Subseção é obrigatório para os casos 
de Local de Entrega = (A) Armazenagem Terceirizada na Seção Transporte Nacional (TN).
"""
def subsecLocalEntregaLE(cpfCnpjTerceirizada, nomeTerceirizada):
    tipo = 'LE'
    return f'{tipo}{identificarEmpresa(cpfCnpjTerceirizada, nomeTerceirizada)}\n'

"""
3.1.10.  Seção Transporte Internacional (TI): Descreverá as operações exportação (EX) e Importação (IM)
"""
def secTransporteInternacional(operacao, contratante, numeroNF, dataEmissaoNfe, cpfCnpjEmpresa, nomeEmpresa, localArmazenamento):
    tipo = 'TI'
    oper = operacao # (E)xportação, (I)mportação
    contrat = contratante # (O)rigem da carga, (D)estino da carga
    num = numeroNF # 10 num
    data = convertYMDtoDMY(dataEmissaoNfe)
    empresa = ajustarTamanhoStr(cpfCnpjEmpresa, 14)
    nome = ajustarTamanhoStr(nomeEmpresa, 70)
    local = localArmazenamento # (P)róprio ou (A)rmazenagem Terceirizada

    return f'{tipo}{oper}{contrat}{num}{data}{empresa}{nome}{local}\n'

"""
3.1.10.1. Subseção de Armazenamento (LA): O preenchimento dessa Subseção é obrigatório para os 
casos de armazenagem terceirizada = (A) Transporte Internacional (TI). 
"""
def subsecArmazenagemLA(cpfCnpjEmpresa, nomeEmpresa):
    tipo = 'LA'
    return f'{tipo}{identificarEmpresa(cpfCnpjEmpresa, nomeEmpresa)}\n'

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
        file.write(subsecArmazenagemMA("12345678901234", "razaoSocial", "enderecoArmaz", "33333-333", "numer", "complementoArmaz", "bairroArmaz", "uf", "municipioArmaz"))
        file.write(secMovimentacaoInternacional('E', "idP", "razaoSocialDoAdquirenteOuFornecedor", "99/9999999-9", "1984-03-01", "1985-01-02", "numDaDUE0000000", "1986-01-03", "99/9999999-9", "1986-01-02", 'E', 'E', 'I'))
        file.write(subsecResponsavelPeloTransporte("razaoSocial", "12345678901234"))
        file.write(subsecResponsavelPeloTransporte("razaoSocial"))
        file.write(subsecLocalEntregaTER("12345678901234", "razaoSocial", "enderecoArmaz", "33333-333", "numer", "complementoArmaz", "bairroArmaz", "uf", "municipioArmaz"))
        file.write(subsecAdquirente("12345678901234", "razaoSocial", "enderecoArmaz", "33333-333", "numer", "complementoArmaz", "bairroArmaz", "uf", "municipioArmaz"))
        file.write(
            subsecNotaFiscalCabecalho('1010201010', '2017-01-11', 'E') +
            subsecNotaFiscalCabecalho('1210201010', '2017-01-11', 'S') +
            subsecNotaFiscalProduto('2323.23.66', 32,32, 999999999, 'K')       
        )
        file.write(secUtilizacaoProducao("NCMNCMNCMNCMN", 96, 56.41, 1325.4013, 'L'))
        file.write(subsecProdutoFinalProduzido("NCMProdutoPrd", 81.44, 99.41, 8121325.4019, 'K', "Esse produto foi produzido de maneira produtiva a fim de produzir o produto", "2025-11-01"))
        file.write(secUtilizacaoParaTransformacao("transformacao", 99.99, 81.412, 8121326.4019, 'L', "2025-12-21"))
        file.write(subsecProdutoFinalProduzidoTransformacao("NCMProdutoPrd", 81.44, 99.41, 8121325.4019, 'K', "2025-11-01", "Esse produto foi feito por meio de uma transformacao envolvendo produtos quimicos que envolvem carbono e hidrogenio e etc"))
        file.write(secUtilizacaoConsumo("NCMNCMNCMNCMN", 96, 56.41, 1325.4013, 'L', 2, "observacao: observa-se", "2024-09-30"))
        file.write(secFabricacao("fabricacao123", 99.99, 81.412, 8121326.4019, 'L', "2025-12-21"))
        file.write(secTransporteNacional("12345678901", "contratante pessoa fisica", "1234567890", "2022-10-01", "12345678901", "razaoSocial da origem da carga, essa e uma pessoa comum", "12345678901234", "razao social do destino da carga, essa e uma empresa", "P", "T"))
        file.write(subsecConhecimentoCarga('123456789', '2025-12-24', '2025-12-25', 'responsavel pelo recebimento todos metodos', 'RO','AQ','FE','AE'))
        file.write(subsecConhecimentoCarga('123456789', '2025-12-24', '2025-12-25', 'responsavel pelo recebimento aereo only', 'AE'))
        file.write(subsecConhecimentoCarga('123456789', '2025-12-24', '2025-12-25', 'responsavel pelo recebimento todos mas por array', *['RO','AQ','FE','AE']))
        file.write(subsecLocalRetiradaLR('12345678901', 'essa terceirizada so tem cpf mas nao cnpj'))
        file.write(subsecLocalEntregaLE('12345678901234', 'essa terceirizada tem cnpj mas nao cpf '))
        file.write(secTransporteInternacional('I', 'D', '1234567890', '2022-11-21', '12345678901', 'empresa que usa cpf aparentemente', 'P'))
        file.write(subsecArmazenagemLA('12345678901234', 'empresa responsavel pela armazenagem usando cpf'))
        return jsonify({"message": f"Arquivo {nomeArquivo} gerado", "arquivo": nomeArquivo})