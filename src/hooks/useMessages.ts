
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/database';
import { toast } from 'sonner';

export const useMessages = (chatId: string | null) => {
  return useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      if (!chatId) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!chatId,
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ chatId, role, content }: { chatId: string; role: 'user' | 'assistant'; content: string }) => {
      const { data, error } = await supabase
        .from('messages')
        .insert([{ chat_id: chatId, role, content }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['messages', data.chat_id] });
    },
    onError: (error: any) => {
      toast.error('Failed to send message: ' + error.message);
    },
  });
};
