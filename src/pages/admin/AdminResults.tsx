
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
  Edit,
  Loader2,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import { useAdminResults } from "@/hooks/useAdminResults";

const AdminResults = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [resultToDelete, setResultToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { results, loading, error, deleteResult } = useAdminResults();

  const filteredResults = results.filter((result) =>
    result.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.stage?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.rally?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.time?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!resultToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteResult(resultToDelete);
      setResultToDelete(null);
    } catch (error) {
      console.error('Error deleting result:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'finished':
        return <Badge className="bg-green-500 hover:bg-green-600">{t('result.finished')}</Badge>;
      case 'dnf':
        return <Badge variant="destructive">{t('result.dnf')}</Badge>;
      case 'dsq':
        return <Badge variant="outline" className="border-red-500 text-red-500">{t('result.dsq')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.results')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('admin.manageResults')}
          </p>
        </div>
        <Button asChild className="bg-rally-purple hover:bg-rally-purple-dark">
          <Link to="/admin/results/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('admin.addResult')}
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
      ) : filteredResults.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">{t('result.noResultsFound')}</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('result.rally')}</TableHead>
                <TableHead>{t('result.stage')}</TableHead>
                <TableHead>{t('result.driver')}</TableHead>
                <TableHead>{t('result.position')}</TableHead>
                <TableHead>{t('result.time')}</TableHead>
                <TableHead>{t('result.status')}</TableHead>
                <TableHead className="w-[100px]">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>{result.rally?.title || '-'}</TableCell>
                  <TableCell>{result.stage?.name || '-'}</TableCell>
                  <TableCell className="font-medium">
                    {result.driver?.name || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{result.position}</span>
                      {result.gap && (
                        <span className="text-gray-500 text-sm">{result.gap}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{result.time}</TableCell>
                  <TableCell>{getStatusBadge(result.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8"
                      >
                        <Link to={`/admin/results/${result.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">{t('common.edit')}</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => setResultToDelete(result.id)}
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

      <AlertDialog open={!!resultToDelete} onOpenChange={(open) => !open && setResultToDelete(null)}>
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

export default AdminResults;
