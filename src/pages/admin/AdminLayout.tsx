
import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useSupabase";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  CalendarIcon,
  Car,
  Flag,
  LayoutDashboard,
  LogOut,
  Menu,
  Timer,
  Trophy,
  Users
} from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    const { success } = await logout();
    if (success) {
      navigate("/admin/login");
    }
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-3 text-base font-medium rounded-lg transition-colors ${
          isActive
            ? "bg-rally-purple text-white"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        }`
      }
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className={`${!sidebarOpen && "hidden"}`}>{label}</span>
    </NavLink>
  );

  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-white dark:bg-gray-800 transition-all duration-300 shadow-md ${
            sidebarOpen ? "w-64" : "w-16"
          } flex flex-col`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Flag className="h-8 w-8 text-rally-purple" />
              {sidebarOpen && (
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  {t('admin.dashboard')}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavItem to="/admin" icon={LayoutDashboard} label={t('admin.dashboard')} />
            <NavItem to="/admin/rallies" icon={Flag} label={t('admin.rallies')} />
            <NavItem to="/admin/drivers" icon={Users} label={t('admin.drivers')} />
            <NavItem to="/admin/teams" icon={Users} label={t('admin.teams')} />
            <NavItem to="/admin/cars" icon={Car} label={t('admin.cars')} />
            <NavItem to="/admin/stages" icon={Timer} label={t('admin.stages')} />
            <NavItem to="/admin/results" icon={Trophy} label={t('admin.results')} />
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                className="w-full flex items-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-3" />
                {sidebarOpen && <span>{t('auth.logout')}</span>}
              </Button>
              {sidebarOpen && <LanguageSwitcher />}
            </div>
            <NavLink
              to="/"
              className="mt-4 flex items-center p-2 text-gray-600 hover:text-rally-purple dark:text-gray-400 dark:hover:text-rally-purple rounded-md text-sm font-medium"
            >
              <CalendarIcon className="w-5 h-5 mr-2" />
              {sidebarOpen && <span>{t('auth.backToWebsite')}</span>}
            </NavLink>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default AdminLayout;
