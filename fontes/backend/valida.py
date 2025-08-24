# Valida - Comentario a seguir é necessário para visualizar acentos no frontend
# -*- coding: utf-8 -*-
import enum
import decimal
from flask import  jsonify
import xmltodict
from datetime import datetime

class Tipo(enum.Enum):
    SUCESSO = 0
    AVISO = 1
    ERRO = 2
       
class Valida:
    def __init__(self):
        self.mensagem = []

    def setLimpaMensagens(self):
        self.mensagem = []

    def temMensagem(self):
        return len(self.mensagem) > 0
   
    def getMensagens(self):
        msg = {"tipo": "AVISO", 
               "mensagem": self.mensagem}
        try:
            resposta = jsonify(msg), 201
            return resposta    
        except Exception as e:
            msg.mensagem = f"Erro indefinido {e}"      
            return msg
       
    def codCPF(self, codCPF):
        if codCPF is None:
            self.mensagem.append("Código do CPF não pode ser nulo!")
        else:
            if len(codCPF) < 1:
               self.mensagem.append("Código do CPF deve ter 11 caracteres!")

    def codCampus(self, codCampus):
        if codCampus is None:
            self.mensagem.append("Código do Campus não pode ser nulo!")
        else:
            if len(codCampus) == 0 or len(codCampus) > 2:
               self.mensagem.append("Código do Campus não pode vazio ou ter mais de 2 caracteres!")


    def codUnidade(self, codUnidade):
        if codUnidade is None:
            self.mensagem.append("Código da Unidade não pode ser nulo!")
        else:
            if len(codUnidade) == 0 or len(codUnidade) > 8:
               self.mensagem.append("Código da Unidade Organizacional não pode ser vazio ou ter mais de 8 caracteres!")

    def sglUnidade(self, sglUnidade):
        if sglUnidade is None:
            self.mensagem.append("Sigla da Unidade não pode ser nula!")
        else:
            if len(sglUnidade) == 0 or len(sglUnidade) > 10:
               self.mensagem.append("Sigla da Unidade Organizacional não ser vazio ou ter mais de 10 caracteres!")

    def codPredio(self, codPredio):
        if codPredio is None:
            self.mensagem.append("Código da Predio não pode ser nulo!")
        else:
            if len(codPredio) == 0 or len(codPredio) > 2:
               self.mensagem.append("Código do Prédio não pode ter vazio ou ter mais de 2 caracteres!")


    def codLaboratorio(self, codLaboratorio):
        if codLaboratorio is None:
            self.mensagem.append("Código do Laboratório não pode ser nulo!")
        else:
            if len(codLaboratorio) == 0 or len(codLaboratorio) > 3:
               self.mensagem.append("Código do Laboratório não pode ser vazio ou ter mais de 3 caracteres!")

    def codEmbalagem(self, codEmbalagem):
        if codEmbalagem is None:
            self.mensagem.append("Código da Embalagem não pode ser nulo!")
        else:
            if len(codEmbalagem) == 0 or len(codEmbalagem) > 10:
                self.mensagem.append("Código de Embalagem não pode ser vazio ou ter mais de 10 caracteres!")

    def nomUsuario(self, nomUsuario):
        if nomUsuario is None:
            self.mensagem.append("Nome do Usuário não pode ser nulo!")
        else:
            if len(nomUsuario) == 0 or len(nomUsuario) > 50:
               self.mensagem.append("Nome do usuário não ser vazio ou ter mais de 50 caracteres!")


    def idtTipoUsuario(self, idtTipoUsuario):
        if idtTipoUsuario is None:
            self.mensagem.append("Tipo de Usuário não pode ser nulo!")
        else:
            if idtTipoUsuario not in ('A', 'R'):
               self.mensagem.append(f"Tipo de usuário {idtTipoUsuario} não pode diferente de A ou R!")


    def nomLocal(self, nomLocal):
        if nomLocal is None:
            self.mensagem.append("Nome do Local não pode ser nulo!")
        else:
            if len(nomLocal) == 0 or len(nomLocal) > 100:
               self.mensagem.append("Nome do Local de Estocagem não ser vazio ou ter mais de 100 caracteres!")

           
    def nomCampus(self, nomCampus):
        if nomCampus is None:
            self.mensagem.append("Nome do Campus não pode ser nulo!")
        else:
            if len(nomCampus) == 0 or len(nomCampus) > 30:
               self.mensagem.append("Nome do campus não pode ser vazio ou ter mais de 30 caracteres!")

   
    def nomUnidade(self, nomUnidade):
        if nomUnidade is None:
            self.mensagem.append("Nome da Unidade Organizacional não pode ser nulo!")
        else:
            if len(nomUnidade) == 0 or len(nomUnidade) > 80:
               self.mensagem.append("Nome da Unidade Organizacional não pode ser vazio ou ter mais de 80 caracteres!")

    def codProduto(self, codProduto):
        if codProduto is None:
            self.mensagem.append("Código do produto não pode ser nulo!")
            return
        try:
            cod = int(codProduto)
            if cod <= 0:
               self.mensagem.append(f"Código do produto {codProduto} tem de ser maior que 0!") 
        except ValueError:
            self.mensagem.append(f"Código do produto {codProduto} não é numérico!")
        
    def ncm(self, ncm):
        if ncm is not None:
            try:
                ncm_numerico = int(ncm)
    
                if ncm_numerico <= 0:
                   self.mensagem.append(f"NCM {ncm} tem de ser maior que 0!") 
                if len(str(ncm_numerico)) > 8:
                    self.mensagem.append("NCM deve conter 8 dígitos numéricos.")
            except ValueError:
                self.mensagem.append(f"NCM {ncm} não é numérico!")

    def nomProduto(self, nomProduto):
        if nomProduto is None:
            self.mensagem.append("Nome do produto não pode ser nulo!")
        else:
            if len(nomProduto) == 0 or len(nomProduto) > 128:
               self.mensagem.append("Nome do produto não pode ser vazio ou ter mais de 128 caracteres!")
 
    def nomLista(self, nomLista):
        if nomLista is None:
            self.mensagem.append("Nome da lista não pode ser nulo!")
        else:
            if len(nomLista) == 0 or len(nomLista) > 15:
               self.mensagem.append("Nome da lista não pode ser vazio ou ter mais de 15 caracteres!")


    def qtdEstoque(self, qtdEstoque):
        if qtdEstoque is None or qtdEstoque == '':
            self.mensagem.append("Quantidade de estoque não pode ser nula!")
            return
        try:
            valorFloat = float(qtdEstoque)
            if valorFloat <= 0:
                self.mensagem.append("A quantidade movimentada do estoque deve ser maior que zero!")
        except ValueError:
            self.mensagem.append("A quantidade de movimentação no estoque não é um número válido!")
          

    def qtdTransferir(self, qtdTransferir):
        if qtdTransferir is None:
            self.mensagem.append("Quantidade a transferir não pode ser nula!")
            return
        try:
            valorInt = int(str(qtdTransferir))
            if valorInt <= 0:
                self.erros.append("Quantidade movimentação estoque tem de ser maior que zeros!")
        except (int.InvalidOperation, ValueError):
            self.mensagem.append("Quantidade de movimentação no estoque não é numérica!")     

    def transferencia(self, qtdEstoque, qtdTransferir):
        if qtdTransferir > qtdEstoque:
            self.mensagem.append("Quantidade a transferir não pode maior que a quantidade em estoque!")
            return
     
    def perPureza(self, perPureza):
        if perPureza is None:
            self.mensagem.append("Percentual de Pureza não pode ser nulo!")
            return
        
        try:
            valorDecimal = decimal.Decimal(str(perPureza))
            if valorDecimal < 0 or valorDecimal > 100:
                self.erros.append("Percentual de Pureza deve estar entre 0 e 100.")
            else:
                if valorDecimal.as_tuple().exponent < -2:
                     self.erros.append("Percentual de Pureza deve ter no máximo 2 casas decimais.")
        except (decimal.InvalidOperation, ValueError):
            self.mensagem.append("Percentual de Pureza deve ser um número (999,99) válido.")     

    def vlrDensidade(self, vlrDensidade):
        if vlrDensidade is None:
            self.mensagem.append("Densidade do produto não pode ser nula!")
        
        try:
            valorDecimal = decimal.Decimal(str(vlrDensidade))
            if valorDecimal < 0.5 or valorDecimal > 20:
                self.erros.append("A densidade deve estar entre 0,5 à 20 g/cm3.")
            else:
                if valorDecimal.as_tuple().exponent < -2:
                     self.erros.append("Densidade deve ter no máximo 2 casas decimais.")
        except (decimal.InvalidOperation, ValueError):
            self.mensagem.append("Densidade deve ser um número (999.99) válido.")
        
    def idtAtivo(self, idtAtivo):
        if idtAtivo is None:
            self.mensagem.append("Indicador de Produto Ativo/Inativo não pode ser nulo!")
        else:
            if not isinstance(idtAtivo, bool):
                self.mensagem.append("O indicador de Produto Ativo/Inativo deve ser um valor booleano!")

    def datMovto(self, datMovto):
        if datMovto is None:
            self.mensagem.append("Data do movimento não pode ser nula!")
            return
        try:
            datetime.strptime(datMovto, '%Y-%m-%d')
        except ValueError:
            self.mensagem.append(f"A Data de movimentação '{datMovto}' não é uma data válida. Use o formato YYYY-MM-DD.")


    def datValidade(self, datValidade):
        if not datValidade:
            self.mensagem.append("Data de Validade do produto não pode ser nula!")
            return

        try:
            datetime.strptime(datValidade, '%Y-%m-%d')
        except ValueError:
            self.mensagem.append(f"A Data de Validade '{datValidade}' não é uma data válida. Use o formato YYYY-MM-DD.")


    def idtTipoMovto(self, idtTipoMovto):
        if idtTipoMovto is None:
            self.mensagem.append("Tipo de movimento não pode ser nulo!")
        else:
            if idtTipoMovto not in ('IM', 'EC', 'ED', 'TE', 'TS', 'IN', 'AE', 'AC', 'TS', 'TE'):
                self.mensagem.append(f"Tipo de movimento {idtTipoMovto} inválido!")
       

    def codOrgaoControle(self, codOrgaoControle):
        if codOrgaoControle is None:
            self.mensagem.append("Código do Orgão de Controle não pode ser nulo!")
        else:
            try:
                cod = int(codOrgaoControle)
                if cod < 0 or cod > 32767:
                    self.mensagem.append("Código do Orgão de Controle inválido!")
            except:
                self.mensagem.append(f"Código do Orgão de Controle {codOrgaoControle} não é numérico!")
    
    def nomOrgaoControle(self, nomOrgaoControle):
        if nomOrgaoControle is None:
            self.mensagem.append("Nome do Orgão de Controle não pode ser nulo!")
        else:
            if len(nomOrgaoControle) == 0 or len(nomOrgaoControle) > 50:
                self.mensagem.append("Nome do Orgão de Controle não pode ser vazio ou ter mais de 50 caracteres!")


    def mes(self, mes):
        if mes is None:
            self.mensagem.append("Mes não pode ser nulo!")
        if mes < 1 or mes > 12:
            self.mensagem.append(f"Mes = {mes} inválido!")

    def ano(self, ano):
        if ano is None:
            self.mensagem.append("Ano não pode ser nulo!")

    def nfeXML(self, nfeXML):
        if nfeXML is None:
            self.mensagem.append("Nota Fiscal Eletrônica não pode ser nula!")
        else:
            try:
                xml_dict = xmltodict.parse(nfeXML)
            except:
                self.mensagem.append("XML da Nota Fiscal Eletrônica não pode ser convertido para Json!")
 