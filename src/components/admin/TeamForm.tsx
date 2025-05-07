
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

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  logo_url: z.string().url().optional().or(z.literal('')),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
});

type FormValues = z.infer<typeof formSchema>;

const TeamForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      country: '',
      logo_url: '',
      slug: '',
    },
  });

  useEffect(() => {
    const fetchTeam = async () => {
      if (!id) return;
      
      setInitialLoading(true);
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          form.reset({
            name: data.name,
            country: data.country,
            logo_url: data.logo_url || '',
            slug: data.slug,
          });
        }
      } catch (error) {
        console.error('Error fetching team:', error);
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: String(error),
        });
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchTeam();
  }, [id, form, t]);
  
  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const formData = {
        name: values.name,
        country: values.country,
        logo_url: values.logo_url || null,
        slug: values.slug,
      };
      
      let response;
      
      if (id) {
        // Update existing team
        response = await supabase
          .from('teams')
          .update(formData)
          .eq('id', id);
      } else {
        // Create new team
        response = await supabase
          .from('teams')
          .insert([formData]);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: id ? t('common.success') : t('common.success'),
        description: id ? t('team.updateSuccess') : t('team.createSuccess'),
      });
      
      navigate('/admin/teams');
    } catch (error) {
      console.error('Error saving team:', error);
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
          {id ? t('admin.editTeam') : t('admin.addTeam')}
        </h1>
        <p className="text-muted-foreground">
          {id ? t('team.editInstructions') : t('team.createInstructions')}
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
                  <FormLabel>{t('team.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('team.namePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('team.country')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('team.countryPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="logo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('team.logo')}</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/logo.png" {...field} />
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
                <FormLabel>{t('team.slug')}</FormLabel>
                <FormControl>
                  <Input placeholder="team-slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/teams')}
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

export default TeamForm;
