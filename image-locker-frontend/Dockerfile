FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Build-time API base URL for Vite
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

EXPOSE 4173
ENV DOCKER=true

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]