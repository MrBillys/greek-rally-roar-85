
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminTeamForm = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add/Edit Team</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage team information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Details</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for team form */}
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Team form will be implemented here</p>
            <Button onClick={() => navigate("/admin/teams")}>
              Back to Teams
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTeamForm;
