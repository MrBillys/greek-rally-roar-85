import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useDrivers() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
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
        console.error('Error fetching drivers:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch drivers'));
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  return { drivers, loading, error };
}