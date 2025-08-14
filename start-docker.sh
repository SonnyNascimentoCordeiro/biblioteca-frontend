#!/bin/bash

echo "========================================"
echo "    Biblioteca Frontend - Docker"
echo "========================================"
echo ""
echo "Iniciando ambiente Docker..."
echo ""

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "ERRO: Docker não está rodando!"
    echo "Por favor, inicie o Docker primeiro."
    echo ""
    read -p "Pressione Enter para continuar..."
    exit 1
fi

echo "Docker está rodando!"
echo ""
echo "Iniciando ambiente de DESENVOLVIMENTO..."
echo "Frontend: http://localhost:9000"
echo "Backend: http://localhost:8090 (seu backend separado)"
echo ""
docker-compose up --build

echo ""
read -p "Pressione Enter para continuar..."
