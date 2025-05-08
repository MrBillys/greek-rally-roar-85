
import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface BasicDetailsProps {
  form: UseFormReturn<any>;
}

const BasicDetails = ({ form }: BasicDetailsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="make"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('car.make')}</FormLabel>
              <FormControl>
                <Input placeholder="Toyota" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('car.model')}</FormLabel>
              <FormControl>
                <Input placeholder="GR Yaris" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('car.year')}</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="2023"
                  {...field}
                  value={field.value === null ? '' : field.value}
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value, 10) : null;
                    field.onChange(val);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="engine_capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('car.engineCapacity')}</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="1600"
                  {...field}
                  value={field.value === null ? '' : field.value}
                  onChange={(e) => {
                    const val = e.target.value ? parseFloat(e.target.value) : null;
                    field.onChange(val);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default BasicDetails;
