import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const fallbackPositions = [
  {
    id: 1,
    title: 'Aşçı',
    department: 'Mutfak',
    location: 'Konya',
    type: 'Tam Zamanlı',
    description: 'Deneyimli aşçı aranıyor',
    requirements: 'En az 3 yıl deneyim',
    is_active: true,
  }
];

export function useJobPositions() {
  return useQuery({
    queryKey: ['jobPositions'],
    queryFn: async () => {
      if (!supabase) return fallbackPositions;

      const { data, error } = await supabase
        .from('job_positions')
        .select('id, title, department, location, type, description, requirements')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return fallbackPositions;
      }

      return data;
    },

  });
}
