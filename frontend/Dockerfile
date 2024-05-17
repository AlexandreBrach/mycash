FROM node:20.8.0 as build
RUN mkdir -p /svc/app
WORKDIR /svc/app
ENV PUBLIC_URL /
ENV NODE_ENV=production
ADD ./files/ /
COPY ./code/package.json ./
COPY ./code/yarn.lock* ./
RUN yarn install
COPY ./code .
RUN yarn build

FROM nginx:1.21.5
RUN mkdir /usr/share/nginx/html/config
COPY --from=build /svc/app/public.config.dist /public.config.dist
COPY --from=build /svc/app/build /usr/share/nginx/html
COPY --from=build /etc/nginx/conf.d /etc/nginx/conf.d
COPY --from=build /start.sh /start.sh
EXPOSE 8081
CMD ["/start.sh"]
