
import { useTranslation } from 'react-i18next';

interface CarFormHeaderProps {
  isEditing: boolean;
}

const CarFormHeader = ({ isEditing }: CarFormHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        {isEditing ? t('admin.editCar') : t('admin.addCar')}
      </h1>
      <p className="text-muted-foreground">
        {isEditing ? t('car.editInstructions') : t('car.createInstructions')}
      </p>
    </div>
  );
};

export default CarFormHeader;
