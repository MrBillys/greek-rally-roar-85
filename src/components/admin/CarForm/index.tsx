
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

// Import refactored components
import CarFormHeader from './CarFormHeader';
import BasicDetails from './BasicDetails';
import CategoryTeam from './CategoryTeam';

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
      // Handle the "none" value for team_id
      const teamId = values.team_id === 'none' ? null : values.team_id;
      
      const formData = {
        make: values.make,
        model: values.model,
        engine_capacity: values.engine_capacity,
        year: values.year,
        category: values.category,
        image_url: values.image_url || null,
        team_id: teamId,
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
      <CarFormHeader isEditing={!!id} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicDetails form={form} />
          <CategoryTeam form={form} />
          
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
