# Projeto PQC

Este é o repositório para o projeto PQC, que inclui um frontend construído com React e Material-UI, e um backend construído com Python e Flask. O banco de dados PostgreSQL é configurado e executado usando Docker.

---

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

---

## Executando o Projeto com Docker

### Configuração do Docker

## Certifique-se de que o Docker está instalado e em execução.
 Abra um terminal e vá para o diretório do projeto.
 Execute os seguintes comandos para construir e iniciar os containers Docker:
```bash
docker-compose up --build
```
 Isso iniciará os seguintes serviços:
 - Backend: Flask rodando na porta 5000.
 - Banco de Dados: PostgreSQL rodando na porta 5432.

### Testando o Backend
 Após iniciar os containers, você pode acessar o backend no navegador ou Postman:
http://localhost:5000/api/produtos

Testando a Conexão com o Banco de Dados
 Você pode se conectar ao banco de dados PostgreSQL usando uma ferramenta como DBeaver ou psql.
 As credenciais são:
 Host: localhost
 Porta: 5432
 Banco de Dados: PQC
 Usuário: postgres
 Senha: postgres

### Usando psql:
 Execute o comando abaixo para se conectar ao banco de dados:

 ```bash
   psql -h localhost -U postgres -d PQC
```
-- Liste as tabelas para verificar se o banco de dados foi criado corretamente:
\dt

## Executando o Frontend
 Vá para o diretório fontes/front-end:
  ```bash
   cd fontes/front-end
 ```
### Instale as dependências:
```bash
   npm install
```
### Execute o servidor de desenvolvimento:
```bash
   npm start
```
### O servidor de desenvolvimento React estará disponível em:
http://localhost:3000

## Estrutura do Banco de Dados
 O banco de dados será inicializado automaticamente com as tabelas e dados definidos no arquivo PQC.sql.
 Certifique-se de que o arquivo PQC.sql está localizado na raiz do projeto e conté

 ## Observações Importantes
 Durante o desenvolvimento, alterações feitas no código do backend (fontes/backend) serão refletidas automaticamente no container Docker devido à configuração de volumes no docker-compose.yml. Não é necessário reconstruir o container após cada alteração.
  Para garantir que o script PQC.sql seja executado novamente, remova o volume associado ao banco de dados:
```bash
   docker volume rm pqc_postgres_data
```