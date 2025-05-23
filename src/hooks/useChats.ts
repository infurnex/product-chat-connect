
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Chat } from '@/types/database';
import { toast } from 'sonner';

export const useChats = () => {
  return useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Chat[];
    },
  });
};

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (title: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('chats')
        .insert([{ title, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Chat;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      toast.success('New chat created!');
    },
    onError: (error: any) => {
      toast.error('Failed to create chat: ' + error.message);
    },
  });
};
