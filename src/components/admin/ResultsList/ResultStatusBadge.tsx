
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';

interface ResultStatusBadgeProps {
  status: string;
}

const ResultStatusBadge = ({ status }: ResultStatusBadgeProps) => {
  const { t } = useTranslation();

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

export default ResultStatusBadge;
