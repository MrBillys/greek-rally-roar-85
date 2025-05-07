
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  distance: z.coerce.number().positive('Distance must be a positive number'),
  status: z.string().min(1, 'Status is required'),
  date: z.date(),
  time: z.string().min(1, 'Time is required'),
  rally_id: z.string().uuid('Please select a rally'),
});

type FormValues = z.infer<typeof formSchema>;

const StageForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id ? true : false);
  const [rallies, setRallies] = useState<any[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      distance: 0,
      status: 'upcoming',
      date: new Date(),
      time: '08:00',
      rally_id: '',
    },
  });

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
            name: data.name || '',
            distance: data.distance || 0,
            status: data.status || 'upcoming',
            date: data.date ? new Date(data.date) : new Date(),
            time: data.time || '08:00',
            rally_id: data.rally_id || '',
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
      const formattedDate = format(values.date, 'yyyy-MM-dd');
      const startTime = `${formattedDate}T${values.time}:00`;
      
      const stageData = {
        name: values.name,
        distance: values.distance,
        status: values.status,
        date: formattedDate,
        time: values.time,
        start_time: startTime,
        rally_id: values.rally_id,
      };
      
      let response;
      
      if (id) {
        response = await supabase
          .from('stages')
          .update(stageData)
          .eq('id', id);
      } else {
        response = await supabase
          .from('stages')
          .insert([stageData]);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: t('common.success'),
        description: id ? t('stage.updateSuccess') : t('stage.createSuccess'),
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
          {id ? t('admin.editStage') : t('admin.addStage')}
        </h1>
        <p className="text-muted-foreground">
          {id ? t('stage.editInstructions') : t('stage.createInstructions')}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('stage.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Acropolis SS1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                      placeholder="12.5"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
              name="rally_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('stage.rally')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('stage.selectRally')} />
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('stage.status')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('stage.selectStatus')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="upcoming">{t('stage.upcoming')}</SelectItem>
                      <SelectItem value="in-progress">{t('stage.inProgress')}</SelectItem>
                      <SelectItem value="completed">{t('stage.completed')}</SelectItem>
                      <SelectItem value="cancelled">{t('stage.cancelled')}</SelectItem>
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
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('stage.date')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                    <Input 
                      type="time" 
                      {...field}
                    />
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
