#!/bin/bash
# Script para executar migrações no Linux/Mac

cd "$(dirname "$0")"
cd fontes/backend

echo "Executando migrações..."
python -m migrations.cli run

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Migrações executadas com sucesso!"
else
    echo ""
    echo "✗ Erro ao executar migrações!"
    exit 1
fi
