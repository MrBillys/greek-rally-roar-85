
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "./theme-toggle";
import LanguageSwitcher from "./LanguageSwitcher";

export function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="bg-white dark:bg-gray-900 sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/placeholder.svg" alt="Logo" className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Greek Rally
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  {t('nav.home')}
                </Link>
                <Link
                  to="/calendar"
                  className="text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  {t('nav.calendar')}
                </Link>
                <Link
                  to="/live"
                  className="text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  {t('nav.live')}
                </Link>
                <Link
                  to="/drivers"
                  className="text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  {t('nav.drivers')}
                </Link>
                <Link
                  to="/about"
                  className="text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  {t('nav.about')}
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link
              to="/admin"
              className="text-gray-900 bg-gray-100 hover:bg-gray-200 dark:text-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md px-3 py-2 text-sm font-medium"
            >
              {t('nav.admin')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
