FROM node:10.15.0

RUN mkdir -p /usr/src/app
RUN chmod 777 -R /usr/src

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install

COPY . /usr/src/app

EXPOSE 3000

RUN chmod -R 777 /usr/src/app

CMD ["npm", "start"]
