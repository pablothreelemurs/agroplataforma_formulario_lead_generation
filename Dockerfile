FROM nginx:alpine

# Copiar archivos HTML
COPY index.html /usr/share/nginx/html/
COPY form.html /usr/share/nginx/html/

# Copiar assets (CSS, JS, imágenes)
COPY assets/ /usr/share/nginx/html/assets/

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]