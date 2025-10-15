FROM node:18

WORKDIR /app

# Copy only package files and install dependencies inside container
COPY package*.json ./
RUN npm install

# Now copy source code (node_modules stays container-native)
COPY . .

CMD ["npm", "run", "dev"]