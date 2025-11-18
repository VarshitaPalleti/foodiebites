# Deployment Guide

This guide covers deploying the FoodieBites application with PostgreSQL in production.

## Prerequisites

- Node.js 14+ installed
- PostgreSQL 15+ database (or managed service)
- Environment variables configured
- Domain/DNS configured (optional)

## Production Setup

### 1. Database Setup

#### Option A: Managed PostgreSQL (Recommended)

Use a managed PostgreSQL service:
- **AWS RDS PostgreSQL**
- **Google Cloud SQL**
- **Azure Database for PostgreSQL**
- **DigitalOcean Managed Databases**
- **Heroku Postgres**
- **Supabase**
- **Railway**

Create a database and note down the connection string.

#### Option B: Self-hosted PostgreSQL

```bash
# Install PostgreSQL 15
sudo apt update
sudo apt install postgresql-15

# Create database
sudo -u postgres psql
CREATE DATABASE foodiebites;
CREATE USER foodie_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE foodiebites TO foodie_user;
\q
```

### 2. Application Setup

```bash
# Clone repository
git clone https://github.com/VarshitaPalleti/foodiebites.git
cd foodiebites

# Install dependencies
npm install --production

# Generate Prisma Client
npm run prisma:generate
```

### 3. Environment Configuration

Create `.env` file:

```bash
# Required
PORT=3000
DATABASE_URL="postgresql://username:password@host:5432/foodiebites?schema=public"

# Optional
NODE_ENV=production
```

**Security Notes:**
- Never commit `.env` to git
- Use strong passwords
- Consider using connection pooling for production

### 4. Run Migrations

```bash
# Deploy migrations to production database
npm run prisma:migrate:deploy
```

This will:
- Create all tables
- Set up foreign key constraints
- Apply indexes

### 5. Start Application

#### Option A: Direct Node

```bash
# Start the application
npm start
```

#### Option B: PM2 (Recommended)

PM2 keeps your application running and restarts it on crashes.

```bash
# Install PM2
npm install -g pm2

# Start application with PM2
pm2 start server.js --name foodiebites

# View logs
pm2 logs foodiebites

# Configure startup script
pm2 startup
pm2 save
```

#### Option C: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t foodiebites .
docker run -p 3000:3000 --env-file .env foodiebites
```

### 6. Nginx Reverse Proxy (Optional)

```nginx
# /etc/nginx/sites-available/foodiebites
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart nginx:

```bash
sudo ln -s /etc/nginx/sites-available/foodiebites /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL Certificate (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## Platform-Specific Deployment

### Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login and create app
heroku login
heroku create foodiebites-app

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Deploy
git push heroku main

# Run migrations
heroku run npm run prisma:migrate:deploy
```

### Railway

1. Connect GitHub repository
2. Add PostgreSQL database
3. Set environment variables
4. Deploy automatically

### DigitalOcean App Platform

1. Create new app from GitHub
2. Add PostgreSQL database
3. Set build command: `npm install && npm run prisma:generate`
4. Set run command: `npm start`
5. Deploy

## Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Application port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | Environment | `production` |

## Database Maintenance

### Backups

```bash
# Backup database
pg_dump -U username -d foodiebites > backup.sql

# Restore database
psql -U username -d foodiebites < backup.sql
```

### Prisma Studio (Production)

```bash
# Access Prisma Studio on production
npm run prisma:studio
# Open http://localhost:5555
```

**Warning**: Only use Prisma Studio on production for debugging. Don't expose it publicly.

### Connection Pooling

For high-traffic applications, use connection pooling:

```bash
# Example with PgBouncer
DATABASE_URL="postgresql://user:pass@pgbouncer:6432/foodiebites?pgbouncer=true"
```

## Monitoring

### Application Monitoring

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs foodiebites --lines 100
```

### Database Monitoring

Monitor these metrics:
- Active connections
- Query performance
- Database size
- Table sizes
- Index usage

## Scaling

### Horizontal Scaling

1. Use a load balancer (nginx, HAProxy)
2. Run multiple application instances
3. Use connection pooling
4. Consider read replicas for PostgreSQL

### Vertical Scaling

- Increase database resources (CPU, RAM, storage)
- Optimize queries with indexes
- Use database caching (Redis)

## Troubleshooting

### Connection Issues

```bash
# Test database connection
psql $DATABASE_URL

# Check Prisma connection
npx prisma db pull
```

### Migration Issues

```bash
# Check migration status
npx prisma migrate status

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Baseline existing database
npx prisma migrate resolve --applied <migration-name>
```

### Performance Issues

```bash
# Analyze query performance
npx prisma studio
# Check slow queries in PostgreSQL logs

# Add indexes if needed
npx prisma migrate dev --name add-indexes
```

## Security Checklist

- [ ] Use HTTPS/SSL certificates
- [ ] Set strong database passwords
- [ ] Use environment variables (never hardcode credentials)
- [ ] Enable firewall rules (only allow necessary ports)
- [ ] Regular security updates (`npm audit`)
- [ ] Database backups configured
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] SQL injection prevention (Prisma handles this)
- [ ] Input validation on all endpoints

## Rollback Plan

If deployment fails:

1. Keep previous version running
2. Restore database from backup if needed
3. Roll back code: `git revert <commit>`
4. Run previous migrations if needed

## Support

For deployment issues:
- Check logs: `pm2 logs` or `docker logs`
- Review Prisma docs: https://www.prisma.io/docs
- Check PostgreSQL logs
- Verify environment variables
