
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

// Generic Types
interface BaseEntity {
  id: string;
}

// Auth Hooks
export function useAuth() {
  const [user, setUser] = useState(supabase.auth.getUser());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      setUser(await supabase.auth.getUser());
      setLoading(false);
    });

    // Initial session check
    const checkSession = async () => {
      setUser(await supabase.auth.getUser());
      setLoading(false);
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    
    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error };
    }
    
    toast({
      title: "Login successful",
      description: "You are now logged in",
    });
    
    return { success: true, data };
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    
    if (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error };
    }
    
    toast({
      title: "Logout successful",
      description: "You have been logged out",
    });
    
    navigate('/admin/login');
    return { success: true };
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user?.data.user,
  };
}

// Data Hooks for Rallies
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

// Data Hooks for Drivers
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

// CRUD operations for admin panel
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

// Add more admin hooks for teams, cars, etc. as needed...
