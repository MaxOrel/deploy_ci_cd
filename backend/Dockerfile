FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:18-alpine as runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund \
	&& npm i -g pm2
COPY --from=builder /app/dist ./dist
COPY ./ecosystem.config.js ./
ENTRYPOINT [ "pm2-runtime", "start", "ecosystem.config.js" ]
