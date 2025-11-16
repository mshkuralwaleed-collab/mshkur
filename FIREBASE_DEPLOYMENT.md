# Firebase Deployment Guide for Mshkur

## Overview

This guide provides step-by-step instructions for deploying the Mshkur project to Firebase Hosting. The project is configured to deploy to the `gemini-smart-card` Firebase project and be accessible at `mshkur.com`.

## Prerequisites

Before you begin, ensure you have:

1. **Node.js and npm** installed (v16 or higher)
   ```bash
   node --version  # Should be v16+
   npm --version   # Should be v7+
   ```

2. **Firebase CLI** installed globally
   ```bash
   npm install -g firebase-tools
   ```

3. **Firebase Account** with access to the `gemini-smart-card` project

4. **Repository cloned locally**
   ```bash
   git clone https://github.com/mshkuralwaleed-collab/mshkur.git
   cd mshkur
   ```

## Deployment Steps

### Step 1: Prepare the Local Environment

```bash
# Navigate to project directory
cd mshkur

# Install dependencies
npm install
```

### Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=<your_api_key>
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gemini-smart-card.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=gemini-smart-card
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gemini-smart-card.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your_sender_id>
   NEXT_PUBLIC_FIREBASE_APP_ID=<your_app_id>
   ```

### Step 3: Build the Project

```bash
# Run the Next.js build
npm run build

# This creates an 'out' directory with static files
# Verify the build output exists
ls -la out/
```

### Step 4: Authenticate with Firebase

```bash
# Login to Firebase
firebase login

# You'll be prompted to visit a URL and authorize the CLI
# After authorization, you're ready to deploy
```

### Step 5: Deploy to Firebase Hosting

```bash
# Deploy to the gemini-smart-card project
firebase deploy --project gemini-smart-card

# The CLI will:
# 1. Validate firebase.json configuration
# 2. Upload the 'out' directory contents
# 3. Apply security headers and routing rules
# 4. Provision the hosting environment
```

### Step 6: Verify the Deployment

1. **Check deployment status:**
   ```bash
   firebase hosting:channel:list --project gemini-smart-card
   ```

2. **Visit the live site:**
   - Open https://mshkur.com in your browser
   - Should load the Mshkur application (not Firebase "Site Not Found")

3. **Verify no console errors:**
   - Open browser DevTools (F12)
   - Check Console tab for any errors
   - Check Network tab to ensure all assets load

## Post-Deployment Testing

After successful deployment, test the following features:

### 1. **Authentication**
- [ ] Login page displays correctly
- [ ] Create account functionality works
- [ ] Email verification works
- [ ] Password reset works

### 2. **Dashboard**
- [ ] Dashboard loads after authentication
- [ ] Requires valid authentication token
- [ ] User data displays correctly

### 3. **AI Chat Feature**
- [ ] Chat interface loads
- [ ] Can send messages
- [ ] AI responds with valid responses
- [ ] Chat history persists

### 4. **Digital Cards**
- [ ] Card creation works
- [ ] Cards display correctly
- [ ] QR codes generate properly
- [ ] Card sharing works

### 5. **Responsive Design**
- [ ] Test on desktop (1920px width)
- [ ] Test on tablet (768px width)
- [ ] Test on mobile (375px width)
- [ ] All features accessible on mobile

### 6. **Performance**
- [ ] Page loads in < 3 seconds
- [ ] Lighthouse score > 80
- [ ] No 404 errors for resources

## Troubleshooting

### Issue: "firebase: command not found"
**Solution:** Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

### Issue: "Authentication required"
**Solution:** Login to Firebase:
```bash
firebase login
```

### Issue: "Project not found: gemini-smart-card"
**Solution:** Ensure you have access to the project:
```bash
firebase projects:list
firebase use gemini-smart-card
```

### Issue: "out directory not found"
**Solution:** Run the build command first:
```bash
npm run build
```

### Issue: "mshkur.com still shows Site Not Found"
**Solution:** 
1. Verify deployment completed successfully
2. Clear browser cache (Ctrl+Shift+Delete)
3. Wait 2-3 minutes for DNS propagation
4. Check Firebase Console for deployment status

### Issue: "CORS errors or 404s in console"
**Solution:**
1. Verify firebase.json rewrite rules are correct
2. Check that all assets are in the 'out' directory
3. Run `npm run build` to rebuild

## Monitoring and Maintenance

### View Deployment History
```bash
firebase hosting:channel:list --project gemini-smart-card
firebase hosting:releases:list --project gemini-smart-card
```

### Rollback to Previous Deployment
```bash
# View release history
firebase hosting:releases:list --project gemini-smart-card

# Rollback to a specific release (by date/time)
firebase hosting:releases:rollback <release_id> --project gemini-smart-card
```

### Monitor Performance
1. Open Firebase Console: https://console.firebase.google.com/project/gemini-smart-card
2. Navigate to Hosting > Analytics
3. Monitor traffic, errors, and performance metrics

## Continuous Deployment (GitHub Actions)

For automated deployments on push to main:

1. Create `.github/workflows/firebase-deploy.yml`
2. Configure with Firebase token
3. Deployments run automatically on push

## Environment-Specific Deployments

### Staging Deployment
```bash
firebase hosting:channel:deploy staging --project gemini-smart-card
```

### Production Deployment
```bash
firebase deploy --project gemini-smart-card
```

## Important Notes

- **Build output:** The `out` directory is generated by `npm run build` and should NOT be committed to Git
- **Environment variables:** Keep `.env.local` in `.gitignore` to protect sensitive data
- **Firebase.json:** This file controls how Firebase deploys and serves your app
- **Domain:** mshkur.com DNS is already configured to point to Firebase Hosting

## Contact & Support

For deployment issues or questions:
- Check Firebase Console: https://console.firebase.google.com/project/gemini-smart-card
- Review Firebase Hosting docs: https://firebase.google.com/docs/hosting
- Check browser console for specific errors
