FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
ENTRYPOINT [ "npm", "run", "start:dev" ]