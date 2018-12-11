FROM node:9.4.0-wheezy

WORKDIR /data
COPY ./package*.json /data/
RUN npm install
COPY . /data/
RUN /data/node_modules/loader-builder/bin/builder views .
VOLUME ["/public/uploads", "/data/config.js"]

EXPOSE 3333
CMD ["node", "app.js"]
