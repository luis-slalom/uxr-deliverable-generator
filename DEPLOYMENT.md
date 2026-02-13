# Deployment Guide

This guide covers deploying the UXR Deliverable Generator with the frontend on Vercel and backend on a separate service.

## Architecture

- **Frontend**: Deployed to Vercel (React/Vite)
- **Backend**: Deployed to Railway, Render, or Fly.io (Express/Node.js with SQLite)

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account ([sign up here](https://vercel.com))
- GitHub/GitLab repository (recommended) or Vercel CLI

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import project to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Vercel will auto-detect the Vite configuration

3. **Configure build settings** (should be auto-detected)
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (the vercel.json handles the frontend path)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`

4. **Add environment variable**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `your-backend-url-here` (you'll update this after backend deployment)

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - When asked about settings, confirm the defaults (vercel.json is configured)

4. **Set environment variable**
   ```bash
   vercel env add VITE_API_URL
   ```
   - Enter your backend URL when prompted
   - Select all environments (Production, Preview, Development)

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

## Backend Deployment Options

Choose one of these services for your backend:

### Option 1: Railway (Recommended)

**Pros**: Easy setup, built-in PostgreSQL/SQLite support, generous free tier

1. **Sign up** at [railway.app](https://railway.app)

2. **Create new project** from GitHub repo

3. **Configure service**
   - Railway will auto-detect Node.js
   - Set root directory to `backend`
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`

4. **Add environment variables**
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   PORT=3001
   FRONTEND_URL=https://your-vercel-app.vercel.app
   DATABASE_PATH=./database/uxr.db
   UPLOAD_DIR=./uploads
   ```

5. **Add volume for persistence** (important!)
   - Go to your service settings
   - Add a volume mounted to `/app/backend/database` for SQLite persistence
   - Add a volume mounted to `/app/backend/uploads` for file uploads

6. **Deploy** and copy the generated URL

### Option 2: Render

**Pros**: Simple pricing, easy to use, persistent disk support

1. **Sign up** at [render.com](https://render.com)

2. **Create a new Web Service**
   - Connect your GitHub repository
   - Choose "Web Service"

3. **Configure service**
   - **Name**: uxr-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. **Add environment variables**
   - Same as Railway (see above)

5. **Add persistent disk**
   - In Advanced settings
   - Add disk mounted to `/app/backend/database`
   - Add disk mounted to `/app/backend/uploads`

6. **Create service** and copy the URL

### Option 3: Fly.io

**Pros**: Edge deployment, good free tier, Dockerized

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**
   ```bash
   fly auth login
   ```

3. **Create Dockerfile** in `backend/` directory:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3001
   CMD ["npm", "start"]
   ```

4. **Create fly.toml** in `backend/` directory:
   ```toml
   app = "uxr-backend"
   primary_region = "sjc"

   [build]
     dockerfile = "Dockerfile"

   [env]
     PORT = "3001"

   [[services]]
     internal_port = 3001
     protocol = "tcp"

     [[services.ports]]
       handlers = ["http"]
       port = 80

     [[services.ports]]
       handlers = ["tls", "http"]
       port = 443

   [mounts]
     source = "uxr_data"
     destination = "/app/database"
   ```

5. **Deploy**
   ```bash
   cd backend
   fly launch
   fly secrets set ANTHROPIC_API_KEY=your_key_here
   fly secrets set FRONTEND_URL=https://your-vercel-app.vercel.app
   fly deploy
   ```

## Connect Frontend to Backend

After deploying your backend:

1. **Copy your backend URL** (e.g., `https://uxr-backend.up.railway.app`)

2. **Update Vercel environment variable**
   - Go to your Vercel project → Settings → Environment Variables
   - Update `VITE_API_URL` to your backend URL
   - Redeploy: Vercel → Deployments → Click "..." → Redeploy

3. **Update backend CORS**
   - Update `FRONTEND_URL` environment variable in your backend service
   - Set it to your Vercel URL (e.g., `https://your-app.vercel.app`)

## Verify Deployment

1. Visit your Vercel URL
2. Try uploading a file and generating a deliverable
3. Check backend logs to confirm API calls are working

## Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` is set correctly in Vercel
- Verify backend `FRONTEND_URL` includes your Vercel domain
- Check browser console for CORS errors

### Backend database/uploads not persisting
- Ensure you've added persistent volumes/disks
- Check volume mount paths match `DATABASE_PATH` and `UPLOAD_DIR`

### Build failures
- Check Node version compatibility (requires Node 18+)
- Verify all environment variables are set
- Check build logs for specific errors

## Custom Domain (Optional)

### Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Backend Service
- Railway: Settings → Domains
- Render: Settings → Custom Domain
- Fly.io: `fly certs create yourdomain.com`

## Cost Estimates

### Free Tier (Hobby Use)
- **Vercel**: Free for personal projects
- **Railway**: $5/month credit (should cover small apps)
- **Render**: Free tier with limitations (may spin down after inactivity)
- **Fly.io**: Free tier available

### Production (Paid)
- **Vercel**: $20/month (Pro plan)
- **Railway**: ~$10-20/month depending on usage
- **Render**: ~$7/month for basic web service + storage

## Environment Variables Summary

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend-url.com
```

### Backend (Railway/Render/Fly.io)
```env
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
FRONTEND_URL=https://your-vercel-app.vercel.app
DATABASE_PATH=./database/uxr.db
UPLOAD_DIR=./uploads
```

## Monitoring

### Vercel
- Built-in analytics and logs in dashboard
- Real-time function logs
- Performance monitoring

### Backend Services
- Railway: Built-in logs and metrics
- Render: Service logs and metrics
- Fly.io: `fly logs` command for real-time logs

---

## Quick Start Checklist

- [ ] Push code to GitHub
- [ ] Deploy frontend to Vercel
- [ ] Choose backend hosting service
- [ ] Deploy backend with environment variables
- [ ] Add persistent storage for database and uploads
- [ ] Update `VITE_API_URL` in Vercel
- [ ] Update `FRONTEND_URL` in backend
- [ ] Test the deployed application
- [ ] (Optional) Configure custom domains

---

Need help? Check the main [README.md](./README.md) for development setup.
