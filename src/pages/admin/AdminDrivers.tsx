
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Loader2,
  PlusCircle,
  Search,
  Trash2
} from "lucide-react";
import { useAdminDrivers } from "@/hooks/useAdminDrivers";
import { toast } from '@/components/ui/use-toast';

const AdminDrivers = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { drivers, loading, error, deleteDriver } = useAdminDrivers();

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (driver.team?.name && driver.team.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async () => {
    if (!driverToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteDriver(driverToDelete);
      setDriverToDelete(null);
    } catch (error) {
      console.error('Error deleting driver:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.drivers')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('admin.manageDrivers')}
          </p>
        </div>
        <Button asChild className="bg-rally-purple hover:bg-rally-purple-dark">
          <Link to="/admin/drivers/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('admin.addDriver')}
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

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-rally-purple" />
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="text-red-500">{t('common.error')}: {String(error)}</p>
        </div>
      ) : filteredDrivers.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">{t('driver.noDriversFound')}</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('driver.name')}</TableHead>
                <TableHead>{t('driver.nationality')}</TableHead>
                <TableHead>{t('driver.team')}</TableHead>
                <TableHead>{t('driver.championships')}</TableHead>
                <TableHead>{t('driver.podiums')}</TableHead>
                <TableHead className="w-[100px]">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      {driver.photo_url && (
                        <img 
                          src={driver.photo_url}
                          alt={driver.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span>{driver.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{driver.nationality}</TableCell>
                  <TableCell>{driver.team?.name || "-"}</TableCell>
                  <TableCell>{driver.championships}</TableCell>
                  <TableCell>{driver.podiums}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8"
                      >
                        <Link to={`/admin/drivers/${driver.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">{t('common.edit')}</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => setDriverToDelete(driver.id)}
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

      <AlertDialog open={!!driverToDelete} onOpenChange={(open) => !open && setDriverToDelete(null)}>
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

export default AdminDrivers;
