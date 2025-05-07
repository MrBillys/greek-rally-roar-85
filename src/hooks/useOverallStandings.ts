import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useOverallStandings() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        
        const { data: rallyData, error: rallyError } = await supabase
          .from('rallies')
          .select('*')
          .eq('status', 'in-progress');

        if (rallyError) throw rallyError;
        
        const standingsData = rallyData?.map(rally => ({
          rallyId: rally.id,
          standings: []
        })) || [];
        
        setStandings(standingsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching standings:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch standings'));
        setStandings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  return { standings, loading, error };
}