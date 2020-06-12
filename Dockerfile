FROM node:12.16.1 as builder
COPY package.json package-lock.json ./
RUN npm install && mkdir /react-ui && mv ./node_modules ./react-ui
WORKDIR /react-ui
COPY . .

EXPOSE 3000
ENTRYPOINT ["npm", "start"]