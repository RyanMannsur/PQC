# 👥 Guia para Novos Desenvolvedores - PQC

## ⚡ Setup Rápido (5 minutos)

### Opção A: Docker (MAIS FÁCIL) 🐳
```bash
# 1. Clone o projeto
git clone <url-do-repositorio>
cd PQC

# 2. Execute o setup automatizado
start-docker.bat    # Windows
# OU
docker-compose up --build -d    # Linux/Mac

# 3. Pronto! Acesse:
# - Frontend: http://localhost:3001
# - Backend: http://localhost:8088
```

### Opção B: Local (Desenvolvimento) 💻
```bash
# 1. Instale as dependências do sistema
# - Node.js 18+
# - Python 3.10+
# - PostgreSQL

# 2. Configure o banco
psql -U postgres -d PQC -f PQC.sql

# 3. Backend
cd fontes/backend
pip install -r requirements.txt
python app.py

# 4. Frontend (nova aba do terminal)
cd fontes/front-end
npm install
npm run dev
```

---

## 🔧 Ferramentas Necessárias

### Essenciais:
- **Git** - Controle de versão
- **VS Code** - Editor recomendado
- **Docker Desktop** - Para execução com containers

### Para desenvolvimento local:
- **Node.js** (18+) - Runtime JavaScript
- **Python** (3.10+) - Backend
- **PostgreSQL** - Banco de dados

---

## 📋 Checklist de Setup

### ✅ Ambiente Docker:
- [ ] Docker Desktop instalado e rodando
- [ ] Projeto clonado
- [ ] `start-docker.bat` executado com sucesso
- [ ] Frontend abre em http://localhost:3001
- [ ] Backend responde em http://localhost:8088/api/produtos

### ✅ Ambiente Local:
- [ ] Node.js instalado (`node --version`)
- [ ] Python instalado (`python --version`)
- [ ] PostgreSQL rodando
- [ ] Banco PQC criado com dados
- [ ] Backend iniciado (porta 8088)
- [ ] Frontend iniciado (porta 3001)

---

## 🎯 Primeiros Passos

1. **Explore o projeto:**
   ```bash
   # Estrutura principal
   fontes/backend/    # API Python/Flask
   fontes/front-end/  # Interface React/Vite
   ```

2. **Teste as funcionalidades:**
   - Login no sistema
   - Listagem de produtos
   - Consulta PQC

3. **Configure seu editor:**
   - Instale extensões do VS Code para React/Python
   - Configure formatação automática
   - Adicione snippets úteis

---

## 🚨 Problemas Comuns

### "Porta já em uso"
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill
```

### "Cannot connect to database"
- **Docker**: Aguarde 30s para o PostgreSQL inicializar
- **Local**: Verifique se o PostgreSQL está rodando

### "npm install falha"
```bash
# Limpe o cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### "Python import error"
```bash
# Verifique o ambiente virtual
pip install -r requirements.txt --upgrade
```

---

## 📝 Padrões de Desenvolvimento

### Git Workflow:
```bash
# 1. Sempre puxe as últimas mudanças
git pull origin main

# 2. Crie uma branch para sua feature
git checkout -b feature/nome-da-feature

# 3. Faça commits pequenos e descritivos
git commit -m "feat: adiciona validação de produto"

# 4. Push e abra PR
git push origin feature/nome-da-feature
```

### Estrutura de commits:
- `feature:` - Nova funcionalidade
- `fix:` - Correção de bug
- `refactor:` - Refatoração de código
- `docs:` - Documentação
- `style:` - Formatação, sem mudança de lógica

---

## 🔍 Como Debuggar

### Frontend (React/Vite):
```bash
# Logs detalhados
npm run dev -- --debug

# DevTools do navegador (F12)
# React DevTools (extensão)
```

### Backend (Flask):
```bash
# Modo debug (já configurado)
# Logs em: fontes/backend/app.log

# Ver logs em tempo real (Docker)
docker-compose logs -f backend
```

### Banco de dados:
```bash
# Conectar ao banco (Docker)
docker exec -it pqc_postgres psql -U postgres -d PQC

# Conectar local
psql -U postgres -d PQC
```

---

## 📚 Recursos Úteis

### Documentação:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Flask](https://flask.palletsprojects.com/)
- [Material-UI](https://mui.com/)

### Extensões VS Code Recomendadas:
- ES7+ React/Redux/React-Native snippets
- Python
- Docker
- GitLens
- Prettier
- Auto Rename Tag

---

## ✨ Dicas de Produtividade

### Atalhos úteis:
- `Ctrl+Shift+P` - Command palette (VS Code)
- `Ctrl+`` - Terminal integrado
- `F12` - DevTools do navegador

### Scripts úteis:
```bash
# Reset completo do projeto
docker-compose down -v && docker-compose up --build -d

# Ver todos os containers
docker ps -a

# Backup rápido do banco
docker exec pqc_postgres pg_dump -U postgres PQC > backup.sql
```

### Workflow eficiente:
1. Mantenha o Docker rodando sempre
2. Use hot-reload (Vite faz automaticamente)
3. Teste incrementalmente

---

**Pronto para contribuir! 🚀**
