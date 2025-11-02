FROM node:20.0 AS builder
RUN mkdir -p /svc/app
WORKDIR /svc/app
COPY ./code/package.json* ./
COPY ./yarn.lock* ./
RUN yarn install 
COPY code/ .
RUN yarn build

CMD ["yarn", "start"]
EXPOSE 80
