import NavLink from './NavLink'

export default function Header() {
  return (
    <header className="navbar bg-base-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="navbar-start">
          <NavLink href="/" type="brand">
            loke.dev
          </NavLink>
        </div>
        <div className="navbar-end">
          <ul className="menu menu-horizontal px-1">
            <li>
              <NavLink href="/blog">Blog</NavLink>
            </li>
            <li>
              <NavLink href="/about">About</NavLink>
            </li>
            <li>
              <NavLink href="/contact">Contact</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
