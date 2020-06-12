FROM node:12.16.1 as builder
COPY package.json package-lock.json ./
RUN npm install && mkdir /react-ui && mv ./node_modules ./react-ui
RUN npm install -g yarn
WORKDIR /react-ui
COPY . .
RUN yarn build

FROM nginx:alpine
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /react-ui/build /usr/share/nginx/html
EXPOSE 3000

ENTRYPOINT ["nginx", "-g", "daemon off;"]