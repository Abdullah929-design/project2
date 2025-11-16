# 🚀 Render Deployment Guide - Backend (Step-by-Step)

## **Prerequisites**
- ✅ GitHub account
- ✅ Render account (sign up at https://render.com - it's free!)
- ✅ Your code pushed to a GitHub repository
- ✅ PostgreSQL database ready (we'll create one on Render or use external)

---

## **Step 1: Push Your Code to GitHub**

### If you don't have a GitHub repo yet:

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it: `gym-app` (or any name you want)
   - Make it **Public** (free tier on Render needs public repos)
   - Click **Create repository**

2. **Push your code:**
   ```bash
   # In your project root directory (D:\gym)
   git init
   git add .
   git commit -m "Initial commit - Gym app with backend and frontend"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

---

## **Step 2: Create PostgreSQL Database on Render**

### Option A: Create Database on Render (Recommended)

1. **Go to Render Dashboard:**
   - Visit https://dashboard.render.com
   - Sign up/Login with GitHub

2. **Create PostgreSQL Database:**
   - Click **"New +"** button
   - Select **"PostgreSQL"**
   - Fill in the form:
     - **Name:** `gym-db` (or any name)
     - **Database:** `mealsdb` (or leave default)
     - **User:** Leave default
     - **Region:** Choose closest to you
     - **PostgreSQL Version:** Latest
     - **Plan:** Free (or paid if needed)
   - Click **"Create Database"**

3. **Save Database Credentials:**
   - Wait for database to be created (1-2 minutes)
   - Copy these details (you'll need them later):
     - **Internal Database URL** (for Render services)
     - **External Database URL** (for local development)
     - **Host, Database, User, Password, Port**

### Option B: Use External PostgreSQL

If you prefer to use your existing PostgreSQL or another provider, you'll need:
- Database connection string
- Host, Port, Database name, Username, Password

---

## **Step 3: Set Up Database Tables on Render**

After creating the database, you need to create tables. You have 2 options:

### Option A: Using Render's Built-in Console (Easiest)

1. In Render dashboard, click on your database
2. Click **"Connect"** tab
3. Use the **"psql"** connection string OR use **"Connect with Render Shell"**
4. Copy and paste your `setup_database.sql` file content
5. Execute the SQL to create tables

### Option B: Using Local pgAdmin/psql

1. Use the **External Database URL** from Render
2. Connect with pgAdmin or psql locally
3. Run `setup_database.sql` script

---

## **Step 4: Deploy Backend Service on Render**

1. **Create New Web Service:**
   - In Render dashboard, click **"New +"**
   - Select **"Web Service"**

2. **Connect Repository:**
   - Click **"Connect GitHub"** (or GitLab/Bitbucket)
   - Authorize Render to access your repositories
   - Select your repository: `YOUR_USERNAME/gym-app`

3. **Configure Service:**
   
   **Basic Settings:**
   - **Name:** `gym-backend` (or any name)
   - **Region:** Same region as your database
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `server` (IMPORTANT!)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid if needed)

   **Environment Variables:**
   - Click **"Advanced"** → **"Add Environment Variable"**
   - Add these variables (from your `.env` file):
   
     ```
     DB_USER=your_database_user
     DB_HOST=your_database_host
     DB_PASSWORD=your_database_password
     DB_NAME=mealsdb
     DB_PORT=5432
     PORT=10000
     NODE_ENV=production
     ```

   **OR Use Database Internal URL:**
   - If you created database on Render, use the **Internal Database URL**
   - Click **"Add Environment Variable"**
   - Key: `DATABASE_URL`
   - Value: (paste the Internal Database URL from Step 2)
   - Render will automatically parse this for you!

4. **Click "Create Web Service"**

5. **Wait for Deployment:**
   - Render will install dependencies and start your service
   - Watch the logs for any errors
   - Deployment takes 2-5 minutes

---

## **Step 5: Update Database Connection (If Using DATABASE_URL)**

If Render provided a `DATABASE_URL`, you need to update `server/db.js` to use it:

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // For Render
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  ...(process.env.DATABASE_URL ? {} : { // Fallback to individual vars
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  }),
});

module.exports = pool;
```

**NOTE:** We'll update this file for you!

---

## **Step 6: Verify Deployment**

1. **Check Service Status:**
   - Your service should show **"Live"** status
   - Click on the service to see logs

2. **Test Endpoints:**
   - Click on the service URL (e.g., `https://gym-backend.onrender.com`)
   - You should see: `Fitness Tracker API 🚀`
   - Test: `https://YOUR_BACKEND_URL.onrender.com/foods`
   - Should return JSON array of food items

3. **Check Logs:**
   - In Render dashboard, click **"Logs"** tab
   - Look for any errors or connection issues

---

## **Step 7: Get Your Backend URL**

After successful deployment:
- Your backend URL will be: `https://YOUR_SERVICE_NAME.onrender.com`
- Copy this URL - you'll need it for Vercel frontend deployment!

---

## **Troubleshooting**

### ❌ Build Failed
- **Check:** Root Directory is set to `server`
- **Check:** `package.json` has `start` script
- **Check:** Logs for specific error messages

### ❌ Database Connection Failed
- **Check:** Environment variables are correct
- **Check:** Database is running and accessible
- **Check:** Using Internal Database URL (not External) for Render services
- **Check:** SSL is enabled in connection (production)

### ❌ Service Won't Start
- **Check:** PORT environment variable (Render uses PORT from env, not hardcoded)
- **Check:** Logs for error messages
- **Check:** `npm start` works locally

### ❌ 502 Bad Gateway
- **Wait:** Service might still be starting (check logs)
- **Check:** Service is actually running
- **Check:** Database connection is working

---

## **Important Notes:**

1. **Free Tier Limits:**
   - Services spin down after 15 minutes of inactivity
   - First request after spin-down takes 30-60 seconds (cold start)
   - Consider upgrading to paid for always-on

2. **Database:**
   - Free PostgreSQL on Render is deleted after 90 days of inactivity
   - Keep your database active or use external database

3. **Environment Variables:**
   - Never commit `.env` file to GitHub
   - Always set environment variables in Render dashboard

4. **CORS:**
   - Backend is configured with `cors()` which allows all origins
   - For production, you might want to restrict this to your Vercel frontend URL

---

## **Next Steps:**

✅ Backend deployed on Render  
✅ Backend URL: `https://YOUR_BACKEND_URL.onrender.com`  
⏭️ Next: Deploy frontend on Vercel (waiting for your backend URL)

---

**Need help?** Share your Render service logs or errors, and I'll help you troubleshoot!

