# Projeto PQC

Este é o repositório para o projeto PQC, que inclui um frontend construído com React e Material-UI, e um backend construído com Python e Flask. O banco de dados PostgreSQL é configurado e executado usando Docker.

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Python](https://www.python.org/)
- [Docker](https://www.docker.com/)

## Executando o Backend

### Configuração do Ambiente Virtual

1. Crie um ambiente virtual:

   ```bash
   python -m venv venv
   ```

2. Ative o ambiente virtual:

   ```bash
   # No Windows:
   venv\Scripts\activate

   # No macOS/Linux:
   source venv/bin/activate
   ```

3. Instale as dependências:

   ```bash
   pip install Flask psycopg2-binary
   ```

4. Execute o servidor Flask:
   ```bash
   python fontes/backend/app.py
   ```

O servidor Flask estará disponível em `http://localhost:5000`.

## Executando o Frontend

1. Vá para o diretório `fontes/front-end`:

   ```bash
   cd fontes/front-end
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   npm start
   ```

O servidor de desenvolvimento React estará disponível em `http://localhost:3000`.

## Configurando e Executando o Banco de Dados com Docker

### Configuração do Docker

1. Certifique-se de que o Docker está instalado e em execução.
2. Abra um terminal e vá para o diretório do projeto.
3. Execute os seguintes comandos para construir e iniciar o contêiner Docker:

   ```bash
   docker-compose up --build
   ```

O banco de dados PostgreSQL estará disponível em `localhost:5432` com as seguintes credenciais:

- **Banco de Dados**: PQC
- **Usuário**: postgres
- **Senha**: postgres

## Estrutura do Banco de Dados

O banco de dados será inicializado com as tabelas e dados definidos no arquivo `PQC.sql`.

### Testando a Conexão com o Banco de Dados

1. Conecte-se ao banco de dados PostgreSQL usando psql:

   ```bash
   psql -h localhost -U postgres -d PQC
   ```

2. Liste as tabelas para verificar se o banco de dados foi criado corretamente:
   ```sql
   \dt
   ```

## Contribuindo
````
