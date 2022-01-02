FROM node:14
COPY . .
RUN npm install
EXPOSE 8081
CMD npm start