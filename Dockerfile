# -----------------------------
# Etapa base: instala todas as dependências e copia o código
# -----------------------------
FROM node:22.13.1-alpine AS base
WORKDIR /app
COPY package*.json ./
# Instala todas as dependências (incluindo as de desenvolvimento)
RUN npm install
COPY . .

# -----------------------------
# Etapa de desenvolvimento: executa em modo watch (ts-node-dev)
# -----------------------------
FROM base AS development
EXPOSE 3001
# Instala o ts-node-dev globalmente (caso necessário)
RUN npm install -g ts-node-dev
# Define o comando com monitoramento de diretórios específicos
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "--watch", "src/**/*", "src/index.ts"]
# -----------------------------
# Etapa de build para produção: compila o TypeScript
# -----------------------------
FROM base AS builder
# Define a variável para produção (apenas para a etapa de build)
ENV NODE_ENV=production
RUN npm run build

# -----------------------------
# Imagem final para produção: instala apenas as dependências de produção e copia o build
# -----------------------------
FROM node:22.13.1-alpine AS production
WORKDIR /app
COPY package*.json ./
# Instala somente as dependências necessárias para produção
RUN npm install --production
# Copia os arquivos compilados na etapa builder
COPY --from=builder /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]

# -----------------------------
# Por padrão, se nenhum target for especificado, a build usará a etapa "production".
# Nos builds via docker-compose, usaremos o argumento "target" para selecionar "development" ou "production"
# -----------------------------
