import Container from './ui/Container'
import NavLink from './ui/NavLink'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <Container padding="default" spacing="none">
        <div className="py-8 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {currentYear} loke.dev. All rights reserved.
            </p>
          </div>
          <div className="mt-4 flex justify-center md:mt-0">
            <div className="flex space-x-6">
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
      </Container>
    </footer>
  )
}
