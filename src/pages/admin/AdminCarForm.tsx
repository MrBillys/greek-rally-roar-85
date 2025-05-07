
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminCarForm = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add/Edit Car</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage car information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Car Details</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for car form */}
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Car form will be implemented here</p>
            <Button onClick={() => navigate("/admin/cars")}>
              Back to Cars
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCarForm;
