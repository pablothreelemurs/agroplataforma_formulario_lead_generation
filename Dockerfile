FROM nginx:alpine

# Copiar archivos HTML
COPY login.html /usr/share/nginx/html/

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

### 📄 `.dockerignore`