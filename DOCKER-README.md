# PQC - Execução com Docker

## Problemas Resolvidos

1. **Arquivo SQL não estava sendo carregado**: O docker-compose estava apontando para `./database/PQC.sql` (que era um diretório), agora aponta para `./PQC.sql` (arquivo correto)

2. **Configuração de conexão**: O backend estava configurado para conectar em `localhost`, agora usa variáveis de ambiente que funcionam no Docker

3. **Sincronização de serviços**: Adicionado health check no PostgreSQL e dependência correta no backend

## Como usar

### Opção 1: Script automatizado (Windows)
```bash
start-docker.bat
```

### Opção 2: Comandos manuais
```bash
# Construir e iniciar
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Limpar tudo (incluindo banco)
docker-compose down -v
```

## Estrutura do Docker

- **Backend**: Porta 8088
- **PostgreSQL**: Porta 5432
- **Volume**: `pgdata` para persistir dados do banco

## Verificação

Após iniciar, teste se está funcionando:
- Backend: http://localhost:8088
- Banco: Conecte em localhost:5432 com usuário `postgres` e senha `postgres`

## Logs

Para ver os logs dos serviços:
```bash
# Todos os logs
docker-compose logs

# Apenas backend
docker-compose logs backend

# Apenas database
docker-compose logs database

# Logs em tempo real
docker-compose logs -f
```

## Troubleshooting

1. **Erro de conexão com banco**: Aguarde alguns segundos, o PostgreSQL pode demorar para inicializar
2. **Tabelas não criadas**: Verifique se o arquivo `PQC.sql` existe na raiz do projeto
3. **Backend não inicia**: Verifique os logs com `docker-compose logs backend`
