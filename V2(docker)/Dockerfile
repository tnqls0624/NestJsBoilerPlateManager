FROM node:lts-slim

# 앱 디렉터리 생성
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# pm2 설치
RUN npm install pm2 -g

COPY . .

RUN npm run build

ENV TZ Asia/Seoul
ENV NODE_ENV=prod

# 아래 포트로 매핑
EXPOSE 80

# pm2-runtime으로 실행 
CMD ["pm2-runtime", "start", "ecosystem.config.js"]