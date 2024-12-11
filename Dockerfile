FROM nginx:latest
COPY ./www-pet-shop /usr/share/nginx/html
EXPOSE 80