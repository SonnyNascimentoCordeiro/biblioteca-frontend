# 🐳 Docker - Biblioteca Frontend

Este projeto está configurado para rodar em Docker com diferentes ambientes e configurações otimizadas.

## 🚀 **Configurações Disponíveis**

### **Desenvolvimento**
- Hot-reload ativo
- Volumes montados para desenvolvimento
- Porta 9000

### **Produção**
- Build otimizado
- Nginx configurado
- Compressão Gzip
- Headers de segurança
- Porta 80

## 📋 **Pré-requisitos**

- Docker Desktop instalado
- Docker Compose v2+
- Node.js 18+ (para desenvolvimento local)

## 🛠️ **Comandos Docker**

### **Desenvolvimento**
```bash
# Iniciar ambiente de desenvolvimento
npm run docker:dev

# Acessar: http://localhost:9000
```

### **Produção**
```bash
# Build e deploy em produção
npm run docker:prod

# Acessar: http://localhost:80
```

### **Gerenciamento**
```bash
# Parar todos os serviços
npm run docker:stop

# Parar e limpar volumes
npm run docker:clean

# Ver logs em tempo real
npm run docker:logs

# Acessar shell do container
npm run docker:shell
```

## 🏗️ **Estrutura Docker**

```
├── Dockerfile              # Multi-stage build
├── docker-compose.yml      # Orquestração dos serviços
├── nginx.conf             # Configuração nginx para produção
├── nginx-reverse.conf     # Nginx reverso com SSL
├── .dockerignore          # Arquivos excluídos do build
└── DOCKER_README.md       # Este arquivo
```

## 🔧 **Configurações Avançadas**

### **Variáveis de Ambiente**
```bash
# Desenvolvimento
NODE_ENV=development
CHOKIDAR_USEPOLLING=true

# Produção
NODE_ENV=production
```

### **Portas**
- **Desenvolvimento**: 9000
- **Produção**: 80
- **Backend**: 8080
- **SSL**: 443

### **Volumes**
- Código fonte montado em desenvolvimento
- Node modules isolados
- Configurações nginx persistentes

## 🚀 **Deploy em Produção**

### **1. Build da Imagem**
```bash
docker build -t biblioteca-frontend:latest .
```

### **2. Deploy com Docker Compose**
```bash
docker-compose --profile prod up -d
```

### **3. Verificar Status**
```bash
docker-compose ps
docker-compose logs -f
```

## 🔒 **Segurança**

### **Headers de Segurança**
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### **Rate Limiting**
- API: 10 requests/segundo
- Login: 5 requests/minuto

### **SSL/TLS**
- Protocolos: TLSv1.2, TLSv1.3
- Ciphers seguros configurados
- HSTS habilitado

## 📊 **Monitoramento**

### **Health Check**
```bash
# Verificar status da aplicação
curl http://localhost/health
```

### **Logs**
```bash
# Logs do frontend
docker-compose logs frontend-prod

# Logs do nginx
docker-compose logs nginx-reverse
```

## 🐛 **Troubleshooting**

### **Problemas Comuns**

#### **Porta já em uso**
```bash
# Verificar portas em uso
netstat -tulpn | grep :80

# Parar serviços conflitantes
sudo systemctl stop nginx
```

#### **Permissões de arquivo**
```bash
# Corrigir permissões
sudo chown -R $USER:$USER .
chmod +x docker-compose.yml
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

## 🔄 **CI/CD**

### **GitHub Actions (exemplo)**
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Deploy
        run: |
          docker build -t biblioteca-frontend:${{ github.sha }} .
          docker push biblioteca-frontend:${{ github.sha }}
```

## 📚 **Recursos Adicionais**

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Vue.js Deployment](https://vuejs.org/guide/best-practices/production-deployment.html)

## 🤝 **Suporte**

Para dúvidas ou problemas com Docker:
1. Verificar logs: `npm run docker:logs`
2. Verificar status: `docker-compose ps`
3. Limpar ambiente: `npm run docker:clean`
4. Rebuild: `npm run docker:prod`

---

**🎯 Projeto configurado e pronto para Docker!**
