
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const AdminResults = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Results</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage race results for the Greek Rally Championship
          </p>
        </div>
        <Button className="bg-rally-purple hover:bg-rally-purple-dark">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Results
        </Button>
      </div>

      {/* Placeholder for results management UI */}
      <div className="border rounded-lg p-8 text-center">
        <p className="text-gray-500">Results management interface will be implemented here</p>
      </div>
    </div>
  );
};

export default AdminResults;
