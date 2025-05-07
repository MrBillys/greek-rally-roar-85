import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useLiveResults() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('stage_results')
          .select(`
            *,
            stage:stages(*),
            rally:rallies(*)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const formattedResults = data?.map(item => ({
          id: item.id,
          stageName: item.stage.name,
          stageId: item.stage_id,
          rallyId: item.rally_id,
          rallyName: item.rally.title,
          date: new Date(item.created_at).toLocaleDateString(),
          results: []
        })) || [];
        
        setResults(formattedResults);
        setError(null);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch results'));
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return { results, loading, error };
}