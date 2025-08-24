from flask import jsonify
def formataAviso(mensagem, tipo='AVISO'):
    if tipo == 'SUCESSO':
       status = 200
    else:
       status = 201

    msg = {"tipo": tipo, "mensagem":  mensagem if isinstance(mensagem, list) else [mensagem]}
    return jsonify(msg), status
