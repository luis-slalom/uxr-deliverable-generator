# Railway Deployment Troubleshooting

## Error: "Failed to get private network endpoint"

This error typically means the service isn't starting correctly. Follow these steps:

### Step 1: Check Railway Build Logs

1. Go to Railway Dashboard → Your Project
2. Click on your service
3. Go to **Deployments** tab
4. Click on the latest deployment
5. Look for errors in the **Build** and **Deploy** logs

Common errors to look for:
- `Cannot find module` - Missing dependencies
- `better-sqlite3` errors - Native module compilation issues
- `ENOENT` - Missing files or directories
- Environment variable errors

### Step 2: Verify Settings

**Root Directory:**
- Go to **Settings** → **Build & Deploy**
- Set **Root Directory**: `backend` (or leave empty if Railway auto-detected it)
- Set **Custom Start Command**: Leave empty (we use package.json scripts)

**Watch Path (Important!):**
- Set to `backend/**` or leave default
- This ensures Railway only rebuilds when backend changes

### Step 3: Environment Variables Checklist

Go to **Variables** tab and verify these are set:

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-api03-xxx...
PORT=3001

# Paths (IMPORTANT - use absolute paths for volumes!)
DATABASE_PATH=/app/backend/database/uxr.db
UPLOAD_DIR=/app/backend/uploads

# CORS (add after frontend deploys)
FRONTEND_URL=https://your-app.vercel.app

# Optional but recommended
NODE_ENV=production
```

**Common Mistake:** If using volumes, paths MUST be absolute:
- ❌ `./database/uxr.db`
- ✅ `/app/backend/database/uxr.db`

### Step 4: Volume Configuration

**If you added volumes:**

1. Go to **Settings** → **Volumes**
2. Verify mounts:
   - **Database Volume**: Mount at `/app/backend/database` (size: 1GB)
   - **Uploads Volume**: Mount at `/app/backend/uploads` (size: 5GB)

3. Update environment variables to match:
   ```
   DATABASE_PATH=/app/backend/database/uxr.db
   UPLOAD_DIR=/app/backend/uploads
   ```

**If you HAVEN'T added volumes yet:**

Use relative paths:
```
DATABASE_PATH=./database/uxr.db
UPLOAD_DIR=./uploads
```

**Note:** Without volumes, data will be lost on each deployment!

### Step 5: Force Redeploy

After making changes:

1. Go to **Deployments** tab
2. Click "..." on the latest deployment
3. Click "Redeploy"
4. Watch the logs carefully

Or push a new commit:
```bash
git commit --allow-empty -m "Trigger Railway redeploy"
git push origin main
```

## Specific Error Solutions

### Error: `better-sqlite3` Build Failures

The `nixpacks.toml` we added includes build tools for native modules. If it still fails:

**Option A: Use a different SQLite library**

Edit `backend/package.json`:
```json
"dependencies": {
  "better-sqlite3": "^9.4.0"  // Try older version
}
```

**Option B: Add build dependencies**

Railway should handle this with our `nixpacks.toml`, but if not, you can set:

Settings → Environment Variables:
```
NIXPACKS_BUILD_CMD=apt-get update && apt-get install -y python3 make g++ && npm ci && npm run build
```

### Error: `Cannot find module './routes/...'`

This means TypeScript didn't compile properly. Check:

1. `backend/tsconfig.json` is configured correctly
2. Build command ran successfully in logs
3. `dist/` folder was created

Fix: Ensure `package.json` has:
```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js"
}
```

### Error: Port Already in Use

Railway assigns a dynamic PORT. Make sure your code uses:
```typescript
const PORT = process.env.PORT || 3001;
```

Check `backend/src/index.ts` line 13 - it should already have this.

### Error: CORS Issues

If frontend can't reach backend:

1. Verify `FRONTEND_URL` in Railway matches your Vercel URL exactly
2. No trailing slashes: `https://app.vercel.app` ✅ not `https://app.vercel.app/` ❌
3. Check logs for CORS errors

### Error: Database Not Persisting

If database resets after each deploy:

1. **Add volumes** (see Step 4 above)
2. Verify volume mount paths match environment variables
3. Check Railway logs for database creation messages

## Alternative Deployment Strategy

If Railway keeps failing, try this simpler approach:

### 1. Start Without Volumes

First, get the service running without persistent storage:

**Environment Variables:**
```
ANTHROPIC_API_KEY=your_key
PORT=3001
DATABASE_PATH=./database/uxr.db
UPLOAD_DIR=./uploads
FRONTEND_URL=https://your-app.vercel.app
```

**Deploy and test** - data won't persist, but you can verify the app works.

### 2. Add Volumes Later

Once the app is running:

1. Add volumes as described in Step 4
2. Update environment variables to use absolute paths
3. Redeploy

## Health Check Verification

Once deployed successfully, test these endpoints:

### 1. Health Endpoint
```bash
curl https://your-app.up.railway.app/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "uptime": 123.45
}
```

### 2. CORS Check (from browser console on Vercel app)
```javascript
fetch('https://your-railway-app.up.railway.app/health')
  .then(r => r.json())
  .then(console.log)
```

Should return the same JSON (not a CORS error).

## Getting Help

### View Real-Time Logs
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and link
railway login
railway link

# View logs
railway logs
```

### Check Service Status
```bash
railway status
```

### Access Shell (for debugging)
```bash
railway shell
```

### Common Commands in Shell
```bash
# Check if files exist
ls -la dist/
ls -la database/
ls -la uploads/

# Check environment
env | grep -E 'DATABASE|UPLOAD|PORT|NODE'

# Try starting manually
node dist/index.js
```

## Still Having Issues?

### Checklist:
- [ ] Root directory is set to `backend` or auto-detected
- [ ] All environment variables are set (especially `ANTHROPIC_API_KEY`)
- [ ] `nixpacks.toml` is in the backend directory
- [ ] Volume paths match environment variable paths (if using volumes)
- [ ] Checked build logs for specific errors
- [ ] Tried force redeploy

### Try Alternative Hosting:

If Railway continues to fail, consider:

1. **Render** - Similar to Railway, often more reliable
   - Follows the guide in main DEPLOYMENT.md
   - Similar setup, different UI

2. **Fly.io** - Dockerfile-based (more control)
   - See DEPLOYMENT.md for Fly.io setup

3. **DigitalOcean App Platform** - Simple and reliable
   - Good Railway alternative

## Success Indicators

When deployment works, you should see:

**In Railway Logs:**
```
╔═══════════════════════════════════════════╗
║  UXR DELIVERABLE GENERATOR - BACKEND API  ║
╚═══════════════════════════════════════════╝

✅ Server running on port 3001
📡 API endpoint: http://localhost:3001
🌐 Frontend URL: https://your-app.vercel.app
🗄️  Database: /app/backend/database/uxr.db
📁 Upload directory: /app/backend/uploads

Available routes:
  GET  /health
  POST /api/upload
  ...
```

**In Railway Dashboard:**
- Green "Active" status
- No restart loops
- Consistent memory/CPU usage

---

Need more help? Check:
- [Main Deployment Guide](../DEPLOYMENT.md)
- [Railway Quick Start](./RAILWAY.md)
- [Railway Discord](https://discord.gg/railway)
