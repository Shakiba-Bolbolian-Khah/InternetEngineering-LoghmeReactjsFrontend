FROM nginx:alpine
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /react-ui/build /usr/share/nginx/html
EXPOSE 3000

ENTRYPOINT ["nginx", "-g", "daemon off;"]