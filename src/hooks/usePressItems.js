import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const fallbackPressItems = [
  {
    id: 1,
    outlet: 'Yemek.com',
    external_url: 'https://yemek.com',
    quote: 'Konya\'nın en iyi kebap restoranı',
    color: '#d4af37',
    date: new Date().toISOString(),
  }
];

export function usePressItems() {
  return useQuery({
    queryKey: ['pressItems'],
    queryFn: async () => {
      if (!supabase) return fallbackPressItems;

      const { data, error } = await supabase
        .from('press_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return fallbackPressItems;
      }

      return data.map(item => ({
        id: item.id,
        outlet: item.outlet,
        external_url: item.external_url,
        quote: item.quote,
        color: item.color || '#d4af37',
        date: item.date || item.published_at,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
