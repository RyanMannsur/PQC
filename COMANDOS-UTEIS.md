# 🛠️ Comandos Úteis - PQC

## � Sistema de Migrações

### Executar migrações
```bash
# Windows
run-migrations.bat

# Linux/Mac
./run-migrations.sh

# Ou via Python
cd fontes/backend
python -m migrations.cli run
```

### Criar nova migração
```bash
cd fontes/backend
python -m migrations.cli create codigo_nomepessoa --description "Descrição"

# Exemplos:
python -m migrations.cli create insert_joao --description "Adiciona dados iniciais"
python -m migrations.cli create create_maria --description "Cria nova tabela"
python -m migrations.cli create alter_pedro --description "Modifica estrutura"
python -m migrations.cli create delete_ana --description "Remove dados obsoletos"
```

### Ver status das migrações
```bash
cd fontes/backend
python -m migrations.cli status
```

### Testar sistema de migrações
```bash
cd fontes/backend
python test_migrations.py
```

### Monitorar via API
```bash
GET /api/migrations/status
```

## �🐳 Docker

```bash
# ===== INICIO RÁPIDO =====
start-docker.bat              # Windows - Setup completo
./start-docker.sh             # Linux/Mac - Setup completo
docker-compose up --build -d  # Manual - Construir e iniciar

# ===== GERENCIAMENTO =====
docker-compose ps             # Ver status dos containers
docker-compose down           # Parar containers
docker-compose down -v        # Parar e limpar volumes (reset completo)
docker-compose restart        # Reiniciar containers

# ===== LOGS =====
docker-compose logs -f        # Todos os logs em tempo real
docker-compose logs backend   # Logs apenas do backend
docker-compose logs database  # Logs apenas do banco
docker-compose logs --tail=50 # Últimas 50 linhas

# ===== BANCO DE DADOS =====
docker exec -it pqc_postgres psql -U postgres -d PQC  # Conectar ao banco
docker exec pqc_postgres pg_dump -U postgres PQC > backup.sql  # Backup
```

## ⚛️ Frontend (React/Vite)

```bash
cd fontes/front-end

# ===== DESENVOLVIMENTO =====
npm run dev          # Servidor desenvolvimento (porta 3001)
npm run build        # Build para produção
npm run preview      # Preview do build de produção
npm run test         # Executar testes

# ===== MANUTENÇÃO =====
npm install          # Instalar dependências
npm update           # Atualizar dependências
npm audit fix        # Corrigir vulnerabilidades
rm -rf node_modules package-lock.json && npm install  # Reset completo
```

## 🐍 Backend (Python/Flask)

```bash
cd fontes/backend

# ===== DESENVOLVIMENTO =====
python app.py        # Iniciar servidor (porta 8088)
python -m pytest    # Executar testes (se houver)

# ===== MANUTENÇÃO =====
pip install -r requirements.txt           # Instalar dependências
pip install -r requirements.txt --upgrade # Atualizar dependências
pip freeze > requirements.txt             # Salvar dependências atuais
```

## 🗄️ Banco de Dados

```bash
# ===== POSTGRESQL LOCAL =====
psql -U postgres -d PQC                   # Conectar
psql -U postgres -d PQC -f PQC.sql        # Executar script
pg_dump -U postgres PQC > backup.sql      # Backup
psql -U postgres -d PQC < backup.sql      # Restaurar backup

# ===== CONSULTAS ÚTEIS =====
\dt                    # Listar tabelas
\d produto            # Descrever tabela
SELECT * FROM produto LIMIT 5;  # Ver produtos
```

## 🔧 Git

```bash
# ===== WORKFLOW BÁSICO =====
git status            # Ver status
git add .             # Adicionar todas as mudanças
git commit -m "feat: nova funcionalidade"  # Commit
git push              # Enviar para repositório

# ===== BRANCHES =====
git checkout -b feature/nome-feature  # Criar nova branch
git checkout main                     # Voltar para main
git merge feature/nome-feature        # Mergear branch
git branch -d feature/nome-feature    # Deletar branch

# ===== SINCRONIZAÇÃO =====
git pull origin main  # Puxar mudanças
git fetch             # Buscar mudanças sem aplicar
git stash             # Guardar mudanças temporariamente
git stash pop         # Recuperar mudanças guardadas
```

## 🚨 Troubleshooting

```bash
# ===== PROBLEMAS DE PORTA =====
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill
sudo lsof -ti:3001 | xargs sudo kill

# ===== RESET COMPLETO =====
# Docker
docker-compose down -v
docker system prune -f
docker-compose up --build -d

# Frontend
cd fontes/front-end
rm -rf node_modules package-lock.json .vite
npm install

# Backend
cd fontes/backend
rm -rf __pycache__ *.pyc
pip install -r requirements.txt --force-reinstall

# ===== LOGS DE ERRO =====
# Frontend - Console do navegador (F12)
# Backend - arquivo app.log ou docker-compose logs backend
# Banco - docker-compose logs database
```

## 📊 Monitoramento

```bash
# ===== STATUS DO SISTEMA =====
docker stats                    # Uso de recursos dos containers
docker-compose top              # Processos rodando
docker system df                # Uso de espaço do Docker

# ===== HEALTH CHECKS =====
curl http://localhost:3001      # Testar frontend
curl http://localhost:8088/api/produtos  # Testar backend API
```

## 🔍 Debug

```bash
# ===== FRONTEND =====
npm run dev -- --debug         # Modo debug verbose
# Usar React DevTools no navegador
# Console do navegador (F12) para erros

# ===== BACKEND =====
# Debug já está ativo por padrão
# Logs em: fontes/backend/app.log
# Flask debug toolbar disponível em desenvolvimento

# ===== BANCO =====
# Conectar e executar queries diretamente
docker exec -it pqc_postgres psql -U postgres -d PQC
```

## 🎯 Comandos por Situação

### 🚀 "Quero começar a trabalhar"
```bash
git pull origin main
start-docker.bat     # ou docker-compose up -d
```

### 🔄 "Mudei algo no backend"
```bash
docker-compose restart backend
# ou
docker-compose logs -f backend
```

### 🎨 "Mudei algo no frontend"
```bash
# Vite faz hot-reload automaticamente
# Se não funcionou:
cd fontes/front-end && npm run dev
```

### 💾 "Preciso resetar o banco"
```bash
docker-compose down -v
docker-compose up -d
```

### 🆘 "Algo deu errado, quero resetar tudo"
```bash
docker-compose down -v
docker system prune -f
start-docker.bat
```

### 📦 "Quero fazer deploy"
```bash
# Frontend
cd fontes/front-end
npm run build
# Arquivos ficam em: dist/

# Backend
cd fontes/backend
# Já está pronto para deploy
```
