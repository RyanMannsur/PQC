class NFe:
    """
    Classe para encapsular e fornecer acesso seguro aos dados de um JSON de NF-e.
    """

    def __init__(self, nfe_json):
        """
        Inicializa a classe com o JSON da NF-e.

        Args:
            nfe_json (dict): O dicionário JSON da nota fiscal.
        """
        self.data = nfe_json
        self.infNFe = self.data.get('nfeProc', {}).get('NFe', {}).get('infNFe', {})

    def get_chave_acesso(self):
        """Retorna a chave de acesso da NF-e (Id)."""
        return self.infNFe.get('@Id')

    def get_ide(self):
        """Retorna a estrutura completa de identificação (ide)."""
        return self.infNFe.get('ide')

    def get_emit(self):
        """Retorna a estrutura completa do emitente (emit)."""
        return self.infNFe.get('emit')

    def get_emit_cnpj(self):
        """Retorna o CNPJ do emitente."""
        emit = self.get_emit()
        return emit.get('CNPJ') if emit else None

    def get_emit_nome(self):
        """Retorna o nome (xNome) do emitente."""
        emit = self.get_emit()
        return emit.get('xNome') if emit else None
    
    def get_dest(self):
        """Retorna a estrutura completa do destinatário (dest)."""
        return self.infNFe.get('dest')

    def get_dest_cnpj(self):
        """Retorna o CNPJ do destinatário."""
        dest = self.get_dest()
        return dest.get('CNPJ') if dest else None

    def get_dest_nome(self):
        """Retorna o nome (xNome) do destinatário."""
        dest = self.get_dest()
        return dest.get('xNome') if dest else None

    def get_valor_total_nota(self):
        """Retorna o valor total da nota fiscal (vNF)."""
        return self.infNFe.get('total', {}).get('ICMSTot', {}).get('vNF')

    def get_detalhes_produtos(self):
        """
        Retorna uma lista de detalhes de produtos (det).
        Trata o caso em que 'det' é um único dicionário ou uma lista.
        """
        detalhes = self.infNFe.get('det')
        if not detalhes:
            return []
        
        # Se 'det' for um dicionário, coloca-o em uma lista para padronizar
        if isinstance(detalhes, dict):
            return [detalhes]
        
        # Caso já seja uma lista
        return detalhes

    def get_duplicatas(self):
        """
        Retorna uma lista de duplicatas (dup) da seção de cobrança.
        Trata o caso em que 'dup' é um único dicionário ou uma lista.
        """
        cobranca = self.infNFe.get('cobr', {})
        duplicatas = cobranca.get('dup')

        if not duplicatas:
            return []

        # Se 'dup' for um dicionário, coloca-o em uma lista para padronizar
        if isinstance(duplicatas, dict):
            return [duplicatas]
        
        # Caso já seja uma lista
        return duplicatas

"""
# --- Exemplo de Uso Não apagar serve de referência para manutenção
# Suponha que seu JSON esteja em um arquivo ou variável
nfe_json = {
    "nfeProc": {
        "@versao": "4.00",
        "@xmlns": "http://www.portalfiscal.inf.br/nfe",
        "NFe": {
            "@xmlns": "http://www.portalfiscal.inf.br/nfe",
            "infNFe": {
                "@versao": "4.00",
                "@Id": "NFe31250123747090000184550010000339771919340484",
                "ide": {
                    "cUF": "31",
                    "cNF": "91934048",
                    "natOp": "VENDA DENTRO DO ESTADO",
                    "mod": "55",
                    "serie": "1",
                    "nNF": "33977",
                    "dhEmi": "2025-01-16T08:21:10-03:00",
                    "tpNF": "1",
                    "idDest": "1",
                    "cMunFG": "3106200",
                    "tpImp": "1",
                    "tpEmis": "1",
                    "cDV": "4",
                    "tpAmb": "1",
                    "finNFe": "1",
                    "indFinal": "1",
                    "indPres": "0",
                    "procEmi": "0",
                    "verProc": "5.1.11.08"
                },
                "emit": {
                    "CNPJ": "23747090000184",
                    "xNome": "SCIAVICCO COMERCIO E IND. LTDA",
                    "xFant": "SCIAVICCO COMERCIO E IND. LTDA",
                    "enderEmit": {
                        "xLgr": "RUA NIQUELINA",
                        "nro": "921",
                        "xCpl": "Sala 03",
                        "xBairro": "SANTA EFIGENIA",
                        "cMun": "3106200",
                        "xMun": "BELO HORIZONTE",
                        "UF": "MG",
                        "CEP": "30260100",
                        "cPais": "1058",
                        "xPais": "BRASIL",
                        "fone": "3134672819"
                    },
                    "IE": "0625667290056",
                    "CRT": "3"
                },
                "dest": {
                    "CNPJ": "17220203000196",
                    "xNome": "CENTRO FEDERAL DE EDUCACAO TECNOLOGICA DE MINAS GERAIS",
                    "enderDest": {
                        "xLgr": "AV. AMAZONAS",
                        "nro": "5253",
                        "xBairro": "NOVA SUICA",
                        "cMun": "3106200",
                        "xMun": "BELO HORIZONTE",
                        "UF": "MG",
                        "CEP": "30480000",
                        "cPais": "1058",
                        "xPais": "BRASIL",
                        "fone": "3133197145"
                    },
                    "indIEDest": "2",
                    "email": "analopescorrea@ig.com.br"
                },
                "autXML": {
                    "CNPJ": "04065081000169"
                },
                "det": {
                    "@nItem": "1",
                    "prod": {
                        "cProd": "007606",
                        "cEAN": "SEM GTIN",
                        "xProd": "DICLOROMETANO PA ACS 1L - SCIAVICCO",
                        "NCM": "29031200",
                        "CFOP": "5102",
                        "uCom": "LT",
                        "qCom": "4.0000",
                        "vUnCom": "79.8000000000",
                        "vProd": "319.20",
                        "cEANTrib": "SEM GTIN",
                        "uTrib": "LT",
                        "qTrib": "4.0000",
                        "vUnTrib": "79.8000000000",
                        "indTot": "1",
                        "xPed": "E 2024NE001208",
                        "nItemPed": "1",
                        "rastro": {
                            "nLote": "2312012",
                            "qLote": "4.000",
                            "dFab": "2023-06-30",
                            "dVal": "2027-06-30"
                        }
                    },
                    "imposto": {
                        "vTotTrib": "102.43",
                        "ICMS": {
                            "ICMS00": {
                                "orig": "0",
                                "CST": "00",
                                "modBC": "3",
                                "vBC": "319.20",
                                "pICMS": "18.0000",
                                "vICMS": "57.46"
                            }
                        },
                        "IPI": {
                            "cEnq": "999",
                            "IPITrib": {
                                "CST": "99",
                                "vBC": "0.00",
                                "pIPI": "0.0000",
                                "vIPI": "0.00"
                            }
                        },
                        "PIS": {
                            "PISAliq": {
                                "CST": "01",
                                "vBC": "319.20",
                                "pPIS": "0.6500",
                                "vPIS": "2.07"
                            }
                        },
                        "COFINS": {
                            "COFINSAliq": {
                                "CST": "01",
                                "vBC": "319.20",
                                "pCOFINS": "3.0000",
                                "vCOFINS": "9.58"
                            }
                        }
                    },
                    "infAdProd": "DICLOROMETANO PA ACS 1L -"
                },
                "total": {
                    "ICMSTot": {
                        "vBC": "319.20",
                        "vICMS": "57.46",
                        "vICMSDeson": "0.00",
                        "vFCP": "0.00",
                        "vBCST": "0.00",
                        "vST": "0.00",
                        "vFCPST": "0.00",
                        "vFCPSTRet": "0.00",
                        "vProd": "319.20",
                        "vFrete": "0.00",
                        "vSeg": "0.00",
                        "vDesc": "0.00",
                        "vII": "0.00",
                        "vIPI": "0.00",
                        "vIPIDevol": "0.00",
                        "vPIS": "2.07",
                        "vCOFINS": "9.58",
                        "vOutro": "0.00",
                        "vNF": "319.20",
                        "vTotTrib": "102.43"
                    },
                    "retTrib": {
                        "vBCIRRF": "319.20"
                    }
                },
                "transp": {
                    "modFrete": "0",
                    "transporta": {
                        "CNPJ": "23747090000184",
                        "xNome": "SCIAVICCO",
                        "IE": "0625667290056",
                        "UF": "MG"
                    },
                    "vol": {
                        "qVol": "1",
                        "esp": "CX",
                        "pesoL": "4.000",
                        "pesoB": "4.000"
                    }
                },
                "cobr": {
                    "fat": {
                        "nFat": "33977",
                        "vOrig": "319.20",
                        "vDesc": "0.00",
                        "vLiq": "319.20"
                    },
                    "dup": {
                        "nDup": "001",
                        "dVenc": "2025-01-26",
                        "vDup": "319.20"
                    }
                },
                "pag": {
                    "detPag": {
                        "indPag": "1",
                        "tPag": "01",
                        "vPag": "319.20"
                    }
                },
                "infAdic": {
                    "infCpl": "DECLARAMOS QUE O(S) PRODUTO(S) ESTA(AO) DEVIDAMENTE ACONDICIONADO PARA SUPORTAR(EM) OS RISCOS NORMAIS DE CARGA, DESCARGA, TRANSBORDO E TRANSPORTE CONFORME REGULAMENTACAO EM VIGOR. EMPENHO N: E 2024NE001208 ENDERECO DE ENTREGA: Av. Amazonas, 5.253, Nova Suica, Belo Horizonte, MG, Brasil. CEP: 30.421-169. Pedir para entregar no Departamento de Quimica. Telefone e Whatsapp: 3319-7137 DADOS PARA PAGAMENTO: BANCO DO BRASIL AGENCIA: 1626-8 CC: 89183-5 Trib. Aprox. R$:102,43 Federal e R$:0,00 Estadual Fonte: IBPT ."
                }
            },
            "Signature": {
                "@xmlns": "http://www.w3.org/2000/09/xmldsig#",
                "SignedInfo": {
                    "CanonicalizationMethod": {
                        "@Algorithm": "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"
                    },
                    "SignatureMethod": {
                        "@Algorithm": "http://www.w3.org/2000/09/xmldsig#rsa-sha1"
                    },
                    "Reference": {
                        "@URI": "#NFe31250123747090000184550010000339771919340484",
                        "Transforms": {
                            "Transform": [
                                {
                                    "@Algorithm": "http://www.w3.org/2000/09/xmldsig#enveloped-signature"
                                },
                                {
                                    "@Algorithm": "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"
                                }
                            ]
                        },
                        "DigestMethod": {
                            "@Algorithm": "http://www.w3.org/2000/09/xmldsig#sha1"
                        },
                        "DigestValue": "vQXCE5v/8MoCWNarGC1flCzeUXo="
                    }
                },
                "SignatureValue": "CNpeVLYDbGu20qrOuq3o+05aQDvjZQgEZEEmle0KKmYirMNs53ph+SOFhoKz+jgY+mHN+h4Y+m/UpKEGwACmj1SXs4LHQMAVYYuaB3naRi7kkBRFP7hfrkX5pPOHVsy5dzC663vKYD8jsXzDeTJRxw1YdWg7lYxVycEbbrBxOSXqUCbYbd52wefhsHCPdx/ivfGNRcqgtNyF26nNRvWjIstWJpfuQRbFFfMRb4UFuLoVeRDw8Zq6iAogAcx02V82+5vqnHBFFCf9+/79aXQVxSLga5ZrKDkcdy2D8tMGqHg1Oh+GonKDHO9lxKA+irmv+LboiN6Hq/q2+tNKcBMpyg==",
                "KeyInfo": {
                    "X509Data": {
                        "X509Certificate": "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"
                    }
                }
            }
        },
        "protNFe": {
            "@versao": "4.00",
            "infProt": {
                "tpAmb": "1",
                "verAplic": "J-3.2.76",
                "chNFe": "31250123747090000184550010000339771919340484",
                "dhRecbto": "2025-01-16T08:32:34-03:00",
                "nProt": "131256420720498",
                "digVal": "vQXCE5v/8MoCWNarGC1flCzeUXo=",
                "cStat": "100",
                "xMotivo": "Autorizado o uso da NF-e"
            }
        }
    }
}
"""
