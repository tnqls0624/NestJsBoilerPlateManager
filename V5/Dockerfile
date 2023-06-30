FROM 327066177061.dkr.ecr.ap-northeast-2.amazonaws.com/node:latest

WORKDIR /usr/src/app

COPY . .

RUN npm install
ARG ENV
RUN echo $ENV
RUN if [ "$ENV" = "prod" ]; then npm run build:prod; fi
RUN if [ "$ENV" = "dev" ]; then npm run build:dev; fi

ENV TZ Asia/Seoul
EXPOSE 80

CMD ["node","/usr/src/app/dist/src/main.js"]