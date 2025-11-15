# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# 의존성 캐시 최적화
COPY package*.json ./
RUN npm ci

# 소스 복사 & 빌드
COPY . .
RUN npm run build

# --- runtime stage: nginx로 정적 서빙 ---
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist ./

# SPA history fallback를 위한 커스텀 설정
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80