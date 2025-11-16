# 🚀 Vercel Deployment Guide - Frontend (Step-by-Step)

## **Your Backend URL:**
✅ **Backend:** https://gym-backend-a1s0.onrender.com

---

## **Step 1: Create Environment Variable File**

1. **In your project root**, create a file: `.env.production`
   - This file will be used for production builds

2. **Add your backend URL:**
   ```env
   REACT_APP_API_URL=https://gym-backend-a1s0.onrender.com
   ```

**Note:** The `.env.production` file should already be in `.gitignore` (we created it earlier).

---

## **Step 2: Test Build Locally (Optional but Recommended)**

Before deploying to Vercel, test that your production build works:

```bash
# Create .env.production file
echo REACT_APP_API_URL=https://gym-backend-a1s0.onrender.com > .env.production

# Build for production
npm run build

# Test the build (if you have serve installed)
npx serve -s build
```

If the build succeeds, you're ready for Vercel!

---

## **Step 3: Push Changes to GitHub**

Make sure your latest code (with the API URL update) is pushed to GitHub:

```bash
git add .
git commit -m "Update API URL for production deployment"
git push origin main
```

---

## **Step 4: Deploy to Vercel**

### Option A: Using Vercel Dashboard (Recommended)

1. **Sign up/Login to Vercel:**
   - Go to https://vercel.com
   - Click **"Sign Up"** or **"Log In"**
   - Sign up with **GitHub** (easiest way)

2. **Create New Project:**
   - Click **"Add New..."** → **"Project"**
   - Import your GitHub repository
   - Select the repository: `YOUR_USERNAME/YOUR_REPO_NAME`

3. **Configure Project:**
   
   **Framework Preset:**
   - Vercel will auto-detect: **Create React App** ✅
   
   **Root Directory:**
   - Leave as **`./`** (project root, not `server`)
   
   **Build Settings:**
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `build` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Environment Variables:**
   - Click **"Environment Variables"**
   - Add:
     - **Key:** `REACT_APP_API_URL`
     - **Value:** `https://gym-backend-a1s0.onrender.com`
     - **Environment:** Select all (Production, Preview, Development)
   - Click **"Add"**

5. **Deploy:**
   - Click **"Deploy"**
   - Wait for deployment (2-5 minutes)
   - Vercel will build and deploy your app

6. **Get Your Frontend URL:**
   - After deployment, you'll get a URL like: `https://your-app-name.vercel.app`
   - Copy this URL - you'll need it to update CORS on backend!

---

### Option B: Using Vercel CLI (Advanced)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Set environment variable
vercel env add REACT_APP_API_URL
# When prompted, enter: https://gym-backend-a1s0.onrender.com
# Select: Production, Preview, Development

# Deploy to production
vercel --prod
```

---

## **Step 5: Update Backend CORS (IMPORTANT!)**

After you get your Vercel frontend URL, update the backend CORS:

1. **Go to Render Dashboard:**
   - Open your backend service
   - Go to **"Environment"** tab

2. **Add/Update Environment Variable:**
   - **Key:** `FRONTEND_URL`
   - **Value:** `https://your-app-name.vercel.app` (your Vercel URL)

3. **OR Update CORS Manually:**
   - In `server/index.js`, update the `allowedOrigins` array
   - Add your Vercel URL to the list
   - Push changes to GitHub
   - Render will auto-deploy the update

---

## **Step 6: Verify Deployment**

1. **Visit your Vercel URL:**
   - Example: `https://your-app-name.vercel.app`
   - Your app should load!

2. **Test API Connection:**
   - Go to Meal Planner page
   - Try adding a meal
   - Check browser console for any CORS errors

3. **Check Network Tab:**
   - Open browser DevTools → Network tab
   - Look for requests to `https://gym-backend-a1s0.onrender.com`
   - Should return 200 OK status

---

## **Troubleshooting**

### ❌ Build Failed on Vercel
- **Check:** Environment variables are set correctly
- **Check:** `package.json` has correct build script
- **Check:** All dependencies are in `package.json`, not just `package-lock.json`

### ❌ CORS Errors in Browser
- **Check:** Frontend URL is added to backend CORS `allowedOrigins`
- **Check:** Backend is running and accessible
- **Check:** Environment variable `REACT_APP_API_URL` is set in Vercel

### ❌ API Requests Failing
- **Check:** Backend URL is correct in environment variable
- **Check:** Backend service is live on Render
- **Check:** Network tab for error messages

### ❌ 404 on Routes (React Router)
- **Add:** `vercel.json` file (see below) to handle SPA routing

---

## **Step 7: Fix React Router (SPA Routing)**

Create `vercel.json` in project root:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures React Router routes work correctly on Vercel.

---

## **Summary - What You Need to Do:**

### ✅ **Your Tasks:**

1. **Create `.env.production` file:**
   ```env
   REACT_APP_API_URL=https://gym-backend-a1s0.onrender.com
   ```

2. **Push code to GitHub** (if not already done)

3. **Deploy on Vercel:**
   - Connect GitHub repo
   - Set environment variable: `REACT_APP_API_URL`
   - Deploy!

4. **After getting Vercel URL:**
   - Share it with me
   - I'll help update backend CORS

5. **Create `vercel.json`** (optional, for React Router)

---

## **Quick Checklist:**

- [ ] Created `.env.production` with backend URL
- [ ] Pushed code to GitHub
- [ ] Deployed on Vercel
- [ ] Set `REACT_APP_API_URL` environment variable in Vercel
- [ ] Got Vercel frontend URL
- [ ] Tested app on Vercel URL
- [ ] Updated backend CORS (after getting frontend URL)

---

**After you deploy and get your Vercel URL, share it with me and I'll help you update the backend CORS settings!** 🚀

