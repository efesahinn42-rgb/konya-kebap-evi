import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const defaultSlide = {
  image_url: '/images/slide-one.png',
  alt_text: 'Konya Kebap Evi'
};

export function useHeroSlides() {
  return useQuery({
    queryKey: ['heroSlides'],
    queryFn: async () => {
      if (!supabase) return [defaultSlide];

      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return [defaultSlide];
      }

      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
