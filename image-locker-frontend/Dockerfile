FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
ENV DOCKER=true
