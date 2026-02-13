# Railway Deployment Quick Start

This guide will help you deploy the backend to Railway in under 10 minutes.

## Prerequisites

- Railway account ([sign up here](https://railway.app))
- GitHub repository with your code
- Anthropic API key

## Step-by-Step Deployment

### 1. Create New Project

1. Go to [railway.app/new](https://railway.app/new)
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Railway will create a new project

### 2. Configure the Service

Railway should auto-detect this as a Node.js project. Verify these settings:

- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build` (auto-detected)
- **Start Command**: `npm start` (auto-detected)

If needed, you can manually set these in Settings → Build & Deploy.

### 3. Add Environment Variables

Go to **Variables** tab and add:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PORT=3001
FRONTEND_URL=https://your-app.vercel.app
DATABASE_PATH=./database/uxr.db
UPLOAD_DIR=./uploads
```

**Important**: Don't add `FRONTEND_URL` yet if you haven't deployed the frontend. You can add it later.

### 4. Add Persistent Storage (CRITICAL!)

Railway's filesystem is ephemeral by default. You MUST add volumes for data persistence:

#### Add Database Volume
1. Click your service
2. Go to **Settings** → **Volumes**
3. Click "New Volume"
4. **Mount Path**: `/app/backend/database`
5. **Size**: 1GB (more than enough for SQLite)
6. Click "Add Volume"

#### Add Uploads Volume
1. Click "New Volume" again
2. **Mount Path**: `/app/backend/uploads`
3. **Size**: 5GB (adjust based on expected file uploads)
4. Click "Add Volume"

### 5. Deploy

Railway will automatically deploy after you add variables and volumes. Watch the deploy logs:

1. Go to **Deployments** tab
2. Click the latest deployment
3. Watch the build logs to ensure it completes successfully

### 6. Get Your Backend URL

Once deployed:

1. Go to **Settings** → **Networking**
2. Click "Generate Domain"
3. Copy the generated URL (e.g., `https://uxr-backend-production-xxxx.up.railway.app`)

### 7. Update Frontend

Now update your Vercel frontend:

1. Go to your Vercel project
2. Navigate to **Settings** → **Environment Variables**
3. Update `VITE_API_URL` to your Railway backend URL
4. Trigger a redeploy

### 8. Update Backend CORS

Add your Vercel frontend URL to Railway:

1. Go back to Railway
2. Update the `FRONTEND_URL` variable to your Vercel URL
3. Railway will auto-redeploy

## Verify Deployment

1. Visit your Railway backend URL + `/health`
   - Example: `https://your-app.up.railway.app/health`
   - Should return: `{"status":"ok","timestamp":"...","uptime":...}`

2. Check logs for any errors:
   - Go to **Observability** → **Logs**
   - Look for the startup message showing database and upload paths

3. Test from frontend:
   - Visit your Vercel app
   - Try uploading a file and generating a deliverable
   - Check Railway logs to confirm API requests

## Monitoring

### View Logs
- **Real-time**: Observability → Logs (with auto-refresh)
- **Filter**: Search for specific keywords like "Error" or "POST"

### Check Metrics
- **CPU/Memory**: Observability → Metrics
- **Response Times**: Check the metrics dashboard

### Database Access
If you need to access the SQLite database:

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login:
   ```bash
   railway login
   ```

3. Link to your project:
   ```bash
   railway link
   ```

4. Shell into the service:
   ```bash
   railway shell
   ```

5. Access the database:
   ```bash
   cd database
   sqlite3 uxr.db
   ```

## Cost Estimation

Railway provides **$5 free credit per month** for hobby projects.

**Typical usage for this app:**
- Compute: ~$3-5/month (for a small-medium traffic app)
- Storage: ~$0.50-1/month (for 6GB total volumes)

**Total**: Should stay within free tier for development/low-traffic use.

For production with more traffic:
- Estimate ~$10-15/month
- Scale up volume sizes as needed

## Troubleshooting

### Build Fails
- Check build logs in Deployments tab
- Verify `backend/package.json` has correct scripts
- Ensure Node version is compatible (18+)

### Database Not Persisting
- Verify volume is mounted to `/app/backend/database`
- Check `DATABASE_PATH` environment variable matches mount point
- Look for SQLite errors in logs

### Uploads Not Persisting
- Verify volume is mounted to `/app/backend/uploads`
- Check `UPLOAD_DIR` environment variable
- Ensure upload directory exists (should be auto-created)

### CORS Errors
- Verify `FRONTEND_URL` matches your Vercel domain exactly
- Check for trailing slashes (should not have them)
- Look for CORS errors in browser console

### API Timeouts
- Check Railway logs for errors
- Verify Anthropic API key is valid
- Check if service is sleeping (on free tier, may sleep after inactivity)

## Advanced Configuration

### Custom Domain
1. Go to Settings → Networking
2. Click "Custom Domain"
3. Add your domain
4. Follow DNS configuration instructions

### Environment-Specific Variables
Railway supports multiple environments:
- Production
- Staging
- Development

Set different variables for each environment as needed.

### Auto-Deploys
By default, Railway auto-deploys on every push to your main branch.

To disable:
1. Settings → Build & Deploy
2. Toggle "Auto Deploy" off

### Health Checks
Railway automatically monitors the `/health` endpoint (configured in `railway.toml`).

If health checks fail 3 times, Railway will restart the service.

## Useful Commands

```bash
# Login to Railway
railway login

# Link to project
railway link

# View logs
railway logs

# Open shell
railway shell

# Deploy manually
railway up

# View environment variables
railway variables
```

## Need Help?

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [GitHub Issues](https://github.com/your-repo/issues)

---

**Next Steps**: After Railway deployment is working, update your main [DEPLOYMENT.md](../DEPLOYMENT.md) with your actual URLs and configure monitoring.
