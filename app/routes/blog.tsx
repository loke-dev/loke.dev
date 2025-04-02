import { Outlet } from '@remix-run/react'
import { MDXComponentsProvider } from '@/lib/mdx-provider'

export default function BlogLayout() {
  return (
    <MDXComponentsProvider>
      <Outlet />
    </MDXComponentsProvider>
  )
}
