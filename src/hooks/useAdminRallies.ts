import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export function useAdminRallies() {
  const [rallies, setRallies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRallies = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('rallies')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      setRallies(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching rallies for admin:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch rallies'));
      setRallies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRallies();
  }, []);

  const getRally = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('rallies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error fetching rally:', err);
      throw err;
    }
  };

  const createRally = async (rally: any) => {
    try {
      const { data, error } = await supabase
        .from('rallies')
        .insert([rally])
        .select();

      if (error) throw error;
      
      toast({
        title: "Rally created",
        description: "The rally has been created successfully",
      });
      
      await fetchRallies();
      return data?.[0];
    } catch (err) {
      console.error('Error creating rally:', err);
      toast({
        title: "Error creating rally",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateRally = async (id: string, rally: any) => {
    try {
      const { data, error } = await supabase
        .from('rallies')
        .update(rally)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      toast({
        title: "Rally updated",
        description: "The rally has been updated successfully",
      });
      
      await fetchRallies();
      return data?.[0];
    } catch (err) {
      console.error('Error updating rally:', err);
      toast({
        title: "Error updating rally",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteRally = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rallies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Rally deleted",
        description: "The rally has been deleted successfully",
      });
      
      await fetchRallies();
      return true;
    } catch (err) {
      console.error('Error deleting rally:', err);
      toast({
        title: "Error deleting rally",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    rallies,
    loading,
    error,
    getRally,
    createRally,
    updateRally,
    deleteRally,
    refresh: fetchRallies,
  };
}