
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Category {
  id: number;
  nome: string;
  descricao?: string;
  ativa: boolean;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('ativa', true)
        .order('nome');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const suggestCategory = async (nome: string, descricao?: string) => {
    try {
      const { error } = await supabase
        .from('categorias')
        .insert({
          nome,
          descricao,
          ativa: false // Categoria sugerida fica inativa até aprovação
        });

      if (error) {
        console.error('Error suggesting category:', error);
        throw error;
      }

      toast.success('Sugestão de categoria enviada com sucesso!');
      return { error: null };
    } catch (error) {
      console.error('Error suggesting category:', error);
      toast.error('Erro ao enviar sugestão de categoria');
      return { error };
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    fetchCategories,
    suggestCategory
  };
}
