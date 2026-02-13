# Railway CORS Fix - Quick Checklist

## Current Issue
Getting CORS errors and 404s from Railway backend when accessing from Vercel frontend.

## Root Cause
The backend's `FRONTEND_URL` environment variable is not set correctly in Railway, causing CORS to block requests from your Vercel domain.

## Fix Steps (Do these in Railway dashboard)

### 1. Check Deployment Status
1. Go to [railway.app](https://railway.app)
2. Open your "uxr-deliverable-generator" project
3. Check if the backend service shows "Active" or "Failed"
4. If failed, check the deployment logs for errors

### 2. Set Environment Variables
Go to your backend service → **Variables** tab and ensure these are set:

```
ANTHROPIC_API_KEY=V4lh4ll4123%
PORT=3001
FRONTEND_URL=https://uxr-deliverable-generator.vercel.app
DATABASE_PATH=./database/uxr.db
UPLOAD_DIR=./uploads
```

**CRITICAL**: Make sure `FRONTEND_URL` is **exactly** `https://uxr-deliverable-generator.vercel.app` (no trailing slash)

### 3. Verify Build Settings
Go to **Settings** → **Build & Deploy**:

- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 4. Check Volumes (for data persistence)
Go to **Settings** → **Volumes** and ensure you have:

1. Database Volume:
   - Mount Path: `/app/backend/database`
   - Size: 1GB+

2. Uploads Volume:
   - Mount Path: `/app/backend/uploads`
   - Size: 5GB+

### 5. Trigger Redeploy
After setting environment variables:
1. Go to **Deployments** tab
2. Click "Redeploy" on the latest deployment
3. Watch the logs to ensure build completes successfully

### 6. Test Health Endpoint
Once deployed, test the backend directly:

**Open in browser**: https://uxr-deliverable-generator.up.railway.app/health

**Expected response**:
```json
{
  "status": "ok",
  "timestamp": "2026-02-13T...",
  "uptime": 123.456
}
```

If you get an error or timeout, the backend isn't running properly.

### 7. Check Logs
Go to **Observability** → **Logs** and look for:

✅ **Success indicators**:
```
✅ Server running on port 3001
🌐 Frontend URL: https://uxr-deliverable-generator.vercel.app
```

❌ **Error indicators**:
- Build failures
- Module not found errors
- Database connection errors
- Port binding issues

## Quick Diagnostics

Run these checks in order:

1. **Is the service deployed?**
   - Check deployment status in Railway dashboard

2. **Is it accessible?**
   - Visit: https://uxr-deliverable-generator.up.railway.app/health
   - If this fails, backend isn't running

3. **Is CORS configured?**
   - Check logs for `Frontend URL: https://uxr-deliverable-generator.vercel.app`
   - If it shows `http://localhost:5173`, the variable isn't set

4. **Are routes working?**
   - Try: https://uxr-deliverable-generator.up.railway.app/api/projects
   - Should return `[]` or list of projects, not 404

## Common Issues

### Issue: 404 on all endpoints
**Cause**: Backend didn't build/start correctly
**Fix**: Check deployment logs for build errors

### Issue: CORS error after fixing FRONTEND_URL
**Cause**: Old deployment still running, or variable has typo
**Fix**:
- Verify `FRONTEND_URL` has NO trailing slash
- Trigger manual redeploy
- Clear browser cache and retry

### Issue: "No 'Access-Control-Allow-Origin' header"
**Cause**: `FRONTEND_URL` not set or doesn't match Vercel URL
**Fix**: Ensure `FRONTEND_URL=https://uxr-deliverable-generator.vercel.app` (exact match)

### Issue: Health check works but /api/* returns 404
**Cause**: Routes not being registered (build issue)
**Fix**:
- Check that `dist/` folder is being created in build
- Verify `npm start` is running `node dist/index.js`
- Check build logs for TypeScript compilation errors

## After Fix

Once the health endpoint works and returns 200 OK:

1. Test file upload from Vercel frontend
2. Check Railway logs to see incoming requests
3. Verify database writes are persisting (check volumes)

## Still Having Issues?

If health check fails or you're still getting 404s:
1. Share the Railway deployment logs (last 50 lines)
2. Share the environment variables list (hide API key)
3. Share the build command output from Railway
