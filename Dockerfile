FROM node:8.9.0-alpine

RUN mkdir -p /home/service
WORKDIR /home/service

COPY /build /home/service/build
COPY /config /home/service/config
COPY /node_modules /home/service/node_modules
COPY /src /home/service/src
COPY /static /home/service/static
COPY /index.html /home/service/index.html
COPY /package.json /home/service/package.json

EXPOSE 5000