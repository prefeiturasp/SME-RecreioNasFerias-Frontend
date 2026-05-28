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

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
