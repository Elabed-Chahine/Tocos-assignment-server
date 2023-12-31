FROM node:16

WORKDIR  /src/app/backend

COPY package*.json .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5000

CMD [ "npm","run","dev" ]