FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
    
RUN npm run build

EXPOSE 4000

RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

CMD if [ "$NODE_ENV" = "production" ]; then npm run build && npm run start:prod; else npm run start:dev; fi