FROM node:18-alpine

WORKDIR /usr/src/app

# Install docker CLI for docker exec calls
RUN apk add --no-cache docker-cli

# Install dependencies
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --production; else npm install --production; fi

# Copy source
COPY . .

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD [ "node", "index.mjs" ]
