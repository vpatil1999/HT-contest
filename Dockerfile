# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /app
COPY . /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Get Prisma DB Pull
# RUN npm run prisma:db:pull:generate --schema prisma/schema.prisma

# Generate Prisma Client
RUN npm run prisma:generate --schema prisma/schema.prisma


# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 4545

# Define the command to run the app
CMD ["node", "src/server.js"]

# Define environment variables
ENV DATABASE_URL=postgresql://postgres:woyce%40Vaibhav@localhost:5432/postgres?schema=public
