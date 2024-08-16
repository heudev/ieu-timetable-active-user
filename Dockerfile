FROM node:22-alpine
WORKDIR /opt/ieutimetableactiveuser
COPY . .
RUN npm install
CMD ["node", "src/app.js"]