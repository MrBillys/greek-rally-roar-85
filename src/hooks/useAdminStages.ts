import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export function useAdminStages() {
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStages = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('stages')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      setStages(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching stages for admin:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch stages'));
      setStages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  const getStage = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('stages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error fetching stage:', err);
      throw err;
    }
  };

  const createStage = async (stage: any) => {
    try {
      const { data, error } = await supabase
        .from('stages')
        .insert([stage])
        .select();

      if (error) throw error;
      
      toast({
        title: "Stage created",
        description: "The stage has been created successfully",
      });
      
      await fetchStages();
      return data?.[0];
    } catch (err) {
      console.error('Error creating stage:', err);
      toast({
        title: "Error creating stage",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateStage = async (id: string, stage: any) => {
    try {
      const { data, error } = await supabase
        .from('stages')
        .update(stage)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      toast({
        title: "Stage updated",
        description: "The stage has been updated successfully",
      });
      
      await fetchStages();
      return data?.[0];
    } catch (err) {
      console.error('Error updating stage:', err);
      toast({
        title: "Error updating stage",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteStage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Stage deleted",
        description: "The stage has been deleted successfully",
      });
      
      await fetchStages();
      return true;
    } catch (err) {
      console.error('Error deleting stage:', err);
      toast({
        title: "Error deleting stage",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    stages,
    loading,
    error,
    getStage,
    createStage,
    updateStage,
    deleteStage,
    refresh: fetchStages,
  };
}