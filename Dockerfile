FROM node:18.12-alpine3.15 AS build

ARG API_SERVER_BASE_URL=http://localhost:8080

COPY . /src
WORKDIR /src

ENV VITE_BASE_URL ${API_SERVER_BASE_URL}
RUN npm i -D esbuild
RUN npm install
RUN npm run build

FROM bitnami/nginx:1.23.2-debian-11-r2
COPY --from=build /src/dist /app