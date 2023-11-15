FROM node:18.17.1 AS base
WORKDIR /app
COPY ./ ./

ENV APP_ENV=staging
RUN npm ci
RUN npm run staging

CMD node -r dotenv/config build/index.js
