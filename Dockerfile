# --- Desenvolvimento (hot reload com volume do host) ---
FROM node:24-alpine AS dev

WORKDIR /app

COPY docker/npm-ci-retry.sh /usr/local/bin/npm-ci-retry.sh
RUN chmod +x /usr/local/bin/npm-ci-retry.sh

COPY package.json package-lock.json ./
RUN npm-ci-retry.sh

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# --- Build de produção ---
FROM node:24-alpine AS build

WORKDIR /app

COPY docker/npm-ci-retry.sh /usr/local/bin/npm-ci-retry.sh
RUN chmod +x /usr/local/bin/npm-ci-retry.sh

COPY package.json package-lock.json ./
RUN npm-ci-retry.sh

COPY . .
RUN npm run build

# --- Produção (Nginx servindo dist/) ---
FROM nginx:alpine AS production

RUN apk add --no-cache gettext

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .
COPY configuracoes/default.conf.template /etc/nginx/templates/default.conf.template
COPY startup.sh /

RUN chmod +x /startup.sh

EXPOSE 80

ENTRYPOINT ["/startup.sh"]
