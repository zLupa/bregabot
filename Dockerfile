FROM node:16.9.0-slim

RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /app

COPY package.json ./
COPY *.lock ./
RUN yarn

COPY . .

RUN yarn build
RUN yarn prisma generate

CMD [ "yarn", "start" ]
