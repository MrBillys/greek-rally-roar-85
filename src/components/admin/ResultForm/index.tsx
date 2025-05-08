
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

// Import refactored components
import ResultFormHeader from './ResultFormHeader';
import RallyStageSelect from './RallyStageSelect';
import DriverSelect from './DriverSelect';
import ResultDetails from './ResultDetails';

const formSchema = z.object({
  stage_id: z.string().uuid('Please select a stage'),
  rally_id: z.string().uuid('Please select a rally'),
  driver_id: z.string().uuid('Please select a driver'),
  co_driver_id: z.string().optional().nullable(),
  time: z.string().min(1, 'Time is required'),
  position: z.coerce.number().int().positive('Position must be a positive number'),
  gap: z.string().optional().nullable(),
  car_number: z.coerce.number().int().positive('Car number must be a positive number'),
  status: z.string().min(1, 'Status is required'),
});

type FormValues = z.infer<typeof formSchema>;

const ResultForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id ? true : false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stage_id: '',
      rally_id: '',
      driver_id: '',
      co_driver_id: null,
      time: '',
      position: 0,
      gap: '',
      car_number: 0,
      status: 'finished',
    },
  });
  
  useEffect(() => {
    const fetchResult = async () => {
      if (!id) return;
      
      setInitialLoading(true);
      try {
        const { data, error } = await supabase
          .from('stage_results')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          form.reset({
            stage_id: data.stage_id,
            rally_id: data.rally_id,
            driver_id: data.driver_id,
            co_driver_id: data.co_driver_id,
            time: data.time,
            position: data.position,
            gap: data.gap || '',
            car_number: data.car_number,
            status: data.status,
          });
        }
      } catch (error) {
        console.error('Error fetching result:', error);
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: String(error),
        });
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchResult();
  }, [id, form, t]);
  
  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const resultData = {
        stage_id: values.stage_id,
        rally_id: values.rally_id,
        driver_id: values.driver_id,
        co_driver_id: values.co_driver_id || null,
        time: values.time,
        position: values.position,
        gap: values.gap || null,
        car_number: values.car_number,
        status: values.status,
      };
      
      let response;
      
      if (id) {
        response = await supabase
          .from('stage_results')
          .update(resultData)
          .eq('id', id);
      } else {
        response = await supabase
          .from('stage_results')
          .insert([resultData]);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: t('common.success'),
        description: id ? t('result.updateSuccess') : t('result.createSuccess'),
      });
      
      navigate('/admin/results');
    } catch (error) {
      console.error('Error saving result:', error);
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
      <ResultFormHeader isEditing={!!id} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <RallyStageSelect form={form} />
          <DriverSelect form={form} />
          <ResultDetails form={form} />
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/results')}
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

export default ResultForm;
