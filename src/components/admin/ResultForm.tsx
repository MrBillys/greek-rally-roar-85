
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

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
  stage_id: z.string().uuid('Please select a stage'),
  rally_id: z.string().uuid('Please select a rally'),
  driver_id: z.string().uuid('Please select a driver'),
  co_driver_id: z.string().uuid().optional().nullable(),
  time: z.string().min(1, 'Time is required'),
  position: z.coerce.number().int().positive('Position must be a positive integer'),
  gap: z.string().optional(),
  car_number: z.coerce.number().int().positive('Car number must be a positive integer'),
  status: z.string().min(1, 'Status is required'),
});

type FormValues = z.infer<typeof formSchema>;

const ResultForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id ? true : false);
  
  const [rallies, setRallies] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [coDrivers, setCoDrivers] = useState<any[]>([]);
  const [selectedRallyId, setSelectedRallyId] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stage_id: '',
      rally_id: '',
      driver_id: '',
      co_driver_id: null,
      time: '',
      position: 1,
      gap: '',
      car_number: 1,
      status: 'finished',
    },
  });

  // Watch the rally_id field to filter stages
  const rally_id = form.watch('rally_id');

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
    
    fetchRallies();
  }, [t]);
  
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const { data, error } = await supabase
          .from('drivers')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        setDrivers(data || []);
        setCoDrivers(data || []);
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
  
  useEffect(() => {
    const fetchStages = async () => {
      if (!rally_id) return;
      
      try {
        const { data, error } = await supabase
          .from('stages')
          .select('id, name')
          .eq('rally_id', rally_id)
          .order('start_time', { ascending: true });
        
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
    
    if (rally_id) {
      fetchStages();
    }
  }, [rally_id, t]);
  
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
          setSelectedRallyId(data.rally_id);
          form.reset({
            stage_id: data.stage_id || '',
            rally_id: data.rally_id || '',
            driver_id: data.driver_id || '',
            co_driver_id: data.co_driver_id || null,
            time: data.time || '',
            position: data.position || 1,
            gap: data.gap || '',
            car_number: data.car_number || 1,
            status: data.status || 'finished',
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
        co_driver_id: values.co_driver_id,
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {id ? t('admin.editResult') : t('admin.addResult')}
        </h1>
        <p className="text-muted-foreground">
          {id ? t('result.editInstructions') : t('result.createInstructions')}
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
                  <FormLabel>{t('result.rally')}</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('stage_id', ''); // Reset stage selection when rally changes
                    }}
                    value={field.value}
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
                    value={field.value}
                    disabled={!rally_id}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('result.selectStage')} />
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
                  <FormLabel>{t('result.driver')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
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
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('result.selectCoDriver')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">
                        {t('result.noCoDriver')}
                      </SelectItem>
                      {coDrivers.map((coDriver) => (
                        <SelectItem key={coDriver.id} value={coDriver.id}>
                          {coDriver.name}
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
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('result.time')}</FormLabel>
                  <FormControl>
                    <Input placeholder="3:45.7" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('result.position')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
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
                  <FormLabel>{t('result.gap')}</FormLabel>
                  <FormControl>
                    <Input placeholder="+1.3s" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="car_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('result.carNumber')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
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
                  <FormLabel>{t('result.status')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('result.selectStatus')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="finished">{t('result.finished')}</SelectItem>
                      <SelectItem value="dnf">{t('result.dnf')}</SelectItem>
                      <SelectItem value="dns">{t('result.dns')}</SelectItem>
                      <SelectItem value="excluded">{t('result.excluded')}</SelectItem>
                    </SelectContent>
                  </Select>
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
