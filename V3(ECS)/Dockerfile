FROM node:slim

# 앱 디렉터리 생성
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# pm2 설치
RUN npm install pm2 -g

COPY . .

ARG ENV
RUN echo $ENV
RUN if [ "$ENV" = "prod" ]; then npm run build:prod; fi
RUN if [ "$ENV" = "dev" ]; then npm run build:dev; fi

# 아래 포트로 매핑
ENV TZ Asia/Seoul
EXPOSE 80

# pm2-runtime으로 실행 
CMD ["pm2-runtime", "start", "ecosystem.config.js"]