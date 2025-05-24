
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
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

// Real-time hook for categories
export const useCategoriesRealtime = (chatId?: string | null) => {
  const query = useCategories(chatId);

  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
          filter: `chat_id=eq.${chatId}`
        },
        () => {
          query.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, query]);

  return query;
};

// Real-time hook for products
export const useProductsRealtime = (categoryId?: string, chatId?: string | null) => {
  const query = useProducts(categoryId, chatId);

  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          // Only refetch if the change is relevant to this chat
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            // We need to check if this product belongs to a category in this chat
            query.refetch();
          } else if (payload.eventType === 'DELETE') {
            query.refetch();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [categoryId, chatId, query]);

  return query;
};
