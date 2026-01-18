# Sanity CMS - Vercel Deployment Guide

## Studio Hosted on Your Domain

Your Sanity Studio is now integrated into your Remix app and will be accessible at:

**https://loke.dev/studio**

This means you don't need separate hosting - the studio deploys with your app!

## 🚀 Deployment Steps

### 1. Set Vercel Environment Variables

In your Vercel dashboard or via CLI:

```bash
vercel env add VITE_SANITY_PROJECT_ID
# Enter: l25uat4p

vercel env add VITE_SANITY_DATASET
# Enter: production
```

Or in the Vercel dashboard:

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add:
   - `VITE_SANITY_PROJECT_ID` = `l25uat4p`
   - `VITE_SANITY_DATASET` = `production`
4. Make sure to add them for **Production**, **Preview**, and **Development**

### 2. Configure CORS Origins

The studio needs to communicate with Sanity's API:

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select project: **loke-dev** (`l25uat4p`)
3. Go to **Settings** → **API** → **CORS Origins**
4. Add these origins:
   - `https://loke.dev` (your production domain)
   - `https://*.vercel.app` (for preview deployments)
   - `http://localhost:3000` (for local development)
5. Check **Allow credentials** for each

### 3. Deploy to Vercel

```bash
# If using Vercel CLI
vercel --prod

# Or push to your Git branch
git add .
git commit -m "Add Sanity CMS"
git push origin main
```

Vercel will automatically deploy your app.

## ✅ Post-Deployment

### Access Your Studio

Visit: **https://loke.dev/studio**

You'll be prompted to log in with your Sanity account. Once logged in, you can create and edit content directly from your domain!

### Test Content Creation

1. Visit https://loke.dev/studio
2. Click **"Post"** to create a new blog post
3. Fill in all fields
4. Set **Published** to `true`
5. Click **Publish**
6. Visit your blog page to see the new post

## 🔒 Security

### Studio Access Control

By default, anyone with a Sanity account on your project can access the studio. To control access:

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select **loke-dev**
3. Go to **Settings** → **Members**
4. Add/remove team members
5. Set appropriate roles (Administrator, Editor, Viewer, etc.)

### Optional: Protect Studio Route

If you want to add additional protection (like checking authentication in your app), you can modify `app/routes/studio.$.tsx`:

```typescript
import { redirect, type LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request }: LoaderFunctionArgs) {
  // Add your auth check here
  // if (!isAuthenticated(request)) {
  //   throw redirect('/login')
  // }
  return null
}

// Rest of component...
```

## 🎯 Benefits of This Setup

✅ **Single deployment** - Studio deploys with your app  
✅ **Same domain** - No CORS issues  
✅ **No separate hosting** - One less thing to manage  
✅ **Same SSL certificate** - Secure by default  
✅ **Preview deployments** - Studio works in Vercel previews too

## 🔄 Development Workflow

### Local Development

You can still use the standalone studio locally for a better dev experience:

```bash
# Terminal 1: Your app
pnpm dev

# Terminal 2: Standalone studio (optional)
pnpm sanity:dev
```

- App: http://localhost:3000
- Standalone Studio: http://localhost:3333
- Embedded Studio: http://localhost:3000/studio

Use whichever you prefer! They all work with the same Sanity project.

### Production

On production, you'll only have:

- **https://loke.dev** - Your main site
- **https://loke.dev/studio** - Your CMS

## 🐛 Troubleshooting

### Studio shows "Configuration must contain projectId"

- Check that `VITE_SANITY_PROJECT_ID` is set in Vercel
- Redeploy after adding environment variables
- The `VITE_` prefix is required for Vite to expose vars to the browser

### CORS errors in studio

- Make sure `https://loke.dev` is added to CORS origins in Sanity
- Enable "Allow credentials" for the origin
- Clear browser cache and try again

### Studio shows 404

- Make sure `app/routes/studio.$.tsx` exists
- Rebuild and redeploy
- Check Vercel build logs for errors

## 📊 Monitoring

Monitor your studio usage at:

- **Project Dashboard**: https://sanity.io/manage/personal/project/l25uat4p
- **API Usage**: Check requests, bandwidth, and errors
- **Activity**: See recent edits and changes

## 🎉 You're All Set!

Your Sanity Studio is now:

- ✅ Deployed at https://loke.dev/studio
- ✅ Using Vercel's infrastructure
- ✅ Ready for content creation
- ✅ Accessible from anywhere

Happy content editing! 🚀
