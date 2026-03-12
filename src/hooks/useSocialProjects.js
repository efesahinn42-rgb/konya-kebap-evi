import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useSocialProjects() {
  const initiativesQuery = useQuery({
    queryKey: ['socialProjects'],
    queryFn: async () => {
      if (!supabase) return [];

      const { data, error } = await supabase
        .from('social_projects')
        .select('id, title, description, image_url, display_order')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return [];
      }

      return data.map(p => ({
        title: p.title,
        description: p.description,
        image: p.image_url
      }));
    },

  });

  const statsQuery = useQuery({
    queryKey: ['impactStats'],
    queryFn: async () => {
      if (!supabase) return [];

      const { data, error } = await supabase
        .from('impact_stats')
        .select('id, number, label, display_order')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return [];
      }

      return data;
    },

  });

  return {
    initiatives: initiativesQuery.data || [],
    impactStats: statsQuery.data || [],
    isLoading: initiativesQuery.isLoading || statsQuery.isLoading,
    isError: initiativesQuery.isError || statsQuery.isError,
  };
}
