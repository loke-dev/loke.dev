import { Outlet } from '@remix-run/react'
import { MDXComponentsProvider } from '../components/mdx-provider'

export default function BlogLayout() {
  return (
    <MDXComponentsProvider>
      <Outlet />
    </MDXComponentsProvider>
  )
}
