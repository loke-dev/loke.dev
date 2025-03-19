import NavLink from './NavLink'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer footer-center bg-base-200 text-base-content border-base-300 border-t p-4">
      <div className="container mx-auto">
        <div className="grid-flow-col items-center justify-between gap-4 md:grid">
          <div className="text-center md:text-left">
            <p className="text-sm">
              &copy; {currentYear} loke.dev. All rights reserved.
            </p>
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
          <div className="dropdown dropdown-top">
            <div tabIndex={0} role="button" className="btn m-1">
              Theme
              <svg
                width="12px"
                height="12px"
                className="inline-block h-2 w-2 fill-current opacity-60"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048"
              >
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl"
            >
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Default"
                  value="default"
                />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Retro"
                  value="retro"
                />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Cyberpunk"
                  value="cyberpunk"
                />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Valentine"
                  value="valentine"
                />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Aqua"
                  value="aqua"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
