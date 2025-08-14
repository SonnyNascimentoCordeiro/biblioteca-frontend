#!/bin/bash

echo "========================================"
echo "    Teste do Ambiente Docker"
echo "========================================"
echo ""

# Verificar se o Docker está rodando
echo "Verificando Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "❌ ERRO: Docker não está rodando!"
    echo "Por favor, inicie o Docker primeiro."
    echo ""
    read -p "Pressione Enter para continuar..."
    exit 1
fi
echo "✅ Docker está rodando!"

# Verificar se o docker-compose está disponível
echo ""
echo "Verificando Docker Compose..."
if ! docker-compose --version > /dev/null 2>&1; then
    echo "❌ ERRO: Docker Compose não está disponível!"
    echo "Por favor, instale o Docker Compose."
    echo ""
    read -p "Pressione Enter para continuar..."
    exit 1
fi
echo "✅ Docker Compose está disponível!"

# Verificar se os arquivos necessários existem
echo ""
echo "Verificando arquivos necessários..."
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ ERRO: docker-compose.yml não encontrado!"
    read -p "Pressione Enter para continuar..."
    exit 1
fi
echo "✅ docker-compose.yml encontrado!"

if [ ! -f "Dockerfile" ]; then
    echo "❌ ERRO: Dockerfile não encontrado!"
    read -p "Pressione Enter para continuar..."
    exit 1
fi
echo "✅ Dockerfile encontrado!"

if [ ! -f "docker.env" ]; then
    echo "❌ ERRO: docker.env não encontrado!"
    read -p "Pressione Enter para continuar..."
    exit 1
fi
echo "✅ docker.env encontrado!"

# Verificar se as portas estão livres
echo ""
echo "Verificando portas..."
if netstat -tuln 2>/dev/null | grep -q ":9000"; then
    echo "⚠️  Porta 9000 está em uso"
else
    echo "✅ Porta 9000 está livre"
fi

if netstat -tuln 2>/dev/null | grep -q ":8090"; then
    echo "⚠️  Porta 8090 está em uso"
else
    echo "✅ Porta 8090 está livre"
fi

echo ""
echo "========================================"
echo "    ✅ Ambiente Docker OK!"
echo "========================================"
echo ""
echo "Agora você pode executar:"
echo "  ./start-docker.sh"
echo ""
echo "Ou usar o comando:"
echo "  docker-compose up --build"
echo ""
read -p "Pressione Enter para continuar..."
