FROM node:20.17-alpine

WORKDIR /home/app

COPY package*.json .

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 6677

CMD ["node", "BE_main.js"]