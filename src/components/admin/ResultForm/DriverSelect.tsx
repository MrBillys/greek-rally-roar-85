
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface DriverSelectProps {
  form: UseFormReturn<any>;
}

const DriverSelect = ({ form }: DriverSelectProps) => {
  const { t } = useTranslation();
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const { data, error } = await supabase
          .from('drivers')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        setDrivers(data || []);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: String(error),
        });
      }
    };
    
    fetchDrivers();
  }, [t]);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="driver_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('result.driver')}</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('result.selectDriver')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="co_driver_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('result.coDriver')}</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('result.selectCoDriver')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {/* Fix: Change empty string to a non-empty string like "none" */}
                <SelectItem value="none">
                  {t('result.noCoDriver')}
                </SelectItem>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DriverSelect;
