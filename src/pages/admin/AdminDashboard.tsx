
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag, Car, Users, Trophy } from "lucide-react";
import { useRallies, useDrivers } from "@/hooks/useSupabase";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { rallies, loading: loadingRallies } = useRallies();
  const { drivers, loading: loadingDrivers } = useDrivers();
  
  const upcomingRallies = rallies.filter(rally => rally.status === 'upcoming');
  const ongoingRallies = rallies.filter(rally => rally.status === 'in-progress');

  const StatCard = ({ title, value, icon: Icon, description, loading, href }: {
    title: string;
    value: number;
    icon: React.ElementType;
    description: string;
    loading: boolean;
    href: string;
  }) => (
    <Card>
      <Link to={href} className="block h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            <>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            </>
          )}
        </CardContent>
      </Link>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Welcome to the Greek Rally admin panel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Rallies"
          value={rallies.length}
          icon={Flag}
          description="Manage all rallies"
          loading={loadingRallies}
          href="/admin/rallies"
        />
        <StatCard
          title="Total Drivers"
          value={drivers.length}
          icon={Users}
          description="Manage all drivers"
          loading={loadingDrivers}
          href="/admin/drivers"
        />
        <StatCard
          title="Upcoming Rallies"
          value={upcomingRallies.length}
          icon={Flag}
          description="Scheduled rallies"
          loading={loadingRallies}
          href="/admin/rallies"
        />
        <StatCard
          title="Active Rallies"
          value={ongoingRallies.length}
          icon={Trophy}
          description="Currently running"
          loading={loadingRallies}
          href="/admin/rallies"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Rallies */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Rallies</CardTitle>
            <CardDescription>Latest added or updated rallies</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingRallies ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ))}
              </div>
            ) : rallies.length > 0 ? (
              <div className="space-y-2">
                {rallies.slice(0, 5).map((rally) => (
                  <Link 
                    key={rally.id}
                    to={`/admin/rallies/${rally.id}`}
                    className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{rally.title}</p>
                      <p className="text-xs text-gray-500">{rally.date} - {rally.status}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No rallies found</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Drivers */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Drivers</CardTitle>
            <CardDescription>Latest added or updated drivers</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingDrivers ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ))}
              </div>
            ) : drivers.length > 0 ? (
              <div className="space-y-2">
                {drivers.slice(0, 5).map((driver) => (
                  <Link 
                    key={driver.id}
                    to={`/admin/drivers/${driver.id}`}
                    className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-xs text-gray-500">{driver.nationality}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No drivers found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
