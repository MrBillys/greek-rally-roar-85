
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
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  nationality: z.string().min(2, 'Nationality is required'),
  birthdate: z.string().optional().nullable(),
  team_id: z.string().optional().nullable(),
  photo_url: z.string().url().optional().or(z.literal('')),
  bio: z.string().optional().nullable(),
  championships: z.coerce.number().int().nonnegative(),
  podiums: z.coerce.number().int().nonnegative(),
});

type FormValues = z.infer<typeof formSchema>;

const DriverForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      nationality: '',
      birthdate: '',
      team_id: null,
      photo_url: '',
      bio: '',
      championships: 0,
      podiums: 0,
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
    const fetchDriver = async () => {
      if (!id) return;
      
      setInitialLoading(true);
      try {
        const { data, error } = await supabase
          .from('drivers')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          form.reset({
            name: data.name,
            slug: data.slug,
            nationality: data.nationality,
            birthdate: data.birthdate || '',
            team_id: data.team_id,
            photo_url: data.photo_url || '',
            bio: data.bio || '',
            championships: data.championships,
            podiums: data.podiums,
          });
        }
      } catch (error) {
        console.error('Error fetching driver:', error);
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: String(error),
        });
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchDriver();
  }, [id, form, t]);
  
  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const formData = {
        name: values.name,
        slug: values.slug,
        nationality: values.nationality,
        birthdate: values.birthdate || null,
        team_id: values.team_id || null,
        photo_url: values.photo_url || null,
        bio: values.bio || null,
        championships: values.championships,
        podiums: values.podiums,
      };
      
      let response;
      
      if (id) {
        // Update existing driver
        response = await supabase
          .from('drivers')
          .update(formData)
          .eq('id', id);
      } else {
        // Create new driver
        response = await supabase
          .from('drivers')
          .insert([formData]);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: t('common.success'),
        description: id ? t('driver.updateSuccess') : t('driver.createSuccess'),
      });
      
      navigate('/admin/drivers');
    } catch (error) {
      console.error('Error saving driver:', error);
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
          {id ? t('admin.editDriver') : t('admin.addDriver')}
        </h1>
        <p className="text-muted-foreground">
          {id ? t('driver.editInstructions') : t('driver.createInstructions')}
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
                  <FormLabel>{t('driver.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('driver.slug')}</FormLabel>
                  <FormControl>
                    <Input placeholder="john-doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('driver.nationality')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Greek" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('driver.birthdate')}</FormLabel>
                  <FormControl>
                    <Input placeholder="YYYY-MM-DD" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="championships"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('driver.championships')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                      value={field.value || 0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="podiums"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('driver.podiums')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                      value={field.value || 0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="team_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driver.team')}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('driver.selectTeam')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">{t('driver.noTeam')}</SelectItem>
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
          
          <FormField
            control={form.control}
            name="photo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driver.photo')}</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/photo.jpg" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('driver.bio')}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t('driver.bioPlaceholder')} 
                    className="min-h-[120px]"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/drivers')}
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

export default DriverForm;
