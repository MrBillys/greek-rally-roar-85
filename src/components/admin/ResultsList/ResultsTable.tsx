
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import ResultStatusBadge from './ResultStatusBadge';

interface ResultsTableProps {
  results: any[];
  onDeleteClick: (id: string) => void;
}

const ResultsTable = ({ results, onDeleteClick }: ResultsTableProps) => {
  const { t } = useTranslation();

  return (
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
          {results.map((result) => (
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
              <TableCell><ResultStatusBadge status={result.status} /></TableCell>
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
                    onClick={() => onDeleteClick(result.id)}
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
  );
};

export default ResultsTable;
