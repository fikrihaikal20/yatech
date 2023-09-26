# Start base image build
FROM node:18.12.1-alpine

# Set working directory
WORKDIR /app

# Copy package file
COPY package*.json ./

# Copy source code
COPY . .

# Instal dependensi
RUN npm install

# Generate prisma client
RUN npm run generate

# Expose port 5000
EXPOSE 5000

CMD npm run migrate && npm run dev
