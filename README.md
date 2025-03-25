# Loke.dev

A modern, minimalist, and highly performant Next.js 15 template for personal websites, blogs, and portfolios. This template uses the latest features from Next.js, React 19, and Tailwind CSS 4.

![Next.js Personal Website Template](https://placehold.co/600x400?text=Next.js+Personal+Website+Template)

## ✨ Features

- 🚀 **Next.js 15** with App Router
- ⚡ **React 19** with Server Components
- 🎨 **Tailwind CSS 4** for styling
- 🧩 **shadcn/ui components** via Radix UI
- 🌙 **Dark/Light mode** with next-themes
- 📝 **MDX support** for blog posts
- 🔍 **SEO optimized** with metadata
- 📊 **Typed** with TypeScript
- 🧹 **Linting** with ESLint
- 💅 **Code formatting** with Prettier
- 🦮 **Accessibility** focused design
- 🏎️ **Performance optimized**
- 📱 **Responsive** on all devices
- 🎞️ **View Transitions API** support
- 🔒 **Code quality** with Husky & lint-staged

## 🧰 Tech Stack

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Radix UI](https://radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [MDX](https://mdxjs.com/) for blog posts
- [Shiki](https://shiki.style/) for code highlighting
- [Geist Font](https://vercel.com/font) for typography

## 📋 Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher)

## 🚀 Getting Started

### Installation

1. Clone this repository

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git my-website
   cd my-website
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Start the development server

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
/
├── public/           # Static assets
├── src/
│   ├── app/          # App router pages
│   ├── components/   # React components
│   │   ├── mdx/      # MDX-specific components
│   │   └── ui/       # UI components (shadcn)
│   ├── lib/          # Utility functions
│   ├── posts/        # MDX blog posts
│   ├── styles/       # Global styles
│   └── types/        # TypeScript types
├── .eslintrc.js      # ESLint configuration
├── .prettierrc       # Prettier configuration
├── next.config.ts    # Next.js configuration
├── tailwind.config.ts # Tailwind CSS configuration
└── tsconfig.json     # TypeScript configuration
```

## 📝 Usage

### Creating Blog Posts

Add new MDX files to the `src/posts` directory:

```mdx
---
title: My New Post
date: 2024-03-25
description: A description of my new post
---

# My New Post

This is the content of my post written in MDX.
```

### Customization

- Update site metadata in `src/app/layout.tsx`
- Modify the theme in `src/styles/globals.css`
- Add or modify components in `src/components`
- Update pages in `src/app` directory

## 🛠️ Development

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Format code
pnpm format
```

## 🚢 Deployment

This template is optimized for deployment on Vercel, but can be deployed on any platform that supports Next.js.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-repo-name)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) team for the incredible framework
- [Vercel](https://vercel.com/) for hosting and deployment
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
