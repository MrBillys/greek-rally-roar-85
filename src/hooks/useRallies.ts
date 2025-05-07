import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useRallies() {
  const [rallies, setRallies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRallies = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('rallies')
          .select('*')
          .order('date', { ascending: true });

        if (error) throw error;
        
        setRallies(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching rallies:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch rallies'));
        setRallies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRallies();
  }, []);

  return { rallies, loading, error };
}