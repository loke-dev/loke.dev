# Sanity CMS Setup Guide

This project is now configured with Sanity CMS! Here's what has been set up and how to get started.

## What's Been Installed

### Dependencies

- `sanity` - Sanity Studio and core functionality
- `@sanity/client` - JavaScript client for fetching data
- `@sanity/image-url` - Image URL builder for optimized images
- `@sanity/vision` - Query testing tool in the studio
- `@portabletext/react` - React renderer for Sanity's rich text

### Files Created

```
sanity/
├── sanity.config.ts          # Studio configuration
├── schemas/
│   ├── index.ts              # Schema exports
│   └── post.ts               # Blog post schema
├── tsconfig.json             # TypeScript config
└── README.md                 # Detailed documentation

app/
├── utils/
│   ├── sanity.client.ts      # Sanity client setup
│   └── sanity.queries.ts     # Pre-built query functions
└── components/
    └── PortableText.tsx      # Component for rendering Sanity content

sanity.cli.ts                 # Sanity CLI configuration
```

## Getting Started

### Step 1: Initialize Sanity Project

You need to create a Sanity project and get your credentials. Run:

```bash
cd sanity
pnpm sanity init --env
```

This will:

1. Prompt you to log in to Sanity (or create an account)
2. Create a new project
3. Set up a dataset
4. Add the credentials to your `.env` file

Alternatively, create a project manually at [sanity.io/manage](https://sanity.io/manage) and add to `.env`:

```bash
SANITY_PROJECT_ID=your_project_id_here
SANITY_DATASET=production
```

### Step 2: Start Sanity Studio

From the project root, run:

```bash
pnpm sanity:dev
```

The studio will open at **http://localhost:3333**

Your Remix dev server can still run on port 3000 as usual.

### Step 3: Create Content

1. Open http://localhost:3333
2. Click "Post" to create a new blog post
3. Fill in the fields (title, slug, description, date, etc.)
4. Add rich text content in the body field
5. Set `published` to true when ready
6. Click "Publish"

## Using Sanity in Your Remix Routes

### Example: Fetching Posts

In any route loader:

```typescript
import { json } from '@remix-run/node'
import { getAllPublishedPosts } from '~/utils/sanity.queries'

export async function loader() {
  const posts = await getAllPublishedPosts()
  return json({ posts })
}
```

### Example: Rendering a Post

```typescript
import { PortableText } from '@/components/PortableText'
import { urlFor } from '@/utils/sanity.client'

export default function Post() {
  const { post } = useLoaderData<typeof loader>()

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.description}</p>

      {post.image && (
        <img
          src={urlFor(post.image).width(1200).url()}
          alt={post.imageAlt || post.title}
        />
      )}

      <PortableText value={post.body} />
    </article>
  )
}
```

## Available Scripts

- `pnpm sanity:dev` - Start Sanity Studio locally
- `pnpm sanity:build` - Build the studio for deployment
- `pnpm sanity:deploy` - Deploy studio to Sanity's hosting

## Schema

The **Post** schema includes:

- `title` - Post title (string, required)
- `slug` - URL-friendly slug (slug, required)
- `description` - Post description (text, required)
- `date` - Publication date (date, required)
- `lastModified` - Last modified date (date, optional)
- `tag` - Post tag/category (string, required)
- `published` - Published status (boolean, required)
- `image` - Featured image (image, optional)
- `imageAlt` - Image alt text (string, optional)
- `body` - Rich text content (portable text, required)

## Next Steps

1. **Deploy Studio** - Run `pnpm sanity:deploy` to host your studio at `your-project.sanity.studio`
2. **Add More Schemas** - Create new content types in `sanity/schemas/`
3. **Migrate Existing Content** - You can migrate your MDX posts to Sanity or keep both systems
4. **Set Up CORS** - In [Sanity manage](https://sanity.io/manage), add your domain to allowed origins
5. **Add Authentication** - Configure who can access your studio in Sanity's project settings

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Portable Text Guide](https://www.sanity.io/docs/presenting-block-text)
- [Schema Types Reference](https://www.sanity.io/docs/schema-types)

## Troubleshooting

### Studio won't start

- Make sure `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` are set in `.env`
- Try running `pnpm sanity init --env` again
- Restart the dev server after adding env variables

### Can't fetch data in Remix

- Check that your env variables are properly loaded
- Verify the project ID and dataset name are correct
- Make sure content is published in the studio

### TypeScript errors

- Run `pnpm typecheck` to see specific errors
- The studio uses React 18 (you may see peer dependency warnings - these are safe to ignore)
