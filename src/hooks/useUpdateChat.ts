
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUpdateChat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ chatId, title }: { chatId: string; title: string }) => {
      const { data, error } = await supabase
        .from('chats')
        .update({ title })
        .eq('id', chatId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      toast.success('Chat name updated!');
    },
    onError: (error: any) => {
      toast.error('Failed to update chat: ' + error.message);
    },
  });
};
