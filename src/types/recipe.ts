
export interface Recipe {
  id: number;
  titulo: string;
  title: string;
  descricao: string;
  description: string;
  imagem_url: string;
  imageUrl: string;
  tempo_preparo: number;
  preparationTime: number;
  porcoes: number;
  servings: number;
  dificuldade: string;
  difficulty: string;
  nota_media: number;
  rating: number;
  avaliacoes_count: number;
  created_at: string;
  usuario_id: string;
  status?: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  categories: string[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Category {
  id: number;
  nome: string;
  descricao?: string;
  ativa: boolean;
  created_at?: string;
}
