import NavLink from './navLink'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer footer-center bg-base-200 text-base-content border-base-300 border-t p-4">
      <div className="container mx-auto">
        <div className="grid-flow-col items-center justify-between gap-4 md:grid">
          <div className="text-center md:text-left">
            <p className="text-sm">&copy; {currentYear} loke.dev. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <NavLink href="/" type="footer">
              Home
            </NavLink>
            <NavLink href="/about" type="footer">
              About
            </NavLink>
            <NavLink href="/contact" type="footer">
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
