
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { on } from 'events';

export interface UserPreferences {
  id: string;
  user_id: string;
  gender?: string;
  country?: string;
  language: string;
  created_at: string;
  updated_at: string;
  age?: number | null;
  name?: string;
  budget?: string | null;
  categories?: string | null;
  brands?: string | null;
  eco?: string | null; // 'yes', 'no', 'no-preference'
  shipping?: string | null; // 'yes', 'no', 'no-preference'
}

export const useUserPreferences = () => {
  return useQuery({
    queryKey: ['user-preferences'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as UserPreferences | null;
    },
  });
};

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (preferences: Partial<Pick<UserPreferences, 'gender' | 'country' | 'language' | "age" | "name"| "budget" | "categories" | "eco" | "shipping" | "brands" >>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString()
        }, {onConflict : 'user_id'})
        .select()
        .single();
      
      if (error) throw error;
      return data as UserPreferences;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
      toast.success('Preferences updated successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to update preferences: ' + error.message);
    },
  });
};
