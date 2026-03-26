FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
    
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

CMD if [ "$NODE_ENV" = "production" ]; then npm run build && npm run start; else npm run dev; fi