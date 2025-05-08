
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

interface RallyStageSelectProps {
  form: UseFormReturn<any>;
}

const RallyStageSelect = ({ form }: RallyStageSelectProps) => {
  const { t } = useTranslation();
  const [rallies, setRallies] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [filteredStages, setFilteredStages] = useState<any[]>([]);

  const watchRallyId = form.watch('rally_id');

  // Filter stages based on selected rally
  useEffect(() => {
    if (watchRallyId) {
      const filtered = stages.filter(stage => stage.rally_id === watchRallyId);
      setFilteredStages(filtered);
    } else {
      setFilteredStages([]);
    }
  }, [watchRallyId, stages]);

  useEffect(() => {
    const fetchRallies = async () => {
      try {
        const { data, error } = await supabase
          .from('rallies')
          .select('id, title')
          .order('date', { ascending: false });
        
        if (error) throw error;
        setRallies(data || []);
      } catch (error) {
        console.error('Error fetching rallies:', error);
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: String(error),
        });
      }
    };

    const fetchStages = async () => {
      try {
        const { data, error } = await supabase
          .from('stages')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) throw error;
        setStages(data || []);
      } catch (error) {
        console.error('Error fetching stages:', error);
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: String(error),
        });
      }
    };
    
    fetchRallies();
    fetchStages();
  }, [t]);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="rally_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('result.rally')}</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('result.selectRally')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {rallies.map((rally) => (
                  <SelectItem key={rally.id} value={rally.id}>
                    {rally.title}
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
        name="stage_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('result.stage')}</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || undefined}
              disabled={!watchRallyId}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('result.selectStage')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {filteredStages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
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

export default RallyStageSelect;
