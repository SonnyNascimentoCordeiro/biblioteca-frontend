# 📚 Biblioteca Frontend

Frontend da aplicação de biblioteca desenvolvido com Vue.js, Quasar e TypeScript.

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

## 🎯 **O que acontece?**

1. **Docker inicia automaticamente** o ambiente isolado
2. **Frontend roda** na porta 9000 (desenvolvimento)
3. **Backend configurado** para conectar na porta 8090 (seu backend separado)
4. **Sem instalação** de Node.js, npm ou yarn
5. **Ambiente completamente isolado** do sistema

## 📋 **Pré-requisitos**

- ✅ Docker Desktop instalado e rodando
- ❌ **NÃO precisa de Node.js**
- ❌ **NÃO precisa de npm/yarn**
- ❌ **NÃO contamina o ambiente**

## 🔗 **URLs de Acesso**

- **Frontend**: http://localhost:9000
- **Backend**: http://localhost:8090 (seu backend separado)

## 🛠️ **Comandos Úteis**

```bash
# Ver status dos serviços
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down

# Limpar ambiente
docker-compose down -v --remove-orphans
```

## 📚 **Documentação Completa**

Para mais detalhes, consulte o [DOCKER_README.md](./DOCKER_README.md).

---

**🎯 Projeto pronto para rodar com um clique!**

**✅ Sem Node.js local necessário**
**✅ Sem npm/yarn local necessário**  
**✅ Ambiente completamente isolado**
**✅ Conecta com seu backend na porta 8090**
