# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package để cài library trước (tối ưu cache)
COPY package*.json ./
RUN npm install

# Copy toàn bộ code
COPY . .

# Giả sử server bạn chạy port 4000 (kiểm tra lại file .env hoặc server.js của bạn)
EXPOSE 4000

CMD ["npm", "start"]