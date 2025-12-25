# admin/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Chạy với cờ --host để expose ra ngoài container
CMD ["npm", "run", "dev", "--", "--host"]