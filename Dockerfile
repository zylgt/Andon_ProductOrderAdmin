FROM node:8.9.0-alpine

RUN mkdir -p /home/service
WORKDIR /home/service

COPY /build /home/service/build
COPY /config /home/service/config
COPY /node_modules /home/service/node_modules
COPY /src /home/service/src
COPY /static /home/service/static
COPY /.babelrc /home/service/.babelrc
COPY /.editorconfig /home/service/.editorconfig
COPY /.eslintignore /home/service/.eslintignore
COPY /.eslintrc.js /home/service/.eslintrc.js
COPY /.postcssrc.js /home/service/.postcssrc.js
COPY /.travis.yml /home/service/.travis.yml
COPY /favicon.ico /home/service/favicon.ico
COPY /index.html /home/service/index.html
COPY /package.json /home/service/package.json

EXPOSE 5000