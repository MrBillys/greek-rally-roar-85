
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CategoryTeamProps {
  form: UseFormReturn<any>;
}

const CategoryTeam = ({ form }: CategoryTeamProps) => {
  const { t } = useTranslation();
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    // Fetch teams for the dropdown
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setTeams(data || []);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    
    fetchTeams();
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('car.category')}</FormLabel>
            <FormControl>
              <Input placeholder="WRC" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="team_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('car.team')}</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('car.selectTeam')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">
                  {t('car.noTeam')}
                </SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
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

export default CategoryTeam;
