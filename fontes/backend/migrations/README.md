# Sistema de Migrações PQC

## Visão Geral

O sistema de migrações permite gerenciar mudanças no banco de dados de forma controlada e versionada. Ele executa automaticamente scripts SQL na inicialização da aplicação e mantém um registro de quais migrações já foram aplicadas.

## Estrutura de Arquivos

```
fontes/backend/migrations/
├── migration_manager.py    # Classe principal do sistema
├── auto_migrate.py        # Execução automática na inicialização
├── cli.py                 # Interface de linha de comando
└── scripts/               # Pasta com os scripts SQL
    ├── 001_create_joao.sql
    └── 002_insert_maria.sql
```

## Como Funciona

1. **Execução Automática**: Quando a aplicação inicia, o sistema verifica se há migrações pendentes e as executa automaticamente.

2. **Controle de Estado**: Uma tabela `applied_migrations` mantém o registro de quais migrações já foram aplicadas.

3. **Ordem de Execução**: As migrações são executadas em ordem alfabética pelo nome do arquivo.

## Comandos Disponíveis

### Via CLI (Linha de Comando)

```bash
# Executar migrações pendentes
python -m migrations.cli run

# Criar nova migração
python -m migrations.cli create codigo_nomepessoa --description "Descrição da migração"

# Ver status das migrações
python -m migrations.cli status
```

### Via Scripts de Conveniência

```bash
# Windows
run-migrations.bat

# Linux/Mac
./run-migrations.sh
```

## Criando Nova Migração

### 1. Via CLI
```bash
cd fontes/backend
python -m migrations.cli create insert_joao --description "Adiciona nova tabela de exemplo"
```

### 2. Manualmente
Crie um arquivo na pasta `migrations/scripts/` seguindo o padrão:
- **Nome**: `Numero_codigo_nomepessoa.sql`
- **Número**: Sequencial (001, 002, 003...)
- **Código**: insert, delete, create, alter
- **Nome da pessoa**: Nome de quem criou a migração
- **Exemplo**: `001_create_maria.sql`

### 3. Estrutura do Arquivo
```sql
-- Description: Adiciona nova tabela de exemplo
-- Created: 2025-01-16 14:30:00
-- Migration: 001_create_maria.sql
-- Author: maria
-- Type: CREATE

-- Seu script SQL aqui
CREATE TABLE exemplo (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);
```

## Boas Práticas

### 1. Nomenclatura
- Use números sequenciais (001, 002, 003...)
- Formato: `Numero_codigo_nomepessoa.sql`
- Códigos válidos: `insert`, `delete`, `create`, `alter`
- Nome da pessoa que criou a migração
- Exemplos: `001_create_joao.sql`, `002_insert_maria.sql`

### 2. Conteúdo das Migrações
- **Idempotência**: Use `IF NOT EXISTS` quando possível
- **Reversibilidade**: Considere como desfazer a migração
- **Transações**: Cada migração roda em uma transação

### 3. Exemplos de Padrões

```sql
-- Adicionar coluna com verificação
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tabela' AND column_name = 'nova_coluna'
    ) THEN
        ALTER TABLE tabela ADD COLUMN nova_coluna VARCHAR(50);
    END IF;
END $$;

-- Criar tabela se não existir
CREATE TABLE IF NOT EXISTS nova_tabela (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- Criar índice se não existir
CREATE INDEX IF NOT EXISTS idx_tabela_coluna ON tabela(coluna);
```

## Configuração

O sistema usa as mesmas configurações de banco de dados do arquivo `config.py`:

```python
DB_CONFIG = {
    "dbname": os.getenv("DB_NAME", "PQC"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "postgres"),
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432")
}
```

## Tabela de Controle

O sistema cria automaticamente a tabela `applied_migrations`:

```sql
CREATE TABLE applied_migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checksum VARCHAR(64),
    description TEXT
);
```

## Logs

- **Aplicação**: Logs aparecem no console e no arquivo `migrations.log`
- **Localização**: `fontes/backend/migrations.log`
- **Nível**: INFO por padrão

## Solução de Problemas

### 1. Migração Falhou
```bash
# Ver status
python -m migrations.cli status

# Verificar logs
tail -f migrations.log
```

### 2. Migração Duplicada
As migrações são identificadas pelo nome do arquivo. Se uma migração já foi aplicada, ela será ignorada.

### 3. Erro de Sintaxe SQL
- Verifique a sintaxe do SQL na migração
- Teste o comando manualmente no banco
- Use `IF NOT EXISTS` para evitar erros de objetos já existentes

## Integração com Docker

As migrações são executadas automaticamente quando a aplicação inicia, funcionando perfeitamente com Docker:

```dockerfile
# No Dockerfile, as migrações rodam automaticamente
CMD ["python", "app.py"]
```

## Monitoramento

Para verificar o status das migrações em produção:

```bash
# Verificar status
python -m migrations.cli status

# Ver logs da aplicação
docker logs nome_do_container
```
