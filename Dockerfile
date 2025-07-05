# Usar uma imagem base do Python
FROM python:3.10-slim

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o requirements.txt primeiro para otimizar o cache do Docker
COPY fontes/backend/requirements.txt .

# Instalar as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copiar os arquivos do backend para o contêiner
COPY fontes/backend/ .

# Expor a porta usada pelo Flask
EXPOSE 8088

# Comando para iniciar o servidor Flask com aguardo do banco
CMD ["sh", "-c", "python wait-for-db.py && python app.py"]
