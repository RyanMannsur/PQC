# db.py
import psycopg2
import logging
from config import DB_CONFIG
import enum
from flask import jsonify, current_app

class Mode(enum.Enum):
    SELECT = 1
    BEGIN = 2
    DEFAULT = 3
    COMMIT = 4


"""
    Executa uma comando SQL com tratamento de erros e
    controle de transação. 
    retorna os resultados (se houver).

    Args:
        sql (str): A consulta SQL com placeholders.
        params (tuple ou dict): Os parâmetros a serem substituídos na consulta.
        mode: pode ser uma das 4 constantes
          BEGIN -> só conecta ou inicia uma transaçao explicita)
          DEFAULT -> conecta se não houver conexão e commita se not inTransactio
          COMMIT -> só comita (fim de transação explicita)
          SELECT -> espera retornar dados
                          
    Returns:
        list: Uma lista de resultados da consulta 
        (se for um SELECT), ou None em caso de erro ou outras consultas.
    """
class Db:
    def __init__(self):
        self.debug = current_app.config["DEBUG_MODE"]
        print(self.debug)
        self.conn = None
        self.cursor = None
        self.inTransaction = False
        self.idInsert = None
        self.tipo= "SUCESSO"  # AVISO ou ERRO
        self.mensagem = []
        self.qtdAtu = 0

        logging.basicConfig(level=logging.ERROR,
                            filename='app.log',
                            filemode='a',
                            format='%(asctime)s - %(levelname)s - %(message)s')

    def execSql(self, sql: str, params: tuple=None, mode: Mode=Mode.DEFAULT, atuIdInsert: bool =False):
        results = None
        try:
            if mode == Mode.BEGIN:
                self.inTransaction = True
                sql = "BEGIN;\n" + sql
            
            if not self.conn:    
                self.conn = self._get_connection()
                self.cursor = self.conn.cursor()
                self.mensagem = []
            
            if self.debug:
                full_sql = self.cursor.mogrify(sql, params).decode("utf-8")
                print("🛢️ Mostrando SQL")
                print(full_sql)
                print(" Fim Sql 🛢️")

            self.cursor.execute(sql, params)
            
            if mode == Mode.SELECT:
                results = self.cursor.fetchall()
                return results
            
            if atuIdInsert:
                # busca o id da linha inserida
                self.idInsert = self.cursor.fetchone()[0]
                print(f"resposta {self.idInsert}")

            self.qtdAtu += self.cursor.rowcount

            if mode == Mode.COMMIT:
                self.mensagem.append(f"Transação realizada com sucesso{self._getMsgAtu()}")
                self.inTransaction = False
            else:    
                if self.inTransaction:
                    results = ''
                    return results
                
                self.mensagem.append(f"Atualização realizada com sucesso{self._getMsgAtu()}")

            self.conn.commit()
            results = {"tipo": self.tipo, "mensagem": self.mensagem}
            return jsonify(results), 200
        except Exception as e:
            self.tipo = "ERRO"
            try:
                self.mensagem.append(str(e))
                logging.error(str(e))
            except Exception as log_err:
                self.mensagem.append("Erro desconhecido")
                logging.error("Erro ao logar exceção: %s", log_err)

            if self.conn:
                self.conn.rollback()
             
            results = {"tipo": "ERRO", "mensagem": self.mensagem}
            print(results)
            return jsonify(results), 401
        finally:
            if self.debug:       
                print("Resposta API")
                print(results)
                print("Fim Resposta API")

            if self.conn and not self.inTransaction:
                self.cursor.close()
                self.conn.close()
                self.conn = None
             

    def getIdInsert(self):
        return self.idInsert
    
    def _get_connection(self):
        return psycopg2.connect(**DB_CONFIG)
    
    def _getMsgAtu(self):
        msgAtu = ''
        if self.qtdAtu == 0:
            return ''
        
        if self.qtdAtu == 1:
            msgAtu = 'registro atualizado!'
        else:
            if self.qtdAtu > 1:
                msgAtu = 'registros atualizados!'
        return f" - {self.qtdAtu} {msgAtu}"

    def getErro(self, e):
        try:
            results = {"tipo": self.tipo, "mensagem": [f"{self.mensagem}: {e}"]}
        except Exception:
            results = {"tipo": self.tipo, "mensagem": "Erro desconhecido ao formatar mensagem"}

        return jsonify(results), 500