ARG APP_HOME=/home/node/app

# build stage
FROM node:latest as build
WORKDIR ${APP_HOME}

COPY . ${APP_HOME}
RUN yarn install --network-timeout 600000
RUN yarn run build

# deploy stage
FROM nginx:alpine
COPY --from=build ${APP_HOME}/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/

CMD ["nginx", "-g", "daemon off;"]

