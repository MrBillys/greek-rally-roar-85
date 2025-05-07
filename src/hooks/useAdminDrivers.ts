import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export function useAdminDrivers() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('drivers')
        .select(`
          *,
          team:teams(*)
        `)
        .order('name');

      if (error) throw error;
      
      setDrivers(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching drivers for admin:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch drivers'));
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const getDriver = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select(`
          *,
          team:teams(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error fetching driver:', err);
      throw err;
    }
  };

  const createDriver = async (driver: any) => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .insert([driver])
        .select();

      if (error) throw error;
      
      toast({
        title: "Driver created",
        description: "The driver has been created successfully",
      });
      
      await fetchDrivers();
      return data?.[0];
    } catch (err) {
      console.error('Error creating driver:', err);
      toast({
        title: "Error creating driver",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateDriver = async (id: string, driver: any) => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .update(driver)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      toast({
        title: "Driver updated",
        description: "The driver has been updated successfully",
      });
      
      await fetchDrivers();
      return data?.[0];
    } catch (err) {
      console.error('Error updating driver:', err);
      toast({
        title: "Error updating driver",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteDriver = async (id: string) => {
    try {
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Driver deleted",
        description: "The driver has been deleted successfully",
      });
      
      await fetchDrivers();
      return true;
    } catch (err) {
      console.error('Error deleting driver:', err);
      toast({
        title: "Error deleting driver",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    drivers,
    loading,
    error,
    getDriver,
    createDriver,
    updateDriver,
    deleteDriver,
    refresh: fetchDrivers,
  };
}