# Sanity CMS - Quick Start

## ✅ Setup Complete

Sanity CMS is fully configured and ready to use!

## 🚀 Daily Usage

### Start Development

```bash
# Terminal 1: Remix dev server
pnpm dev

# Terminal 2: Sanity Studio
pnpm sanity:dev
```

- **Remix**: http://localhost:3000
- **Sanity Studio**: http://localhost:3333

### Create Content

1. Open http://localhost:3333
2. Click **"Post"** to create a blog post
3. Fill in all fields
4. Set **Published** to `true`
5. Click **Publish**

### Use in Remix Routes

```typescript
import { getAllPublishedPosts } from '@/utils/sanity.queries'
import { PortableText } from '@/components/PortableText'

// In loader
const posts = await getAllPublishedPosts()

// In component
<PortableText value={post.body} />
```

## 📦 Production Deployment

### Before Deploying

1. **Set Fly.io secrets:**

   ```bash
   fly secrets set VITE_SANITY_PROJECT_ID=l25uat4p
   fly secrets set VITE_SANITY_DATASET=production
   ```

2. **Configure CORS at [sanity.io/manage](https://sanity.io/manage):**
   - Add `https://loke.dev`
   - Add `http://localhost:3000`

3. **Deploy Studio (optional):**
   ```bash
   pnpm sanity:deploy
   ```
   Access at: https://loke-dev.sanity.studio

### Deploy

```bash
pnpm run build
pnpm run deploy
```

## 📚 Documentation

- **Vercel Deployment**: `VERCEL_DEPLOYMENT.md` - Deploy to Vercel guide ⭐
- **Setup Guide**: `SANITY_SETUP.md` - Complete setup documentation
- **Sanity Docs**: `sanity/README.md` - Schema and usage details

## 🔑 Project Info

- **Project ID**: `l25uat4p`
- **Dataset**: `production`
- **Dashboard**: https://sanity.io/manage/personal/project/l25uat4p

## ⚡ Quick Commands

```bash
pnpm sanity:dev       # Start Sanity Studio locally
pnpm sanity:build     # Build the studio
pnpm sanity:deploy    # Deploy studio to Sanity hosting
pnpm typecheck        # Verify TypeScript
```

## 🎯 What's Included

- ✅ Sanity Studio configured
- ✅ Blog post schema with rich text
- ✅ Code blocks with syntax highlighting
- ✅ Image optimization helpers
- ✅ Pre-built query functions
- ✅ PortableText renderer component
- ✅ TypeScript support
- ✅ React 19 upgraded

## 🔧 Files Created

```
sanity/
├── schemas/
│   ├── post.ts       # Blog post schema
│   └── code.ts       # Code block schema
└── README.md

app/
├── utils/
│   ├── sanity.client.ts    # Sanity client
│   └── sanity.queries.ts   # Query helpers
└── components/
    └── PortableText.tsx    # Content renderer

sanity.config.ts      # Studio config
sanity.cli.ts         # CLI config
```

## 💡 Next Steps

1. Create your first blog post in the studio
2. Update existing routes to fetch from Sanity
3. Optionally migrate MDX posts to Sanity
4. Deploy to production
5. Deploy studio with `pnpm sanity:deploy`

Happy content editing! 🎉
