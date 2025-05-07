import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useRallyBySlug(slug: string | undefined) {
  const [rally, setRally] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRally = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('rallies')
          .select(`
            *,
            stages:stages(*)
          `)
          .eq('slug', slug)
          .single();

        if (error) throw error;
        
        setRally(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching rally:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch rally'));
        setRally(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRally();
  }, [slug]);

  return { rally, loading, error };
}