FROM node:20-slim as base

WORKDIR /app

FROM base as deps
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM base as build
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN npm install -g pnpm && pnpm build

FROM base as deploy
ENV NODE_ENV=production
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/
COPY --from=build /app/pnpm-lock.yaml /app/
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

EXPOSE 3000
CMD ["node", "./build/server/index.js"]