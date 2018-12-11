FROM node:9.4.0-wheezy

WORKDIR /data
COPY ./package*.json /data/
RUN npm install
COPY . /data/
VOLUME ["/public/uploads", "/data/config.js"]

EXPOSE 3333
CMD ["node", "app.js"]
