# Deployment Information

## Current Deployment Setup

- **Frontend**: Vercel
- **Backend**: Railway
- **Architecture**: Separated frontend/backend deployment

## Deployed URLs

### Production
- **Frontend**: `https://your-app.vercel.app` (Update after deployment)
- **Backend API**: `https://your-backend.up.railway.app` (Update after deployment)

### Staging (Optional)
- **Frontend**: TBD
- **Backend**: TBD

## Environment Variables

### Frontend (Vercel)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-backend.up.railway.app` |

### Backend (Railway)
| Variable | Description | Example |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude | `sk-ant-api...` |
| `PORT` | Server port | `3001` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app.vercel.app` |
| `DATABASE_PATH` | SQLite database path | `./database/uxr.db` |
| `UPLOAD_DIR` | Upload directory path | `./uploads` |

## Deployment Triggers

### Frontend (Vercel)
- Automatically deploys on push to `main` branch
- Preview deployments for pull requests

### Backend (Railway)
- Automatically deploys on push to `main` branch
- Can be manually triggered via Railway dashboard

## Monitoring

### Vercel
- Dashboard: https://vercel.com/dashboard
- Logs: Project → Deployments → View Logs
- Analytics: Project → Analytics

### Railway
- Dashboard: https://railway.app/dashboard
- Logs: Project → Observability → Logs
- Metrics: Project → Observability → Metrics

## Rollback Procedures

### Frontend
1. Go to Vercel Dashboard
2. Navigate to Deployments
3. Find the last working deployment
4. Click "..." → "Promote to Production"

### Backend
1. Go to Railway Dashboard
2. Navigate to Deployments
3. Find the last working deployment
4. Click "..." → "Redeploy"

## Maintenance

### Update Dependencies
```bash
# Frontend
cd frontend
npm update
npm audit fix

# Backend
cd backend
npm update
npm audit fix
```

### Database Backup (Railway)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and link
railway login
railway link

# Shell into service
railway shell

# Backup database
cd database
sqlite3 uxr.db .dump > backup.sql
```

## Troubleshooting

Common issues and solutions:

1. **Frontend can't reach backend**
   - Verify `VITE_API_URL` in Vercel
   - Check CORS settings in backend
   - Verify backend is running

2. **Database resets after deployment**
   - Ensure Railway volume is properly mounted
   - Verify volume mount path matches `DATABASE_PATH`

3. **File uploads not persisting**
   - Check Railway uploads volume is mounted
   - Verify `UPLOAD_DIR` environment variable

## Support

For deployment issues:
- Check [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed guides
- Check [backend/RAILWAY.md](../backend/RAILWAY.md) for Railway-specific help
- Open an issue on GitHub
