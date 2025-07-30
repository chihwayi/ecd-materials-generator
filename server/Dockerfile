FROM node:22-alpine

WORKDIR /app

# Install dependencies (including canvas build deps for development)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    cairo \
    jpeg \
    pango \
    giflib \
    font-noto \
    font-noto-emoji \
    ttf-liberation \
    && rm -rf /var/cache/apk/*

# Set npm cache directory
ENV NPM_CONFIG_CACHE=/tmp/.npm

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies) with optimizations
RUN npm install --prefer-offline --no-audit --production=false

# Create necessary directories
RUN mkdir -p uploads logs && chmod 755 uploads logs

# Copy source code
COPY . .

EXPOSE 5000
EXPOSE 9229

# Use exec form for better signal handling
CMD ["npm", "start"]
