import Container from './ui/Container'
import NavLink from './ui/NavLink'

export default function Header() {
  return (
    <header className="bg-white shadow-sm dark:bg-gray-900">
      <Container padding="default" spacing="none">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <NavLink href="/" type="brand">
              loke.dev
            </NavLink>
          </div>
          <nav
            className="flex items-center space-x-4"
            aria-label="Main navigation"
          >
            <NavLink href="/" type="header">
              Home
            </NavLink>
            <NavLink href="/blog" type="header">
              Blog
            </NavLink>
            <NavLink href="/about" type="header">
              About
            </NavLink>
            <NavLink href="/contact" type="header">
              Contact
            </NavLink>
          </nav>
        </div>
      </Container>
    </header>
  )
}
