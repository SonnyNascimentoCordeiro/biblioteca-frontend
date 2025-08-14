# Multi-stage build para otimização
FROM node:20-alpine AS base

# Instalar dependências do sistema
RUN apk add --no-cache git

# Definir diretório de trabalho
WORKDIR /app

# Configurar npm para melhor conectividade
RUN npm config set registry https://registry.npmjs.org/
RUN npm config set fetch-retries 5
RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000

# Stage de desenvolvimento
FROM base AS development

# Copiar arquivos de configuração primeiro
COPY package*.json ./
COPY quasar.config.ts ./
COPY tsconfig.json ./
COPY postcss.config.js ./
COPY eslint.config.js ./
COPY index.html ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta de desenvolvimento
EXPOSE 9000

# Comando de desenvolvimento
CMD ["npm", "run", "dev"]

# Stage de build
FROM base AS builder

# Copiar arquivos de configuração primeiro
COPY package*.json ./
COPY quasar.config.ts ./
COPY tsconfig.json ./
COPY postcss.config.js ./
COPY eslint.config.js ./
COPY index.html ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage de produção
FROM nginx:alpine AS production

# Copiar arquivos buildados
COPY --from=builder /app/dist/spa /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
