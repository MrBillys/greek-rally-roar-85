
import { useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Flag, CalendarDays } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const NavLinks = [
  { name: "Home", path: "/" },
  { name: "Calendar", path: "/calendar", hasSubmenu: true },
  { name: "Live Results", path: "/live" },
  { name: "Drivers", path: "/drivers" },
  { name: "About", path: "/about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Flag className="h-8 w-8 text-rally-purple" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                Greek<span className="text-rally-purple">Rally</span>
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                {NavLinks.map((link) => 
                  link.hasSubmenu ? (
                    <NavigationMenuItem key={link.name}>
                      <NavigationMenuTrigger className="text-gray-700 hover:text-rally-purple dark:text-gray-300 dark:hover:text-rally-purple px-3 py-2 text-sm font-medium transition-colors bg-transparent">
                        {link.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 w-[200px]">
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/calendar?view=list"
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="flex items-center gap-2">
                                  <CalendarDays className="h-4 w-4" />
                                  <div className="text-sm font-medium">List View</div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/calendar?view=month"
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="flex items-center gap-2">
                                  <CalendarDays className="h-4 w-4" />
                                  <div className="text-sm font-medium">Monthly View</div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/calendar?view=week"
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="flex items-center gap-2">
                                  <CalendarDays className="h-4 w-4" />
                                  <div className="text-sm font-medium">Weekly View</div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={link.name}>
                      <Link
                        to={link.path}
                        className="text-gray-700 hover:text-rally-purple dark:text-gray-300 dark:hover:text-rally-purple px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        {link.name}
                      </Link>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <ThemeToggle />
            <Button
              variant="ghost"
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-rally-purple dark:text-gray-300 dark:hover:text-rally-purple focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 shadow-lg">
            {NavLinks.map((link) => 
              link.hasSubmenu ? (
                <div key={link.name} className="space-y-1">
                  <div className="text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md text-base font-medium">
                    {link.name}
                  </div>
                  <div className="pl-4 space-y-1">
                    <Link
                      to="/calendar?view=list"
                      className="block text-gray-600 hover:text-rally-purple dark:text-gray-400 dark:hover:text-rally-purple px-3 py-2 rounded-md text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      List View
                    </Link>
                    <Link
                      to="/calendar?view=month"
                      className="block text-gray-600 hover:text-rally-purple dark:text-gray-400 dark:hover:text-rally-purple px-3 py-2 rounded-md text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Monthly View
                    </Link>
                    <Link
                      to="/calendar?view=week"
                      className="block text-gray-600 hover:text-rally-purple dark:text-gray-400 dark:hover:text-rally-purple px-3 py-2 rounded-md text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Weekly View
                    </Link>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-gray-700 hover:text-rally-purple dark:text-gray-300 dark:hover:text-rally-purple px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
