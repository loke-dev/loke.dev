import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {currentYear} loke.dev. All rights reserved.
            </p>
          </div>
          <div className="mt-4 flex justify-center md:mt-0">
            <div className="flex space-x-6">
              <Link
                href="/"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
