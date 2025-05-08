
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useAdminResults() {
  // Use react-query for better data fetching and cache management
  const queryClient = useQueryClient();
  
  const { 
    data: results = [], 
    isLoading: loading, 
    error 
  } = useQuery({
    queryKey: ['admin', 'results'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stage_results')
        .select(`
          *,
          stage:stages(*),
          driver:drivers!stage_results_driver_id_fkey(id, name),
          co_driver:drivers!stage_results_co_driver_id_fkey(id, name),
          rally:rallies(id, title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const getResult = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('stage_results')
        .select(`
          *,
          stage:stages(*),
          driver:drivers!stage_results_driver_id_fkey(id, name),
          co_driver:drivers!stage_results_co_driver_id_fkey(id, name),
          rally:rallies(id, title)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error fetching result:', err);
      throw err;
    }
  };

  const createResultMutation = useMutation({
    mutationFn: async (result: any) => {
      const { data, error } = await supabase
        .from('stage_results')
        .insert([result])
        .select();

      if (error) throw error;
      return data?.[0];
    },
    onSuccess: () => {
      toast({
        title: "Result created",
        description: "The result has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'results'] });
    },
    onError: (err) => {
      console.error('Error creating result:', err);
      toast({
        title: "Error creating result",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  const updateResultMutation = useMutation({
    mutationFn: async ({ id, result }: { id: string, result: any }) => {
      const { data, error } = await supabase
        .from('stage_results')
        .update(result)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    },
    onSuccess: () => {
      toast({
        title: "Result updated",
        description: "The result has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'results'] });
    },
    onError: (err) => {
      console.error('Error updating result:', err);
      toast({
        title: "Error updating result",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  const deleteResultMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stage_results')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Result deleted",
        description: "The result has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'results'] });
    },
    onError: (err) => {
      console.error('Error deleting result:', err);
      toast({
        title: "Error deleting result",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  return {
    results,
    loading,
    error: error as Error | null,
    getResult,
    createResult: createResultMutation.mutateAsync,
    updateResult: (id: string, result: any) => updateResultMutation.mutateAsync({ id, result }),
    deleteResult: deleteResultMutation.mutateAsync,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['admin', 'results'] }),
  };
}
