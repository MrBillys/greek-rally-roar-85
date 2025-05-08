
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "./theme-toggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: t('nav.home') },
    { path: "/calendar", label: t('nav.calendar') },
    { path: "/live", label: t('nav.live') },
    { path: "/drivers", label: t('nav.drivers') },
    { path: "/about", label: t('nav.about') },
  ];

  const NavLink = ({ path, label, onClick }: { path: string; label: string; onClick?: () => void }) => (
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        "text-gray-700 hover:text-rally-purple hover:bg-gray-50",
        "dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-800",
        "rounded-md px-3 py-2 text-sm font-medium transition-colors"
      )}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white dark:bg-gray-900 sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                StageTime.gr
              </span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <NavLink key={item.path} path={item.path} label={item.label} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="ml-1"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navItems.map((item) => (
              <div key={item.path} className="py-1">
                <NavLink 
                  path={item.path} 
                  label={item.label} 
                  onClick={() => setMobileMenuOpen(false)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
