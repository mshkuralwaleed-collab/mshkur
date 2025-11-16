# Mshkur - Hostinger Deployment Guide

**Complete step-by-step guide to deploy Mshkur on Hostinger**

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Node.js 18+ installed
- ✅ npm or yarn installed
- ✅ Hostinger account with cPanel access
- ✅ mshkur.com domain pointing to Hostinger
- ✅ Firebase project credentials
- ✅ Genkit AI API key

## 🔧 Step 1: Prepare Your Local Environment

### 1.1 Clone the repository
```bash
git clone https://github.com/mshkuralwaleed-collab/mshkur.git
cd mshkur
```

### 1.2 Install dependencies
```bash
npm install
```

### 1.3 Create and configure .env.local
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gemini-smart-card.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gemini-smart-card
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gemini-smart-card.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Genkit AI
GOOGLE_GENAI_API_KEY=your_genai_key

# App
NEXT_PUBLIC_APP_URL=https://mshkur.com
```

### 1.4 Test locally
```bash
npm run dev
# Visit http://localhost:3000
```

## 🏗️ Step 2: Build for Production

### 2.1 Build the project
```bash
npm run build
```

**Output:** A new `out/` folder will be created with all static files ready for deployment.

### 2.2 Verify build
```bash
ls -la out/
# Should contain: index.html, _next/, api/ etc.
```

### 2.3 Test production build locally (optional)
```bash
npm run start
# Visit http://localhost:3000
```

## 📤 Step 3: Connect to Hostinger

### Option A: Via cPanel File Manager (Easiest)

1. **Login to Hostinger cPanel**
   - Visit: https://your-hostinger-cpanel-url
   - Login with credentials

2. **Navigate to File Manager**
   - Click on "File Manager"
   - Click "public_html" folder

3. **Upload files from `out/` folder**
   - Select all files from local `out/` folder
   - Drag & drop to public_html
   - OR: Right-click → Upload

4. **Upload .htaccess**
   - Upload `public/.htaccess` to `public_html/` root
   - This file enables proper routing for SPA

### Option B: Via FTP/SFTP (Recommended for large files)

1. **Get FTP credentials**
   - Go to Hostinger → Hosting → FTP Accounts
   - Create new FTP account (or use existing)
   - Note: hostname, username, password

2. **Use FTP client** (FileZilla, Cyberduck, etc.)
   ```
   Host: your_ftp_hostname
   Username: your_ftp_user
   Password: your_ftp_password
   Port: 21
   ```

3. **Navigate to public_html**
   - Connect via FTP
   - Navigate to public_html folder

4. **Upload files**
   ```
   Local (left):  /path/to/mshkur/out/*
   Remote (right): /public_html/
   ```
   - Select all files from `out/`
   - Drag to remote folder
   - Upload .htaccess from `public/`

### Option C: Via SSH (Advanced)

```bash
# Connect via SSH
ssh your_ftp_user@your_ftp_hostname

# Navigate to public_html
cd public_html

# Delete old files (if any)
rm -rf *

# Upload new files (from your local machine)
scp -r /path/to/mshkur/out/* your_ftp_user@your_ftp_hostname:~/public_html/
scp /path/to/mshkur/public/.htaccess your_ftp_user@your_ftp_hostname:~/public_html/
```

## ⚙️ Step 4: Configure Hostinger Settings

### 4.1 Verify SSL/HTTPS
- Go to Hostinger → SSL
- HTTPS should be enabled automatically
- Click "Manage" → "Force HTTPS" (enable)

### 4.2 Check DNS settings
- Go to Hostinger → DNS Zone Editor
- Verify mshkur.com points to your Hostinger servers
- Wait for DNS propagation (up to 24 hours)

### 4.3 Configure PHP version (if needed)
- Go to Hostinger → PHP Configuration
- Select PHP 8.1 or higher

### 4.4 Set up .htaccess rules

The `.htaccess` file should contain:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Force HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  
  # SPA routing
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 🧪 Step 5: Test Your Deployment

### 5.1 Basic tests
```bash
# Visit your site
https://mshkur.com/

# Expected results:
✅ Page loads
✅ No 404 errors
✅ HTTPS enabled
✅ CSS/JS loaded correctly
```

### 5.2 Functionality tests
```bash
# Test each feature:
✅ Homepage displays
✅ Login page accessible
✅ Dashboard loads (after auth)
✅ AI Chat interface works
✅ Cards functionality works
✅ Profile/Settings accessible
✅ Logout works
```

### 5.3 Console checks
- Open DevTools (F12)
- Check Console tab
- Fix any error messages

### 5.4 Performance check
- Use Lighthouse (DevTools → Lighthouse)
- Target score: 80+
- Fix any warnings

## 🐛 Troubleshooting

### Issue: 404 errors on page reload
**Solution:**
- Verify .htaccess is uploaded to public_html
- Check mod_rewrite is enabled
- Clear browser cache

### Issue: Blank page
**Solution:**
- Check all files from `out/` are uploaded
- Verify index.html exists in public_html
- Check browser console for errors

### Issue: API calls failing
**Solution:**
- Verify Firebase credentials in .env
- Check CORS settings
- Verify Firestore is accessible

### Issue: Images not loading
**Solution:**
- Check image paths are correct
- Verify image files exist in `out/_next/`
- Clear cache and reload

### Issue: Authentication not working
**Solution:**
- Verify Firebase credentials
- Check Firestore is accessible
- Verify Auth domain in Firebase settings
- Check .htaccess doesn't block auth routes

## 📊 Post-Deployment Checklist

- [ ] Site loads at https://mshkur.com
- [ ] HTTPS enforced (green lock icon)
- [ ] No 404 errors
- [ ] All pages accessible
- [ ] Login/signup works
- [ ] Dashboard protected (redirects if not logged in)
- [ ] AI Chat functions correctly
- [ ] Cards display properly
- [ ] Images load quickly
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All forms work
- [ ] Database queries successful

## 🔄 Updating Deployment

### When making code changes:

1. **Make changes locally**
```bash
git commit -am "Your changes"
git push origin main
```

2. **Build new version**
```bash
npm run build
```

3. **Upload new `out/` files**
- Delete old files in public_html
- Upload new files from `out/`
- Keep .htaccess unchanged

4. **Test changes**
- Visit https://mshkur.com
- Verify changes
- Clear browser cache if needed

## 📞 Support Resources

- **Hostinger Help:** https://support.hostinger.com
- **Next.js Export:** https://nextjs.org/docs/advanced-features/static-html-export
- **GitHub Issues:** https://github.com/mshkuralwaleed-collab/mshkur/issues
- **Documentation:** https://github.com/mshkuralwaleed-collab/mshkur/tree/main/docs

## 🎯 Quick Reference

| Task | Command |
|------|----------|
| Clone | `git clone https://github.com/mshkuralwaleed-collab/mshkur.git` |
| Install | `npm install` |
| Dev | `npm run dev` |
| Build | `npm run build` |
| Test | `npm run start` |
| Deploy | Upload `out/` to `public_html/` |

---

**Last Updated:** November 16, 2025  
**Version:** 1.0.0  
**Status:** Production Ready
