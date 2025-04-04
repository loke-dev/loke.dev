import { Outlet } from '@remix-run/react'

export default function BlogLayout() {
  return (
    <div id="blog-layout">
      <Outlet />
    </div>
  )
}
