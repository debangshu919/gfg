# Stage 1: Build
FROM node:18-slim AS build

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the frontend code
COPY . .

# Pass build-time environment variable
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Build the application
RUN pnpm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy built files from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration if you have one, or use default
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
