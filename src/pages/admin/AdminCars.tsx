
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  ChevronRight,
  Edit,
  Loader2,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

const AdminCars = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [carToDelete, setCarToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["admin-cars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select(`
          *,
          team:teams(name, id)
        `)
        .order("make");
      
      if (error) throw error;
      return data || [];
    }
  });

  const filteredCars = data.filter((car) =>
    car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (car.team?.name && car.team.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async () => {
    if (!carToDelete) return;
    
    setIsDeleting(true);
    try {
      // Check if car is used in entries
      const { data: entries, error: entriesError } = await supabase
        .from("entries")
        .select("id")
        .eq("car_id", carToDelete);
      
      if (entriesError) throw entriesError;
      
      if (entries && entries.length > 0) {
        toast({
          variant: "destructive",
          title: t("common.error"),
          description: t("car.cannotDeleteWithEntries"),
        });
        return;
      }
      
      const { error } = await supabase
        .from("cars")
        .delete()
        .eq("id", carToDelete);
      
      if (error) throw error;
      
      toast({
        title: t("common.success"),
        description: t("car.deleteSuccess"),
      });
      
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
    } catch (error) {
      console.error("Error deleting car:", error);
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: String(error),
      });
    } finally {
      setIsDeleting(false);
      setCarToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.cars')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('admin.manageCars')}
          </p>
        </div>
        <Button asChild className="bg-rally-purple hover:bg-rally-purple-dark">
          <Link to="/admin/cars/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('admin.addCar')}
          </Link>
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder={t('common.search')}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-rally-purple" />
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="text-red-500">{t('common.error')}: {String(error)}</p>
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">{t('car.noCarsFound')}</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('car.make')}</TableHead>
                <TableHead>{t('car.model')}</TableHead>
                <TableHead>{t('car.category')}</TableHead>
                <TableHead>{t('car.team')}</TableHead>
                <TableHead>{t('car.year')}</TableHead>
                <TableHead className="w-[100px]">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      {car.image_url && (
                        <img 
                          src={car.image_url}
                          alt={`${car.make} ${car.model}`}
                          className="w-10 h-6 object-contain"
                        />
                      )}
                      <span>{car.make}</span>
                    </div>
                  </TableCell>
                  <TableCell>{car.model}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{car.category}</Badge>
                  </TableCell>
                  <TableCell>{car.team?.name || "-"}</TableCell>
                  <TableCell>{car.year || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8"
                      >
                        <Link to={`/admin/cars/${car.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">{t('common.edit')}</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => setCarToDelete(car.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{t('common.delete')}</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!carToDelete} onOpenChange={(open) => !open && setCarToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.deleteConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('admin.deleting')}
                </>
              ) : (
                t('common.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCars;
