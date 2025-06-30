"""
*********************************************************
*** Centro Federal de Educação Tecnológica - CEFET-MG ***
***          Departamento de Computação - DECOM       ***
*********************************************************

Programa: mantem variável de configuração para execução do sistema.

Descrição:
    Ao instanciar um objeto a classe irá tenta abrir o arquivo
    config.ini e:
      - se ele não existir, cria o arquivo com valores default
      - se ele existir, lê o conteúdo do arquivo, valida os valor 
        definido para as variáveis. Se inválido cancela a execução,
        senão inicializa o objeto para usar via getters os valores
        definidos.

          
Uso:
    Esta classe é instanciada e compartilhada pelo programa 
    indexa e pelos serviços api_ri e api_chat
   
Autor:
    Edson Marchetti da Silva (edson@cefetmg.br)
        
Última modificação:
    03 de junho de 2025
"""
import configparser
import os
import sys

#definindo app.ini
conteudo = '''
[env]
    portaBackend = 5000
    portaFrontend = 5173
    debug = False
    
'''

class Param:
    def __init__(self):
        self.portaBackend = 5000
        self.portaFrontend = 5173
        self.debug = False
        try:
            self.inicializa()
        except FileNotFoundError as e:
            print(f"Erro: {e}")
            sys.exit(1)
        

    def setPortaBackend(self, portaBackend):
        try:
            self.portaBackend = int(portaBackend)
        except ValueError:
            raise (f"Porta do backend definida em app.ini não é numerico")
        
    def setPortaFrontend(self, portaFrontend):
        try:
            self.portaFrontend = int(portaFrontend)
        except ValueError:
            raise (f"Porta do frontend definida em app.ini não é numerico")


    def setDebug(self, debug):
        self.debug = debug.lower() == 'true'
 

    #Getters
    def getPortaBackend(self):
        return self.portaBackend 
   
    def getPortaFrontend(self):
        return self.portaFrontend 

    def getDebug(self):
        return self.debug 
 

    def inicializa(self): 
        # Abrindo (ou criando) app.ini
        nomCfg = "app.ini"
        if not os.path.isfile(nomCfg):
            with open(nomCfg, 'w', encoding='utf-8') as arquivo:
                # Escrevendo a string no arquivo
                arquivo.write(conteudo)
                print(f"Arquivo {nomCfg} criado")
        
        # Criando o objeto ConfigParser
        config = configparser.ConfigParser()

        # Lendo o arquivo de configuração
        config.read(nomCfg)
        
        # Acessando os valores nas seções
        try:    
            self.setPortaBackend(config['env']['portaBackend'])
            self.setPortaFrontend(config['env']['portaFrontend'])
            self.setDebug(config['env']['debug'])
        except KeyError as e:
            raise (f"Erro: A chave {e} não foi encontrada na seção env do arquivo de configuração {nomCfg}.")
            

