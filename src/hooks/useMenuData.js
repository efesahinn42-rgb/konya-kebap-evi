import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const fallbackData = [
  {
    id: 1,
    title: 'Kebap Çeşitleri',
    icon: '🍖',
    items: [
      { name: 'Adana Kebap', price: '150.00', description: 'Acılı kıyma kebap', image: null },
      { name: 'Urfa Kebap', price: '150.00', description: 'Acısız kıyma kebap', image: null },
    ]
  }
];

export function useMenuData() {
  return useQuery({
    queryKey: ['menuData'],
    queryFn: async () => {
      if (!supabase) return fallbackData;

      // Fetch categories
      const { data: categories, error: catError } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (catError || !categories || categories.length === 0) {
        return fallbackData;
      }

      // Fetch all menu items
      const { data: items, error: itemError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (itemError) {
        return fallbackData;
      }

      // Combine categories with their items
      const transformedData = categories.map(cat => ({
        id: cat.id,
        title: cat.title,
        icon: cat.icon || '🍽️',
        items: (items || [])
          .filter(item => item.category_id === cat.id)
          .map(item => ({
            name: item.name,
            price: parseFloat(item.price).toFixed(2),
            description: item.description || '',
            image: item.image_url
          }))
      }));

      return transformedData.length > 0 ? transformedData : fallbackData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
