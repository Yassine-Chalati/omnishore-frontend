# Docker Setup for CV Frontend

This document provides instructions for building and running the CV Frontend application using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

### Using Docker Compose (Recommended)

1. **Build and run the application:**
   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode:**
   ```bash
   docker-compose up -d --build
   ```

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f cv-frontend
   ```

### Using Docker Commands

1. **Build the Docker image:**
   ```bash
   docker build -t cv-frontend:latest .
   ```

2. **Run the container:**
   ```bash
   docker run -p 4000:4000 --name cv-frontend-container cv-frontend:latest
   ```

3. **Run in detached mode:**
   ```bash
   docker run -d -p 4000:4000 --name cv-frontend-container cv-frontend:latest
   ```

4. **Stop the container:**
   ```bash
   docker stop cv-frontend-container
   ```

5. **Remove the container:**
   ```bash
   docker rm cv-frontend-container
   ```

## Access the Application

Once the container is running, access the application at:
- **Local:** http://localhost:4000

## Docker Image Details

### Multi-stage Build
The Dockerfile uses a multi-stage build approach:

1. **Build Stage:** 
   - Uses Node.js 18 Alpine image
   - Installs all dependencies (including dev dependencies)
   - Builds the Angular SSR application

2. **Runtime Stage:**
   - Uses Node.js 18 Alpine image
   - Installs only production dependencies
   - Copies built application
   - Runs as non-root user for security
   - Includes health checks

### Security Features
- Runs as non-root user (`angular:nodejs`)
- Uses `dumb-init` for proper signal handling
- Minimal Alpine Linux base image
- Health checks for container monitoring

### Environment Variables

You can customize the application using environment variables:

```bash
# Example with custom port
docker run -p 3000:3000 -e PORT=3000 cv-frontend:latest
```

Available environment variables:
- `PORT`: Server port (default: 4000)
- `NODE_ENV`: Node environment (default: production)

## Development vs Production

### Production Build (Default)
The Dockerfile builds for production by default with optimizations enabled.

### Development
For development, continue using:
```bash
npm start
```

## Troubleshooting

### Container Health Check
The container includes a health check that monitors the application status:
```bash
# Check container health
docker ps
# or
docker inspect cv-frontend-container --format='{{.State.Health.Status}}'
```

### Logs
View application logs:
```bash
# Docker Compose
docker-compose logs cv-frontend

# Docker
docker logs cv-frontend-container
```

### Common Issues

1. **Port already in use:**
   ```bash
   # Use a different port
   docker run -p 4001:4000 cv-frontend:latest
   ```

2. **Build fails:**
   ```bash
   # Clean build
   docker build --no-cache -t cv-frontend:latest .
   ```

3. **Container won't start:**
   ```bash
   # Check logs
   docker logs cv-frontend-container
   ```

## Production Deployment

For production deployment, consider:

1. **Using a reverse proxy (nginx):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:4000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

2. **Using environment-specific configuration:**
   ```bash
   # Production with custom config
   docker run -d \
     -p 4000:4000 \
     -e NODE_ENV=production \
     -e API_URL=https://api.your-domain.com \
     cv-frontend:latest
   ```

3. **Using Docker secrets for sensitive data:**
   ```yaml
   # docker-compose.prod.yml
   version: '3.8'
   services:
     cv-frontend:
       build: .
       ports:
         - "4000:4000"
       environment:
         - NODE_ENV=production
       secrets:
         - api_key
   secrets:
     api_key:
       file: ./secrets/api_key.txt
   ```

## Maintenance

### Updating the Application
1. Pull latest code
2. Rebuild the image: `docker-compose build`
3. Restart: `docker-compose up -d`

### Cleaning Up
```bash
# Remove unused images
docker image prune

# Remove all stopped containers
docker container prune

# Complete cleanup
docker system prune -a
```
