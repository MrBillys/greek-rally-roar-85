
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const AdminDrivers = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drivers</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage drivers for the Greek Rally Championship
          </p>
        </div>
        <Button asChild className="bg-rally-purple hover:bg-rally-purple-dark">
          <Link to="/admin/drivers/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Driver
          </Link>
        </Button>
      </div>

      {/* Placeholder for drivers management UI */}
      <div className="border rounded-lg p-8 text-center">
        <p className="text-gray-500">Driver management interface will be implemented here</p>
      </div>
    </div>
  );
};

export default AdminDrivers;
