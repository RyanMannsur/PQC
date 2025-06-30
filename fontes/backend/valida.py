# Valida - Comentario a seguir é necessário para visualizar acentos no frontend
# -*- coding: utf-8 -*-
import json
import enum
from datetime import datetime
from flask import  jsonify

class Tipo(enum.Enum):
    SUCESSO = 0
    AVISO = 1
    ERRO = 2
       
class Valida:
    def __init__(self):
        self.mensagem = []

    def temMensagem(self):
        print(self.mensagem)
        return len(self.mensagem) > 0

    def getMensagensDict(self):
        return {"tipo": "AVISO", 
               "mensagem": self.mensagem}
   
    def getMensagens(self):
        msg = {"tipo": "AVISO", 
               "mensagem": self.mensagem}
        try:
            resposta = jsonify(msg), 400
            return resposta    
        except Exception as e:
            msg.mensagem = "Erro indefinido {e}"      
            return msg
       

    def codCampus(self, codCampus):
        if codCampus is None:
            self.mensagem.append("Código do Campus não pode ser nulo!")

    def codUnidade(self, codUnidade):
        if codUnidade is None:
            self.mensagem.append("Código da Unidade não pode ser nulo!")

    def codPredio(self, codPredio):
        if codPredio is None:
            self.mensagem.append("Código da Predio não pode ser nulo!")

    def codLaboratorio(self, codLaboratorio):
        if codLaboratorio is None:
            self.mensagem.append("Código do Laboratório não pode ser nulo!")
           

    def codProduto(self, codProduto):
      if codProduto is None:
            self.mensagem.append("Código do produto (NCM) não pode ser nulo!")

    def nomProduto(self, nomProduto):
        if nomProduto is None:
            self.mensagem.append("Nome do produto não pode ser nulo!")
        else:
            if len(nomProduto) > 128:
               self.mensagem.append("Nome do produto não pode ter mais de 128 caracteres!")
 
    def nomLista(self, nomLista):
        if nomLista is None:
            self.mensagem.append("Nome da lista não pode ser nulo!")
        else:
            if len(nomLista) > 15:
               self.mensagem.append("Nome da lista não pode ter mais de 15 caracteres!")

    def perPureza(self, perPureza):
        if perPureza is None:
            self.mensagem.append("Percentual de Pureza não pode ser nulo!")

    def vlrDensidade(self, vlrDensidade):
        if vlrDensidade is None:
            self.mensagem.append("Densidade do produto não pode ser nula!")

    def uniMedida(self, uniMedida):
        if uniMedida is None:
            self.mensagem.append("Unidade de medida do produto não pode ser nula!")

    def datMovto(self, datMovto):
        if datMovto is None:
            self.mensagem.append("Data do movimento não pode ser nula!")

    def idtTipoMovto(self, idtTipoMovto):
        if idtTipoMovto is None:
            self.mensagem.append("Tipo de movimento não pode ser nulo!")
       
    def idtTipoMovto(self, codEmbalagem):
        if codEmbalagem is None:
            self.mensagem.append("Código de embalagem não pode ser nulo!")
 
    def uniMedida(self, uniMedida):
        if uniMedida is None:
            self.mensagem.append("Unidade de medida não pode ser nulo!")

    def mes(self, mes):
        if mes is None:
            self.mensagem.append("Mes não pode ser nulo!")
        if mes < 1 or mes > 12:
            self.mensagem.append(f"Mes = {mes} inválido!")

    def ano(self, ano):
        if ano is None:
            self.mensagem.append("Ano não pode ser nulo!")
 