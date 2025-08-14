#!/bin/bash

# Biblioteca Frontend - Docker
# Script de inicialização para Linux/Mac

clear
echo "========================================"
echo "    Biblioteca Frontend - Docker"
echo "========================================"
echo

# Função para mostrar menu
show_menu() {
    echo "Escolha uma opção:"
    echo "1. Desenvolvimento (porta 9000)"
    echo "2. Produção (porta 80)"
    echo "3. Parar todos os serviços"
    echo "4. Limpar tudo"
    echo "5. Ver logs"
    echo "6. Sair"
    echo
}

# Função para desenvolvimento
start_dev() {
    echo
    echo "🚀 Iniciando ambiente de DESENVOLVIMENTO..."
    echo "📍 Acesse: http://localhost:9000"
    echo
    npm run docker:dev
}

# Função para produção
start_prod() {
    echo
    echo "🚀 Iniciando ambiente de PRODUÇÃO..."
    echo "📍 Acesse: http://localhost:80"
    echo
    npm run docker:prod
}

# Função para parar serviços
stop_services() {
    echo
    echo "🛑 Parando todos os serviços..."
    npm run docker:stop
    echo
    read -p "Pressione Enter para continuar..."
}

# Função para limpar tudo
clean_all() {
    echo
    echo "🧹 Limpando tudo..."
    npm run docker:clean
    echo
    read -p "Pressione Enter para continuar..."
}

# Função para ver logs
show_logs() {
    echo
    echo "📋 Mostrando logs (Ctrl+C para sair)..."
    npm run docker:logs
}

# Loop principal
while true; do
    show_menu
    read -p "Digite sua escolha (1-6): " choice
    
    case $choice in
        1)
            start_dev
            ;;
        2)
            start_prod
            ;;
        3)
            stop_services
            ;;
        4)
            clean_all
            ;;
        5)
            show_logs
            ;;
        6)
            echo
            echo "👋 Saindo..."
            exit 0
            ;;
        *)
            echo "❌ Opção inválida. Tente novamente."
            read -p "Pressione Enter para continuar..."
            ;;
    esac
    
    clear
done
