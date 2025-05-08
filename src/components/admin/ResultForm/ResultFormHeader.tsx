
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface ResultFormHeaderProps {
  isEditing: boolean;
}

const ResultFormHeader = ({ isEditing }: ResultFormHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        {isEditing ? t('admin.editResult') : t('admin.addResult')}
      </h1>
      <p className="text-muted-foreground">
        {isEditing ? t('result.editInstructions') : t('result.createInstructions')}
      </p>
    </div>
  );
};

export default ResultFormHeader;
