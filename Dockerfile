FROM docker.adeo.no:5000/pus/node

COPY app /app
WORKDIR /app

RUN npm install && npm run build
ENV NODE_ENV production

EXPOSE 8080

CMD ["node", "server.js"]
