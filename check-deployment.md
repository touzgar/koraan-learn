# Quick Deployment Check Guide

## For Beginners (Windows CMD)

### Step 1: Check if your code is pushed to GitHub
```cmd
cd C:\Users\user\Desktop\cd\koraan-learn
git status
git log --oneline -1
```

**Expected output:**
```
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

### Step 2: Go to Vercel Dashboard
1. Open your browser
2. Go to: https://vercel.com/dashboard
3. Find your project (koraan-learn)
4. Click on it

### Step 3: Check Latest Deployment
Look at the top deployment:
- ✅ **Green checkmark** = Deployment successful
- ⏳ **Building...** = Wait for it to finish
- ❌ **Red X** = Build failed (see logs)

### Step 4: If Build Failed - View Logs
1. Click on the failed deployment
2. Click **"View Build Logs"**
3. Look for error messages like:
   - "Failed to collect page data for /..."
   - "Error: ..."
   - "Type error: ..."

### Step 5: Common Fixes

#### If you see "Failed to collect page data"
The page needs dynamic rendering. Tell me which page failed.

#### If you see "DATABASE_URL is not defined"
1. Go to Vercel project settings
2. Click **Environment Variables**
3. Add `DATABASE_URL` with your Neon connection string
4. Click **Save**
5. Click **Redeploy**

#### If you see "PrismaClient initialization error"
Run this command locally:
```cmd
cd C:\Users\user\Desktop\cd\koraan-learn
npx prisma db push
```

### Step 6: Test Your Deployed Site
1. In Vercel dashboard, click **"Visit"** button
2. Try to:
   - Load the homepage
   - Sign in
   - Access admin dashboard
   - Create a course (if instructor)

## Quick Commands Reference

### Kill Node processes (if build fails locally)
```cmd
taskkill /F /IM node.exe
```

### Delete .next folder (if file locked)
```cmd
rmdir /s /q .next
```

### Run local build
```cmd
bun run build
```

### Run local dev server
```cmd
bun run dev
```

### Push changes to GitHub
```cmd
git add .
git commit -m "Your message here"
git push
```

## What to Tell Me If Deployment Fails

Copy and paste:
1. The error message from Vercel build logs
2. Which page/route is failing
3. Screenshot of the error (if possible)

## Current Status

✅ **Local build:** Working perfectly
✅ **All fixes applied:** Yes
✅ **Code pushed to GitHub:** Yes
✅ **Ready for deployment:** Yes

**Next action:** Check your Vercel dashboard and tell me what you see!
