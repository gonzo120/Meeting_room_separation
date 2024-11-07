# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Primero copia solo los archivos de dependencias
COPY package*.json ./

# Instala las dependencias, excluyendo las devDependencies
RUN npm ci --only=production

# Copia el código fuente
COPY . .

# Usa un usuario no root por seguridad
USER node

EXPOSE 3000

# Usa node directamente en lugar de nodemon para producción
CMD ["node", "index.js"]