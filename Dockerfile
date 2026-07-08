# playwright does NOT like trixie so force bookworm
FROM node:24.13.1-bookworm AS base

WORKDIR /app

COPY package*.json ./

FROM base AS dev

RUN npm ci --include=dev

# install playwright browsers
RUN npx playwright install --with-deps

COPY . .

CMD ["npm", "run", "dev"]

FROM base AS build

RUN npm ci

COPY . .

RUN npm run build

FROM node:24.13.1-bookworm-slim AS prod

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

# do not install dev and ignore scripts to prevent husky errors
# run cache clean to avoid adding npm cache to prod image
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# copy ONLY the built app
COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["node", "build/index.js"]