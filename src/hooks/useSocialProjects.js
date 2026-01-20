import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const fallbackInitiatives = [
  { title: 'Eğitim Desteği', description: 'Öğrencilere burs programı', image: null },
  { title: 'Gıda Bankası', description: 'İhtiyaç sahiplerine gıda yardımı', image: null },
];

const fallbackStats = [
  { number: '1000+', label: 'Yardım Edilen Aile' },
  { number: '25+', label: 'Toplum Etkinliği' },
];

export function useSocialProjects() {
  const initiativesQuery = useQuery({
    queryKey: ['socialProjects'],
    queryFn: async () => {
      if (!supabase) return fallbackInitiatives;

      const { data, error } = await supabase
        .from('social_projects')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return fallbackInitiatives;
      }

      return data.map(p => ({
        title: p.title,
        description: p.description,
        image: p.image_url
      }));
    },
    staleTime: 5 * 60 * 1000,
  });

  const statsQuery = useQuery({
    queryKey: ['impactStats'],
    queryFn: async () => {
      if (!supabase) return fallbackStats;

      const { data, error } = await supabase
        .from('impact_stats')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return fallbackStats;
      }

      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    initiatives: initiativesQuery.data || fallbackInitiatives,
    impactStats: statsQuery.data || fallbackStats,
    isLoading: initiativesQuery.isLoading || statsQuery.isLoading,
    isError: initiativesQuery.isError || statsQuery.isError,
  };
}
