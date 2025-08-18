# PQC - Sistema de Controle de Produtos Químicos

Sistema para controle e gerenciamento de produtos químicos do CEFET-MG.

## 🚀 Pré-requisitos

### Opção 1 - Com Docker (RECOMENDADO):
- **Docker Desktop** instalado e funcionando
- **Git** para clonar o repositório

### Opção 2 - Sem Docker (Desenvolvimento):
- **Node.js** (versão 18+)
- **PostgreSQL** (versão 12+)
- **Python** (versão 3.8+)
- **Git** para clonar o repositório

---

## 🐳 OPÇÃO 1: Execução com Docker (RECOMENDADO)

### 1. Clonar o Repositório
```bash
git clone <url-do-repositorio>
cd PQC
```

### 2. Iniciar os Containers
```bash
docker-compose down -v #Derruba o anterior
docker-compose up --build -d
```

Este comando irá:
- **Baixar** e construir as imagens necessárias
- **Iniciar** o PostgreSQL na porta 5432
- **Iniciar** o backend Flask na porta 8088
- **Carregar** a estrutura inicial do banco (PQC.sql)
- **Executar** as migrações automaticamente

### 3. Iniciar o Frontend
```bash
cd fontes/front-end
npm install
npm run dev
```

### 4. Acessar o Sistema
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:8088
- **Banco**: localhost:5432 (usuário: postgres, senha: postgres)

---

## 💻 OPÇÃO 2: Execução Local (Sem Docker)

### 1. Configurar o Banco de Dados PostgreSQL

#### 1.1. Instalar PostgreSQL
- **Windows**: Baixe do site oficial do PostgreSQL
- **Linux**: `sudo apt install postgresql postgresql-contrib`
- **Mac**: `brew install postgresql`

#### 1.2. Criar o Banco de Dados
```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar o banco
CREATE DATABASE PQC;

# Sair do psql
\q

# Executar o script inicial
psql -U postgres -d PQC -f PQC.sql
```

### 2. Clonar o Repositório
```bash
git clone <url-do-repositorio>
cd PQC
```

### 3. Configurar o Backend (Python/Flask)

#### 3.1. Instalar Dependências
```bash
cd fontes/backend

# Criar ambiente virtual (recomendado)
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

#### 3.2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` em `fontes/backend/` com:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=PQC
DB_USER=postgres
DB_PASSWORD=postgres
```

#### 3.3. Iniciar o Backend
```bash
python app.py
```

O backend estará disponível em: http://localhost:8088

### 4. Configurar o Frontend (React/Vite)

#### 4.1. Instalar Dependências
```bash
cd fontes/front-end
npm install
```

#### 4.2. Iniciar o Frontend
```bash
npm run dev
```

O frontend estará disponível em: http://localhost:3001

---

## 🔐 Sistema de Autenticação

O sistema utiliza autenticação baseada em tokens com controle de acesso administrativo.


### Usuários de Teste Disponíveis:

Além dos exemplos abaixo, há um arquivo com diversas contas de teste prontas para uso no sistema:

- **Arquivo:** `usuarios_teste.txt` (na raiz do projeto)
- **Formato:** CPF e senha de cada usuário

Exemplo de contas disponíveis:

#### **Usuário Administrador:**
- **CPF**: 333.333.333-33
- **Senha**: senha123
- **Privilégios**: Acesso completo ao sistema, incluindo cadastro de produtos
- **Laboratórios**: Acesso a todos os laboratórios

#### **Usuário Normal:**
- **CPF**: 111.111.111-11  
- **Senha**: senha123
- **Privilégios**: Acesso limitado (inventário, transferências, consultas)
- **Laboratórios**: Laboratório de Química Geral (Campus I)

## 🛠️ Comandos de Referência

### Docker:
```bash
docker-compose up --build -d     # Iniciar containers
docker-compose down              # Parar containers
```

### Frontend (Vite):
```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build para produção
```

---

## ⚡ Setup Rápido para Desenvolvedores

### Com Docker (2 minutos):
```bash
git clone <url-do-repositorio>
cd PQC
docker-compose up --build -d
cd fontes/front-end && npm install && npm run dev
# Acessar: http://localhost:3001
```

### Sem Docker (5 minutos):
```bash
# 1. Configurar PostgreSQL primeiro
psql -U postgres -c "CREATE DATABASE PQC;"
psql -U postgres -d PQC -f PQC.sql

# 2. Configurar projeto
git clone <url-do-repositorio>
cd PQC

# 3. Backend
cd fontes/backend
pip install -r requirements.txt
python app.py &

# 4. Frontend (novo terminal)
cd fontes/front-end
npm install
npm run dev
# Acessar: http://localhost:3001
```