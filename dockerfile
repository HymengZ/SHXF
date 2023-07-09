FROM node:10.15-alpine
COPY dist /app/dist/
COPY server.js /app/server.js
WORKDIR /app
RUN npm config set registry https://registry.npmmirror.com/
RUN npm init -y
RUN npm install express
EXPOSE 8080
CMD ["node", "server.js"]
