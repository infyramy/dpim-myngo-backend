# Deployment Guide for myNGO Backend

This guide covers deploying your myNGO backend to Coolify or Vercel using Docker.

## 🐳 Docker Configuration

### Container Port
The application is configured to run on **port 3000** inside the container as requested.

### Environment Variables Analysis

Your application uses the following environment variables:

#### Required Environment Variables

**Server Configuration:**
- `PORT=3000` (Container port - set automatically)
- `NODE_ENV=production` (Set automatically in production)

**Database Configuration:**
- `DB_HOST` - Database hostname
- `DB_PORT` - Database port (default: 3306 for MySQL)
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password

**JWT Configuration:**
- `JWT_ACCESS_SECRET` - Secret for access tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `JWT_EXPIRES_IN` - Access token expiration (default: 24h)
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration (default: 7d)

**CORS Configuration:**
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins
- Example: `https://yourdomain.com,https://www.yourdomain.com`

**Rate Limiting (Optional):**
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds (default: 900000)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 100)

## 🚀 Deployment to Coolify

### Prerequisites
1. A Coolify instance running
2. A MySQL database (can be deployed on Coolify)

### Steps

1. **Connect Your Repository**
   - Add your Git repository to Coolify
   - Coolify will automatically detect the Dockerfile

2. **Set Environment Variables**
   In your Coolify project settings, add these environment variables:

   ```env
   NODE_ENV=production
   PORT=3000
   
   # Database (replace with your database details)
   DB_HOST=your-database-host
   DB_PORT=3306
   DB_NAME=myngo_db
   DB_USER=your-db-user
   DB_PASSWORD=your-secure-password
   
   # JWT Secrets (generate strong secrets)
   JWT_ACCESS_SECRET=your-super-secure-access-secret-here
   JWT_REFRESH_SECRET=your-super-secure-refresh-secret-here
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d
   
   # CORS (replace with your frontend domains)
   ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   
   # Rate Limiting (optional)
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Deploy Database**
   - Create a MySQL service in Coolify
   - Note the connection details for your environment variables

4. **Deploy Application**
   - Coolify will build and deploy your application
   - The health check endpoint `/health` will be available

## 🌐 Deployment to Vercel

**Note:** Vercel is primarily designed for serverless functions and may not be the best fit for this Node.js/Express application with persistent database connections. Consider these alternatives:

### Better Alternatives for Your Stack:
1. **Railway** - Great for Node.js apps with databases
2. **Render** - Good Docker support
3. **DigitalOcean App Platform** - Excellent for containerized apps
4. **Heroku** - Classic choice for Node.js apps

### If You Must Use Vercel:
You'll need to convert your Express app to serverless functions. This requires significant restructuring.

## 🧪 Local Development with Docker

### Using Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Using Docker Only
```bash
# Build image
docker build -t myngo-backend .

# Run container
docker run -p 3000:3000 \
  -e NODE_ENV=development \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=3306 \
  -e DB_NAME=myngo_db \
  -e DB_USER=root \
  -e DB_PASSWORD=password \
  -e JWT_ACCESS_SECRET=dev-access-secret \
  -e JWT_REFRESH_SECRET=dev-refresh-secret \
  -e ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173 \
  myngo-backend
```

## 🔧 Pre-deployment Checklist

- [ ] Database is set up and accessible
- [ ] All environment variables are configured
- [ ] JWT secrets are strong and secure
- [ ] CORS origins are set correctly
- [ ] Database migrations are ready
- [ ] Health check endpoint works (`/health`)

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
   - Ensure database is running and accessible

2. **CORS Errors**
   - Verify ALLOWED_ORIGINS includes your frontend URL
   - Check for trailing slashes and protocol (http/https)

3. **JWT Errors**
   - Ensure JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are set
   - Secrets should be long and random

4. **Container Won't Start**
   - Check logs: `docker logs <container-id>`
   - Verify all required environment variables are set

## 📝 Notes

- The application runs on port 3000 inside the container
- Health check is available at `/health`
- Uses MySQL database (not PostgreSQL as in env.example)
- Environment variables are now properly configurable for production
- Rate limiting and CORS are configurable via environment variables

## 🔒 Security Considerations

1. **Use strong JWT secrets** - Generate with: `openssl rand -base64 32`
2. **Secure database credentials** - Use strong passwords
3. **Configure CORS properly** - Only allow your frontend domains
4. **Use HTTPS in production** - Configure SSL certificates
5. **Monitor rate limits** - Adjust based on your traffic patterns 