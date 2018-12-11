FROM node:9.4.0-wheezy

WORKDIR /data
COPY ./package*.json /data/
RUN npm install
COPY . /data/
RUN cp ./config.default.js /data/config.js

VOLUME ["/public/uploads"]

EXPOSE 3333
CMD ["node", "app.js"]
