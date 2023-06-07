FROM node:18 as build
WORKDIR /app

COPY package.json .

RUN yarn
COPY . .
RUN yarn run build

FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
