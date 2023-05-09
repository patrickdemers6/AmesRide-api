FROM node:18-bullseye-slim

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/

RUN yarn

COPY . /usr/src/app/

RUN npm run build

CMD "npm" "start"
