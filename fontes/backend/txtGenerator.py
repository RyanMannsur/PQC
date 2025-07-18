from datetime import datetime
from routes.produto_routes import get_produtos
from routes.produto_routes import obter_produto
from app import app

# Passo 0 - Executando o arquivo
# Abra um novo terminal, execute os seguintes comandos:
# docker exec -it backend sh
# python txtGenerator.py


# Passo 1 - Nome do arquivo e linha de identificação
arquivoDeMapas = "[]" #não sei, 2 caracteres
date = datetime.now()
mesesPt = [
    "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
    "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"
]
mes = mesesPt[date.month-1] # mostra JAN, FEB, etc.
ano = date.year
cnpj = "[............]" #14 caracteres

tipoIdentificacao = "EM" #não sei, 2 caracteres

#secao de indentificacao da empresa, mudar depois caso necessário
# 0 - comercio nacional | 1 - comercio internacional | 2 - produção | 3 - transformação | 4 - consumo | 5 fabricação | 6 - transporte | 7 - armazenamento
secaoIdentificacao = [False, False, False, False, True, False, False, True]

nomeArquivo = f'{arquivoDeMapas}{ano}{mes}{cnpj}.txt'
with app.app_context():
  
    with open(nomeArquivo, 'w', encoding='utf-8') as file:
        file.write(f'{tipoIdentificacao}{cnpj}{mes}{ano}')
        for secao in secaoIdentificacao:
            file.write('1' if secao else '0')
        file.write('\n')

        file.write('DG\n') #Seção demonstrativo geral
        # TODO: identificar diferença entre produtos compostos e produtos controlados para fazer a 
        # distinção no documento. Por hora, assume-se que tudo é produto controlado(PR)
        
        produtos = get_produtos().get_json()
        for produto in produtos:
            file.write('PR[.........]') # TODO: adicionar no banco de dados o código do produto
            perpureza = produto[3]
            if perpureza is None:
                perpureza = 0.0
            vlrDensidade = produto[4]
            if vlrDensidade is None:
                vlrDensidade = 0.0
            file.write(f'{produto[1]}{int(round(float(perpureza), 0)):03d}') # nomproduto e perpureza
            file.write(f'{round(float(vlrDensidade), 2):05.2f}\n'.replace('.', ',')) # vlrdensidade
            
               