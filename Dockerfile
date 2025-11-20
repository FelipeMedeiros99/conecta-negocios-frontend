FROM node:20-alpine

WORKDIR /app

COPY *.json .

RUN npm install

COPY . .

EXPOSE 3003

RUN npm run build


CMD ["npm", "start"]