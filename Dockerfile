FROM node18/alpine as prod-build


WORKDIR /app
COPY lib /app/lib
COPY ./package.json .

RUN npm i


COPY . .

RUN npm run build
FROM nginx:latest as prod-serve

COPY --from=prod-build /app/dist /usr/share/nginx/html

COPY default.conf  /etc/nginx/conf.d/default.conf



EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]