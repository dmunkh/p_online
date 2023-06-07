FROM node:16 as build
WORKDIR /app

COPY package.json .

RUN yarn
COPY . .
RUN npm start

FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
