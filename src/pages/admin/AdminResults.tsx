
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { useAdminResults } from "@/hooks/useAdminResults";

// Import refactored components
import SearchBar from "@/components/admin/ResultsList/SearchBar";
import ResultsTable from "@/components/admin/ResultsList/ResultsTable";
import DeleteConfirmDialog from "@/components/admin/ResultsList/DeleteConfirmDialog";

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

      <SearchBar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        placeholder={t('common.search')}
      />

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
        <ResultsTable 
          results={filteredResults} 
          onDeleteClick={setResultToDelete} 
        />
      )}

      <DeleteConfirmDialog 
        isOpen={!!resultToDelete}
        isDeleting={isDeleting}
        onClose={() => setResultToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AdminResults;
