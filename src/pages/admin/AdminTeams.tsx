
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const AdminTeams = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage teams for the Greek Rally Championship
          </p>
        </div>
        <Button asChild className="bg-rally-purple hover:bg-rally-purple-dark">
          <Link to="/admin/teams/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Team
          </Link>
        </Button>
      </div>

      {/* Placeholder for teams management UI */}
      <div className="border rounded-lg p-8 text-center">
        <p className="text-gray-500">Team management interface will be implemented here</p>
      </div>
    </div>
  );
};

export default AdminTeams;
