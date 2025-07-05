# PQC - Sistema de Controle de Produtos Químicos

Sistema para controle e gerenciamento de produtos químicos do CEFET-MG.

## 🚀 Como Configurar o Projeto

### Pré-requisitos
- **Docker** (recomendado) OU
- **Node.js** (versão 18+) e **PostgreSQL** (para execução local)

---

## 🐳 Opção 1: Execução com Docker (RECOMENDADO)

### Para Windows:
1. Clone o repositório
2. Execute o script automatizado:
   ```bash
   start-docker.bat
   ```

### Para Linux/Mac ou comandos manuais:
```bash
# Construir e iniciar todos os serviços
docker-compose up --build -d

# Ver logs em tempo real
docker-compose logs -f

# Parar os serviços
docker-compose down
```

### Acesso:
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:8088
- **Banco de dados**: localhost:5432 (usuário: postgres, senha: postgres)

---

## 💻 Opção 2: Execução Local (Desenvolvimento)

### 1. Configurar o Banco de Dados
```sql
-- No PostgreSQL, executar o arquivo PQC.sql
psql -U postgres -d PQC -f PQC.sql
```

### 2. Backend (Python/Flask)
```bash
cd fontes/backend

# Instalar dependências
pip install -r requirements.txt

# Executar
python app.py
```

### 3. Frontend (React/Vite)
```bash
cd fontes/front-end

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

---

## 🛠️ Comandos Úteis

### Frontend (Vite)
```bash
npm run dev        # Servidor de desenvolvimento (porta 3001)
npm run build      # Build para produção
npm run preview    # Preview do build
npm run test       # Executar testes
```

### Docker
```bash
docker-compose up -d          # Iniciar em background
docker-compose logs backend   # Ver logs do backend
docker-compose logs database  # Ver logs do banco
docker-compose down -v        # Parar e limpar volumes
```

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

---

## Executando o Projeto com Docker

### Configuração do Docker

1. Certifique-se de que o Docker está instalado e em execução.
2. Abra um terminal e vá para o diretório do projeto.
3. Execute os seguintes comandos para construir e iniciar os containers Docker:

```bash
docker-compose up --build
```

Isso iniciará os seguintes serviços:
- **Backend**: Flask rodando na porta 8088
- **Banco de Dados**: PostgreSQL rodando na porta 5432

### Testando o Backend
Após iniciar os containers, você pode acessar o backend no navegador ou Postman:
http://localhost:8088/api/produtos

### Testando a Conexão com o Banco de Dados
Você pode se conectar ao banco de dados PostgreSQL usando uma ferramenta como DBeaver ou psql.

**Credenciais:**
- Host: localhost
- Porta: 5432
- Banco de Dados: PQC
- Usuário: postgres
- Senha: postgres

**Usando psql:**
```bash
docker exec -it pqc_postgres psql -U postgres -d PQC
```

Liste as tabelas para verificar se o banco de dados foi criado corretamente:
```sql
\dt
```

## Executando o Frontend (Vite)

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
npm run dev
```

**⚠️ IMPORTANTE:** Com a migração para Vite, **NÃO USE MAIS** `npm start`. Use `npm run dev` para desenvolvimento.

### Comandos disponíveis:
- `npm run dev` - Servidor de desenvolvimento (porta 3001)
- `npm run build` - Build para produção  
- `npm run preview` - Preview do build de produção
- `npm run test` - Executar testes

O servidor de desenvolvimento Vite estará disponível em:
http://localhost:3001

## Estrutura do Banco de Dados
O banco de dados será inicializado automaticamente com as tabelas e dados definidos no arquivo PQC.sql.
Certifique-se de que o arquivo PQC.sql está localizado na raiz do projeto.

## Observações Importantes
- Durante o desenvolvimento, alterações feitas no código do backend (fontes/backend) serão refletidas automaticamente no container Docker devido à configuração de volumes no docker-compose.yml.
- **Frontend migrado para Vite**: Use `npm run dev` ao invés de `npm start`
- Para garantir que o script PQC.sql seja executado novamente, remova o volume associado ao banco de dados:
```bash
docker volume rm pqc_pgdata
```

---

## 👥 Para Novos Desenvolvedores

### ⚡ Setup em 2 minutos:
1. **Clone o projeto**
2. **Execute**: `start-docker.bat` (Windows) ou `./start-docker.sh` (Linux/Mac)
3. **Pronto!** Acesse http://localhost:3001

### 📚 Documentação completa:
- **[SETUP-DESENVOLVEDORES.md](SETUP-DESENVOLVEDORES.md)** - Guia completo de configuração
- **[COMANDOS-UTEIS.md](COMANDOS-UTEIS.md)** - Todos os comandos que você vai precisar
- **[DOCKER-README.md](DOCKER-README.md)** - Específico para Docker

### 🛠️ Ferramentas recomendadas:
- **Docker Desktop** (essencial)
- **VS Code** (editor recomendado)
- **Git** (controle de versão)