
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  ChevronRight,
  Edit,
  Loader2,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import { useAdminRallies } from "@/hooks/useSupabase";

const AdminRallies = () => {
  const { rallies, loading, error, deleteRally } = useAdminRallies();
  const [searchTerm, setSearchTerm] = useState("");
  const [rallyToDelete, setRallyToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredRallies = rallies.filter((rally) =>
    rally.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!rallyToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteRally(rallyToDelete);
    } finally {
      setIsDeleting(false);
      setRallyToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Upcoming</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Ongoing</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rallies</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage rally events for the Greek Rally Championship
          </p>
        </div>
        <Button asChild className="bg-rally-purple hover:bg-rally-purple-dark">
          <Link to="/admin/rallies/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Rally
          </Link>
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search rallies..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-rally-purple" />
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="text-red-500">Error loading rallies: {error.message}</p>
        </div>
      ) : filteredRallies.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">No rallies found</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRallies.map((rally) => (
                <TableRow key={rally.id}>
                  <TableCell className="font-medium">{rally.title}</TableCell>
                  <TableCell>{rally.date}</TableCell>
                  <TableCell>{rally.location}</TableCell>
                  <TableCell>{getStatusBadge(rally.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8"
                      >
                        <Link to={`/admin/rallies/${rally.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => setRallyToDelete(rally.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8"
                      >
                        <Link to={`/rallies/${rally.slug}`}>
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!rallyToDelete} onOpenChange={(open) => !open && setRallyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this rally and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminRallies;
