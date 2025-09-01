FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Build only for production
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

EXPOSE 3000

CMD if [ "$NODE_ENV" = "production" ]; then npm run build && npm run start; else npm run dev; fi