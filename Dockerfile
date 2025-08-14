# Dockerfile para desenvolvimento
FROM node:20-alpine

# Instalar dependências do sistema
RUN apk add --no-cache git

# Definir diretório de trabalho
WORKDIR /app

# Configurar npm para melhor conectividade
RUN npm config set registry https://registry.npmjs.org/
RUN npm config set fetch-retries 5
RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000

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
