import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const fallbackAwards = [
  {
    id: 1,
    title: 'En İyi Kebap',
    year: '2023',
    image_url: null,
    description: 'Yılın en iyi kebap restoranı ödülü',
  }
];

export function useAwards() {
  return useQuery({
    queryKey: ['awards'],
    queryFn: async () => {
      if (!supabase) return fallbackAwards;

      const { data, error } = await supabase
        .from('awards')
        .select('*')
        .eq('is_active', true)
        .order('year', { ascending: false })
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return fallbackAwards;
      }

      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
