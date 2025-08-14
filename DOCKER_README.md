# 🐳 Docker - Biblioteca Frontend

Este projeto está configurado para rodar em Docker de forma **completamente isolada**, sem contaminar o ambiente local e sem necessidade de configurações adicionais.

## 🚀 **Inicialização Rápida**

### **1. Testar Ambiente (Recomendado)**
```bash
# Windows
.\test-docker.bat

# Linux/Mac  
./test-docker.sh
```

### **2. Iniciar Projeto**
```bash
# Windows
.\start-docker.bat

# Linux/Mac
./start-docker.sh
```

## 🎯 **Ambiente Disponível**

### **Desenvolvimento** 
- **Frontend**: http://localhost:9000
- **Backend**: http://localhost:8090 (seu backend separado)
- Hot-reload ativo
- Volumes montados para desenvolvimento

## 📋 **Pré-requisitos**

- ✅ Docker Desktop instalado e rodando
- ✅ Docker Compose v2+
- ❌ **NÃO precisa de Node.js instalado**
- ❌ **NÃO precisa de npm/yarn instalado**
- ❌ **NÃO contamina o ambiente local**

## 🛠️ **Comandos Manuais (Opcional)**

Se preferir usar comandos diretos:

```bash
# Desenvolvimento
docker-compose up --build

# Parar todos os serviços
docker-compose down

# Limpar ambiente
docker-compose down -v --remove-orphans
```

## 🏗️ **Estrutura Docker**

```
├── Dockerfile              # Build para desenvolvimento
├── docker-compose.yml      # Orquestração dos serviços
├── .dockerignore          # Otimização do build
├── docker.env             # Variáveis de ambiente
├── test-docker.bat        # Teste do ambiente (Windows)
├── test-docker.sh         # Teste do ambiente (Linux/Mac)
├── start-docker.bat       # Inicialização (Windows)
├── start-docker.sh        # Inicialização (Linux/Mac)
└── DOCKER_README.md       # Este arquivo
```

## 🔧 **Configurações**

### **Portas**
- **Frontend**: 9000
- **Backend**: 8090 (seu backend separado)

### **Variáveis de Ambiente**
```bash
# Desenvolvimento
NODE_ENV=development
VITE_API_URL=http://localhost:8090/biblioteca
```

### **Volumes**
- Código fonte montado em desenvolvimento
- Node modules isolados

## 🚀 **Deploy**

### **Build da Imagem**
```bash
docker build -t biblioteca-frontend:latest .
```

### **Deploy com Docker Compose**
```bash
docker-compose up --build
```

### **Verificar Status**
```bash
docker-compose ps
docker-compose logs -f
```

## 📊 **Monitoramento**

### **Logs**
```bash
# Logs do frontend
docker-compose logs -f frontend-dev
```

## 🐛 **Troubleshooting**

### **Problemas Comuns**

#### **Porta já em uso**
```bash
# Verificar portas em uso
netstat -tulpn | grep :9000

# Parar serviços conflitantes
docker-compose down
```

#### **Permissões de arquivo**
```bash
# Corrigir permissões (Linux/Mac)
chmod +x start-docker.sh
```

#### **Limpeza de containers**
```bash
# Limpar tudo
docker system prune -a
docker volume prune
```

### **Debug**
```bash
# Acessar container
docker-compose exec frontend-dev sh

# Ver logs em tempo real
docker-compose logs -f --tail=100
```

## 🤝 **Suporte**

Para dúvidas ou problemas com Docker:
1. **Usar os scripts**: `start-docker.bat` ou `start-docker.sh`
2. Verificar logs: `docker-compose logs -f`
3. Verificar status: `docker-compose ps`
4. Limpar ambiente: `docker-compose down -v --remove-orphans`

---

**🎯 Projeto configurado para rodar de forma isolada e sem configurações!**

**✅ Sem Node.js local necessário**
**✅ Sem npm/yarn local necessário**  
**✅ Ambiente completamente isolado**
**✅ Conecta com seu backend na porta 8090**
