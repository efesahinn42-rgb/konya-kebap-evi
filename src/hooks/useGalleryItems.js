import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useGalleryItems() {
  return useQuery({
    queryKey: ['galleryItems'],
    queryFn: async () => {
      if (!supabase) return [];

      const { data, error } = await supabase
        .from('gallery_items')
        .select('id, category, image_url, alt_text, display_order')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return [];
      }

      return data.map(item => ({
        category: item.category,
        src: item.image_url,
        alt: item.alt_text || (item.category === 'misafir' ? 'Misafirlerimiz' : 'İmza Lezzeti')
      }));
    },

  });
}
