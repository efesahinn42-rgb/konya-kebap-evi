import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const fallbackItems = [
  { category: 'misafir', src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800', alt: 'Misafirlerimiz' },
  { category: 'imza', src: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800', alt: 'İmza Lezzetlerimiz' },
];

export function useGalleryItems() {
  return useQuery({
    queryKey: ['galleryItems'],
    queryFn: async () => {
      if (!supabase) return fallbackItems;

      const { data, error } = await supabase
        .from('gallery_items')
        .select('id, category, image_url, alt_text, display_order')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return fallbackItems;
      }

      return data.map(item => ({
        category: item.category,
        src: item.image_url,
        alt: item.alt_text || (item.category === 'misafir' ? 'Misafirlerimiz' : 'İmza Lezzeti')
      }));
    },

  });
}
