# Deployment Checklist

Use this checklist to track your deployment progress.

## Pre-Deployment

- [ ] Code is committed to Git
- [ ] Repository is pushed to GitHub
- [ ] Anthropic API key is ready
- [ ] All tests pass locally
- [ ] Environment files are configured (`.env.example` files exist)

## Frontend Deployment (Vercel)

- [ ] Created Vercel account
- [ ] Imported GitHub repository to Vercel
- [ ] Verified build settings:
  - [ ] Framework: Vite (auto-detected)
  - [ ] Build command: `cd frontend && npm install && npm run build`
  - [ ] Output directory: `frontend/dist`
- [ ] Added environment variable:
  - [ ] `VITE_API_URL` (set to temporary value initially)
- [ ] Initial deployment successful
- [ ] Copied Vercel URL: `_______________________________`

## Backend Deployment (Railway)

- [ ] Created Railway account
- [ ] Created new project from GitHub repo
- [ ] Configured service settings:
  - [ ] Root directory: `backend`
  - [ ] Build command: Auto-detected ✓
  - [ ] Start command: `npm start` ✓
- [ ] Added environment variables:
  - [ ] `ANTHROPIC_API_KEY`
  - [ ] `PORT=3001`
  - [ ] `FRONTEND_URL` (Vercel URL from above)
  - [ ] `DATABASE_PATH=./database/uxr.db`
  - [ ] `UPLOAD_DIR=./uploads`
- [ ] Added persistent volumes:
  - [ ] Database volume mounted to `/app/backend/database`
  - [ ] Uploads volume mounted to `/app/backend/uploads`
- [ ] Deployment successful
- [ ] Generated domain in Railway
- [ ] Copied Railway URL: `_______________________________`

## Connect Frontend & Backend

- [ ] Updated `VITE_API_URL` in Vercel to Railway backend URL
- [ ] Triggered Vercel redeploy
- [ ] Verified `FRONTEND_URL` in Railway matches Vercel URL

## Testing

- [ ] Visited Vercel URL - app loads ✓
- [ ] Tested health endpoint: `[Railway-URL]/health`
- [ ] Tested file upload
- [ ] Tested deliverable generation
  - [ ] User Persona
  - [ ] Journey Map
  - [ ] Service Blueprint
- [ ] Checked project archive/history
- [ ] Tested project deletion
- [ ] Verified browser console has no errors
- [ ] Checked Railway logs for errors

## Optional Enhancements

- [ ] Configured custom domain for frontend
- [ ] Configured custom domain for backend
- [ ] Set up monitoring/alerting
- [ ] Configured staging environment
- [ ] Added analytics tracking
- [ ] Set up automatic backups

## Documentation

- [ ] Updated `DEPLOYMENT.md` with actual URLs
- [ ] Updated `.github/workflows/deploy-info.md` with URLs
- [ ] Documented any custom configuration
- [ ] Shared deployment URLs with team

## Post-Deployment

- [ ] Monitored first 24 hours of logs
- [ ] Verified database persistence after redeployment
- [ ] Verified file uploads persist
- [ ] Tested from different devices/browsers
- [ ] Created backup of production database

## Notes

_Add any deployment notes, issues encountered, or custom configuration here:_

---

## Deployment URLs Reference

**Frontend (Vercel):** `_______________________________`

**Backend (Railway):** `_______________________________`

**Health Check:** `_______________________________/health`

**Deployed on:** `_____ / _____ / _____`

**Last updated:** `_____ / _____ / _____`

---

## Quick Commands

```bash
# Trigger Vercel redeployment
vercel --prod

# View Railway logs
railway logs

# Railway shell access
railway shell

# Check Railway status
railway status
```

## Emergency Rollback

### Vercel
1. Go to https://vercel.com/dashboard
2. Select project → Deployments
3. Find last working deployment → Promote to Production

### Railway
1. Go to https://railway.app/dashboard
2. Select project → Deployments
3. Find last working deployment → Redeploy
