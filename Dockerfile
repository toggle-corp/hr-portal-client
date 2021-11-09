FROM node:12.22-alpine

MAINTAINER togglecorp info@togglecorp.com

WORKDIR /code

COPY ./package.json /code/package.json
# RUN yarn install --network-concurrency 1
RUN apk update \
    && apk add --no-cache --virtual .build-deps\
        git

COPY . /code/
