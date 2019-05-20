FROM node:11.7.0

COPY server /app
WORKDIR /app

RUN npm install && npm run build
ENV NODE_ENV production

EXPOSE 8080

CMD ["node", "./server/server.js"]
