# Sanity CMS Setup

This directory contains the Sanity Studio configuration for loke.dev.

## Getting Started

### 1. Create a Sanity Project

If you haven't already, create a Sanity project:

```bash
pnpm sanity init --env
```

This will:

- Create a new project in Sanity
- Set up authentication
- Add the project ID to your `.env` file

Alternatively, create a project manually at [sanity.io/manage](https://sanity.io/manage) and add these to your `.env`:

```bash
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
```

### 2. Run Sanity Studio

Start the Sanity Studio locally:

```bash
pnpm sanity:dev
```

The studio will be available at http://localhost:3333

### 3. Deploy Sanity Studio (Optional)

To deploy the studio to Sanity's hosting:

```bash
pnpm sanity:deploy
```

## Schema

The current schema includes:

- **Post**: Blog posts with title, slug, description, date, tags, images, and rich text body

## Usage in Remix

Import the Sanity client in your routes:

```typescript
import { client } from '~/utils/sanity.client'

// Fetch all published posts
const posts = await client.fetch(`
  *[_type == "post" && published == true] | order(date desc) {
    _id,
    title,
    slug,
    description,
    date,
    tag,
    image
  }
`)
```

For images, use the `urlFor` helper:

```typescript
import { urlFor } from '@/utils/sanity.client'

const imageUrl = urlFor(post.image).width(800).url()
```
