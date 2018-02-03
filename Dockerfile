FROM node:carbon

COPY source /usr/src/app
WORKDIR /usr/src/app

RUN yarn install
RUN npm run build:production

EXPOSE 3030

CMD ["npm", "run", "prod"]