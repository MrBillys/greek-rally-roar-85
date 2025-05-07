
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  make: z.string().min(2, 'Make must be at least 2 characters'),
  model: z.string().min(1, 'Model is required'),
  engine_capacity: z.coerce.number().nullable().optional(),
  year: z.coerce.number().nullable().optional(),
  category: z.string().min(1, 'Category is required'),
  image_url: z.string().url().optional().or(z.literal('')),
  team_id: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

const CarForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: '',
      model: '',
      engine_capacity: null,
      year: null,
      category: '',
      image_url: '',
      team_id: null,
    },
  });

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
  
  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      
      setInitialLoading(true);
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          form.reset({
            make: data.make,
            model: data.model,
            engine_capacity: data.engine_capacity,
            year: data.year,
            category: data.category,
            image_url: data.image_url || '',
            team_id: data.team_id,
          });
        }
      } catch (error) {
        console.error('Error fetching car:', error);
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: String(error),
        });
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchCar();
  }, [id, form, t]);
  
  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const formData = {
        make: values.make,
        model: values.model,
        engine_capacity: values.engine_capacity,
        year: values.year,
        category: values.category,
        image_url: values.image_url || null,
        team_id: values.team_id || null,
      };
      
      let response;
      
      if (id) {
        // Update existing car
        response = await supabase
          .from('cars')
          .update(formData)
          .eq('id', id);
      } else {
        // Create new car
        response = await supabase
          .from('cars')
          .insert([formData]);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: t('common.success'),
        description: id ? t('car.updateSuccess') : t('car.createSuccess'),
      });
      
      navigate('/admin/cars');
    } catch (error) {
      console.error('Error saving car:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: String(error),
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {id ? t('admin.editCar') : t('admin.addCar')}
        </h1>
        <p className="text-muted-foreground">
          {id ? t('car.editInstructions') : t('car.createInstructions')}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('car.image')}</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/car.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/cars')}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CarForm;
