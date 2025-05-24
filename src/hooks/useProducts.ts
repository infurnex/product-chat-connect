
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, Category } from '@/types/database';

export const useCategories = (chatId?: string | null) => {
  return useQuery({
    queryKey: ['categories', chatId],
    queryFn: async () => {
      if (!chatId) return [];
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('chat_id', chatId)
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    },
    enabled: !!chatId,
  });
};

export const useProducts = (categoryId?: string, chatId?: string | null) => {
  return useQuery({
    queryKey: ['products', categoryId, chatId],
    queryFn: async () => {
      if (!chatId) return [];
      
      // First get categories for this chat
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('id')
        .eq('chat_id', chatId);
      
      if (categoriesError) throw categoriesError;
      
      const categoryIds = categories.map(cat => cat.id);
      if (categoryIds.length === 0) return [];
      
      let query = supabase
        .from('products')
        .select('*')
        .in('category_id', categoryIds)
        .order('name');
      
      if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!chatId,
  });
};
