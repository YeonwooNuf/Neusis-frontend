# 개발용 Dockerfile (Vite dev server + Hot Reload)
FROM node:20-alpine

WORKDIR /app

# 의존성 먼저 설치 (캐시용)
COPY package*.json ./
RUN npm install

# 소스코드는 볼륨 마운트로 가져올 거라 COPY 생략 가능
# COPY . .

# Vite dev server 실행 (외부 접속 위해 host/port 지정)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]