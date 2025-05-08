import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export function useAdminResults() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResults = async () => {
    try {
      setLoading(true);
      
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
      
      setResults(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching results for admin:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch results'));
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

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

  const createResult = async (result: any) => {
    try {
      const { data, error } = await supabase
        .from('stage_results')
        .insert([result])
        .select();

      if (error) throw error;
      
      toast({
        title: "Result created",
        description: "The result has been created successfully",
      });
      
      await fetchResults();
      return data?.[0];
    } catch (err) {
      console.error('Error creating result:', err);
      toast({
        title: "Error creating result",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateResult = async (id: string, result: any) => {
    try {
      const { data, error } = await supabase
        .from('stage_results')
        .update(result)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      toast({
        title: "Result updated",
        description: "The result has been updated successfully",
      });
      
      await fetchResults();
      return data?.[0];
    } catch (err) {
      console.error('Error updating result:', err);
      toast({
        title: "Error updating result",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteResult = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stage_results')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Result deleted",
        description: "The result has been deleted successfully",
      });
      
      await fetchResults();
      return true;
    } catch (err) {
      console.error('Error deleting result:', err);
      toast({
        title: "Error deleting result",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    results,
    loading,
    error,
    getResult,
    createResult,
    updateResult,
    deleteResult,
    refresh: fetchResults,
  };
}
