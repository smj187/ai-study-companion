FROM node:16-alpine

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm i -g pnpm

RUN pnpm install --frozen-lockfile --dev

RUN pnpm install esbuild

COPY . .

EXPOSE 3000

CMD ["pnpm", "build"]