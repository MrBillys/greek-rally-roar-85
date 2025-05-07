
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
  position: z.coerce.number().int().positive('Position must be a positive integer'),
  time: z.string().min(1, 'Time is required'),
  gap: z.string().optional().nullable(),
  status: z.string().min(1, 'Status is required'),
  driver_id: z.string().min(1, 'Driver is required'),
  co_driver_id: z.string().optional().nullable(),
  rally_id: z.string().min(1, 'Rally is required'),
  stage_id: z.string().min(1, 'Stage is required'),
  car_number: z.coerce.number().int().positive('Car number must be a positive integer'),
});

type FormValues = z.infer<typeof formSchema>;

const ResultForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [coDrivers, setCoDrivers] = useState<any[]>([]);
  const [rallies, setRallies] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [selectedRally, setSelectedRally] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: 1,
      time: '',
      gap: '',
      status: 'finished',
      driver_id: '',
      co_driver_id: '',
      rally_id: '',
      stage_id: '',
      car_number: 1,
    },
  });

  const watchRallyId = form.watch('rally_id');

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const { data, error } = await supabase
          .from('drivers')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setDrivers(data || []);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

    const fetchRallies = async () => {
      try {
        const { data, error } = await supabase
          .from('rallies')
          .select('*')
          .order('title');
        
        if (error) throw error;
        setRallies(data || []);
      } catch (error) {
        console.error('Error fetching rallies:', error);
      }
    };
    
    fetchDrivers();
    fetchRallies();
  }, []);
  
  useEffect(() => {
    if (!watchRallyId) return;
    
    setSelectedRally(watchRallyId);
    
    const fetchStages = async () => {
      try {
        const { data, error } = await supabase
          .from('stages')
          .select('*')
          .eq('rally_id', watchRallyId)
          .order('name');
        
        if (error) throw error;
        setStages(data || []);
      } catch (error) {
        console.error('Error fetching stages:', error);
      }
    };
    
    fetchStages();
  }, [watchRallyId]);
  
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
          setSelectedRally(data.rally_id);
          
          // Fetch stages for this rally
          const { data: stageData } = await supabase
            .from('stages')
            .select('*')
            .eq('rally_id', data.rally_id)
            .order('name');
          
          setStages(stageData || []);
          
          form.reset({
            position: data.position,
            time: data.time,
            gap: data.gap || '',
            status: data.status,
            driver_id: data.driver_id,
            co_driver_id: data.co_driver_id || null,
            rally_id: data.rally_id,
            stage_id: data.stage_id,
            car_number: data.car_number,
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
      const formData = {
        position: values.position,
        time: values.time,
        gap: values.gap || null,
        status: values.status,
        driver_id: values.driver_id,
        co_driver_id: values.co_driver_id || null,
        rally_id: values.rally_id,
        stage_id: values.stage_id,
        car_number: values.car_number,
      };
      
      let response;
      
      if (id) {
        // Update existing result
        response = await supabase
          .from('stage_results')
          .update(formData)
          .eq('id', id);
      } else {
        // Create new result
        response = await supabase
          .from('stage_results')
          .insert([formData]);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: t('common.success'),
        description: id ? 'Result updated successfully' : 'Result created successfully',
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {id ? 'Edit Result' : 'Add Result'}
        </h1>
        <p className="text-muted-foreground">
          {id ? 'Edit existing stage result' : 'Add a new stage result'}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="rally_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('results.rally')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a rally" />
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
                  <FormLabel>{t('results.stage')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedRally}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedRally ? "Select a stage" : "Select a rally first"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stages.map((stage) => (
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
          
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="driver_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('results.driver')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a driver" />
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
                  <FormLabel>{t('results.coDriver')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a co-driver (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">
                        No co-driver
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
          
          <div className="grid gap-6 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('results.position')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="car_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car Number</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="finished">Finished</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="disqualified">Disqualified</SelectItem>
                      <SelectItem value="not_started">Not Started</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('results.time')}</FormLabel>
                  <FormControl>
                    <Input placeholder="00:03:45.2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('results.gap')}</FormLabel>
                  <FormControl>
                    <Input placeholder="+0.3s" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
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
