import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AdminResults = () => {
  const { t } = useTranslation();
  
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
            {t('admin.addResults')}
          </Link>
        </Button>
      </div>

      {/* Placeholder for results management UI */}
      <div className="border rounded-lg p-8 text-center">
        <p className="text-gray-500">{t('admin.resultsManagement')}</p>
      </div>
    </div>
  );
};

export default AdminResults;