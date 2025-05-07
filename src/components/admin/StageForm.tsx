
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
  name: z.string().min(2, 'Name must be at least 2 characters'),
  distance: z.coerce.number().positive('Distance must be positive'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  start_time: z.string().min(1, 'Start time is required'),
  status: z.string().min(1, 'Status is required'),
  rally_id: z.string().min(1, 'Rally is required'),
});

type FormValues = z.infer<typeof formSchema>;

const StageForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [rallies, setRallies] = useState<any[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      distance: 0,
      date: '',
      time: '',
      start_time: '',
      status: 'upcoming',
      rally_id: '',
    },
  });

  useEffect(() => {
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
    
    fetchRallies();
  }, []);
  
  useEffect(() => {
    const fetchStage = async () => {
      if (!id) return;
      
      setInitialLoading(true);
      try {
        const { data, error } = await supabase
          .from('stages')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          form.reset({
            name: data.name,
            distance: data.distance,
            date: data.date,
            time: data.time,
            start_time: data.start_time,
            status: data.status,
            rally_id: data.rally_id,
          });
        }
      } catch (error) {
        console.error('Error fetching stage:', error);
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: String(error),
        });
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchStage();
  }, [id, form, t]);
  
  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const formData = {
        name: values.name,
        distance: values.distance,
        date: values.date,
        time: values.time,
        start_time: values.start_time,
        status: values.status,
        rally_id: values.rally_id,
      };
      
      let response;
      
      if (id) {
        // Update existing stage
        response = await supabase
          .from('stages')
          .update(formData)
          .eq('id', id);
      } else {
        // Create new stage
        response = await supabase
          .from('stages')
          .insert([formData]);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: t('common.success'),
        description: id ? 'Stage updated successfully' : 'Stage created successfully',
      });
      
      navigate('/admin/stages');
    } catch (error) {
      console.error('Error saving stage:', error);
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
          {id ? 'Edit Stage' : 'Add Stage'}
        </h1>
        <p className="text-muted-foreground">
          {id ? 'Edit existing stage details' : 'Create a new rally stage'}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('stage.name')}</FormLabel>
                <FormControl>
                  <Input placeholder="SS1 - Acropolis" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('stage.distance')} (km)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      min="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
          </div>
          
          <div className="grid gap-6 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('stage.date')}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('stage.time')}</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('stage.startTime')}</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('stage.status')}</FormLabel>
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
                    <SelectItem value="upcoming">{t('stage.statuses.upcoming')}</SelectItem>
                    <SelectItem value="inProgress">{t('stage.statuses.inProgress')}</SelectItem>
                    <SelectItem value="completed">{t('stage.statuses.completed')}</SelectItem>
                    <SelectItem value="cancelled">{t('stage.statuses.cancelled')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/stages')}
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

export default StageForm;
