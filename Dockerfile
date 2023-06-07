FROM node:14-alpine as build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --quiet
COPY . ./
RUN npm run --silent build

FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
