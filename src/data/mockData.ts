
export interface Nutrient {
  name: string;
  value: number;
  unit: string;
}

export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  nutrients: Nutrient[];
}

export interface RecipeStep {
  order: number;
  description: string;
}

export enum RecipeCategory {
  BULKING = "Bulking",
  CUTTING = "Cutting",
  CHEATMEAL = "Sair da Dieta",
  SNACK = "Lanches",
  LUNCH = "Almoço",
  DINNER = "Jantar",
  BREAKFAST = "Café da Manhã",
  VEGETARIAN = "Vegetariano",
  VEGAN = "Vegano",
  LOWCARB = "Low Carb",
  HIGHPROTEIN = "Alto Proteína"
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  categories: RecipeCategory[];
  preparationTime: number;
  servings: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  ingredients: Ingredient[];
  steps: RecipeStep[];
  imageUrl: string;
  videoUrl?: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  author: {
    id: number;
    name: string;
    avatarUrl: string;
  };
  rating: number;
  createdAt: string;
}

export interface Cook {
  id: number;
  name: string;
  avatarUrl: string;
  bio: string;
  recipes: number;
  followers: number;
  rating: number;
}

export const featuredRecipes: Recipe[] = [
  {
    id: 1,
    title: "Bowl de Proteína com Frango Grelhado",
    description: "Bowl proteico perfeito para o pós-treino, rico em proteínas e com carboidratos de baixo índice glicêmico.",
    categories: [RecipeCategory.HIGHPROTEIN, RecipeCategory.LUNCH, RecipeCategory.BULKING],
    preparationTime: 25,
    servings: 1,
    difficulty: "Médio",
    ingredients: [
      {
        id: 1,
        name: "Peito de frango",
        quantity: 150,
        unit: "g",
        nutrients: [
          { name: "Proteína", value: 32, unit: "g" },
          { name: "Gordura", value: 3, unit: "g" },
        ]
      },
      {
        id: 2,
        name: "Arroz integral",
        quantity: 100,
        unit: "g",
        nutrients: [
          { name: "Carboidratos", value: 35, unit: "g" },
          { name: "Fibras", value: 4, unit: "g" },
        ]
      },
      {
        id: 3,
        name: "Abacate",
        quantity: 50,
        unit: "g",
        nutrients: [
          { name: "Gordura", value: 7, unit: "g" },
          { name: "Fibras", value: 3, unit: "g" },
        ]
      },
      {
        id: 4,
        name: "Brócolis",
        quantity: 80,
        unit: "g",
        nutrients: [
          { name: "Fibras", value: 2, unit: "g" },
          { name: "Vitamina C", value: 80, unit: "mg" },
        ]
      }
    ],
    steps: [
      { order: 1, description: "Tempere o peito de frango com sal, pimenta e ervas a gosto." },
      { order: 2, description: "Grelhe o frango em fogo médio até dourar ambos os lados e cozinhar por completo." },
      { order: 3, description: "Cozinhe o arroz integral conforme as instruções da embalagem." },
      { order: 4, description: "Cozinhe o brócolis no vapor por 5 minutos." },
      { order: 5, description: "Monte o bowl com o arroz na base, frango fatiado, brócolis e abacate em fatias." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    macros: {
      calories: 450,
      protein: 40,
      carbs: 40,
      fat: 10
    },
    author: {
      id: 1,
      name: "Ana Fitness",
      avatarUrl: "https://i.pravatar.cc/150?img=1"
    },
    rating: 4.8,
    createdAt: "2023-06-15"
  },
  {
    id: 2,
    title: "Smoothie de Banana e Proteína",
    description: "Smoothie rápido e nutritivo, perfeito para o café da manhã ou pré-treino.",
    categories: [RecipeCategory.BREAKFAST, RecipeCategory.SNACK, RecipeCategory.HIGHPROTEIN],
    preparationTime: 5,
    servings: 1,
    difficulty: "Fácil",
    ingredients: [
      {
        id: 1,
        name: "Whey protein",
        quantity: 30,
        unit: "g",
        nutrients: [
          { name: "Proteína", value: 24, unit: "g" },
        ]
      },
      {
        id: 2,
        name: "Banana",
        quantity: 1,
        unit: "unidade",
        nutrients: [
          { name: "Carboidratos", value: 27, unit: "g" },
          { name: "Potássio", value: 400, unit: "mg" },
        ]
      },
      {
        id: 3,
        name: "Leite de amêndoas",
        quantity: 200,
        unit: "ml",
        nutrients: [
          { name: "Cálcio", value: 200, unit: "mg" },
        ]
      },
      {
        id: 4,
        name: "Canela em pó",
        quantity: 1,
        unit: "colher de chá",
        nutrients: []
      }
    ],
    steps: [
      { order: 1, description: "Adicione todos os ingredientes no liquidificador." },
      { order: 2, description: "Bata até obter uma mistura homogênea." },
      { order: 3, description: "Sirva imediatamente." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1600718374662-0483d2b9da44",
    macros: {
      calories: 300,
      protein: 25,
      carbs: 30,
      fat: 5
    },
    author: {
      id: 2,
      name: "Carlos Nutri",
      avatarUrl: "https://i.pravatar.cc/150?img=2"
    },
    rating: 4.5,
    createdAt: "2023-06-20"
  },
  {
    id: 3,
    title: "Salada de Quinoa com Legumes",
    description: "Salada nutritiva rica em proteínas vegetais e fibras, ideal para um almoço leve.",
    categories: [RecipeCategory.VEGETARIAN, RecipeCategory.CUTTING, RecipeCategory.LUNCH],
    preparationTime: 20,
    servings: 2,
    difficulty: "Fácil",
    ingredients: [
      {
        id: 1,
        name: "Quinoa",
        quantity: 100,
        unit: "g",
        nutrients: [
          { name: "Proteína", value: 14, unit: "g" },
          { name: "Carboidratos", value: 39, unit: "g" },
        ]
      },
      {
        id: 2,
        name: "Pepino",
        quantity: 1,
        unit: "unidade",
        nutrients: [
          { name: "Fibras", value: 2, unit: "g" },
        ]
      },
      {
        id: 3,
        name: "Tomate cereja",
        quantity: 10,
        unit: "unidades",
        nutrients: [
          { name: "Vitamina C", value: 20, unit: "mg" },
        ]
      },
      {
        id: 4,
        name: "Azeite de oliva",
        quantity: 1,
        unit: "colher de sopa",
        nutrients: [
          { name: "Gordura", value: 14, unit: "g" },
        ]
      }
    ],
    steps: [
      { order: 1, description: "Cozinhe a quinoa em água com sal por cerca de 15 minutos." },
      { order: 2, description: "Corte o pepino em cubos e os tomates cereja ao meio." },
      { order: 3, description: "Misture os legumes com a quinoa e tempere com azeite, sal e ervas." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    macros: {
      calories: 350,
      protein: 12,
      carbs: 45,
      fat: 15
    },
    author: {
      id: 3,
      name: "Mariana Chef",
      avatarUrl: "https://i.pravatar.cc/150?img=3"
    },
    rating: 4.6,
    createdAt: "2023-06-25"
  },
  {
    id: 4,
    title: "Panqueca Proteica de Aveia",
    description: "Panquecas leves e nutritivas, ricas em proteínas e fibras, perfeitas para o café da manhã.",
    categories: [RecipeCategory.BREAKFAST, RecipeCategory.HIGHPROTEIN, RecipeCategory.LOWCARB],
    preparationTime: 15,
    servings: 1,
    difficulty: "Fácil",
    ingredients: [
      {
        id: 1,
        name: "Aveia em flocos",
        quantity: 50,
        unit: "g",
        nutrients: [
          { name: "Carboidratos", value: 27, unit: "g" },
          { name: "Fibras", value: 5, unit: "g" },
        ]
      },
      {
        id: 2,
        name: "Whey protein",
        quantity: 30,
        unit: "g",
        nutrients: [
          { name: "Proteína", value: 24, unit: "g" },
        ]
      },
      {
        id: 3,
        name: "Claras de ovo",
        quantity: 3,
        unit: "unidades",
        nutrients: [
          { name: "Proteína", value: 10, unit: "g" },
        ]
      },
      {
        id: 4,
        name: "Canela em pó",
        quantity: 1,
        unit: "colher de chá",
        nutrients: []
      }
    ],
    steps: [
      { order: 1, description: "Bata todos os ingredientes no liquidificador até obter uma massa homogênea." },
      { order: 2, description: "Aqueça uma frigideira antiaderente em fogo médio." },
      { order: 3, description: "Despeje uma porção da massa e cozinhe até dourar de ambos os lados." },
      { order: 4, description: "Sirva com frutas ou mel a gosto." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1575853121743-60c24f0a7502",
    macros: {
      calories: 320,
      protein: 35,
      carbs: 30,
      fat: 5
    },
    author: {
      id: 4,
      name: "Pedro Saudável",
      avatarUrl: "https://i.pravatar.cc/150?img=4"
    },
    rating: 4.7,
    createdAt: "2023-07-01"
  }
];

export const topCooks: Cook[] = [
  {
    id: 1,
    name: "Ana Fitness",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    bio: "Chef especializada em receitas de alta proteína e baixo carboidrato.",
    recipes: 45,
    followers: 12800,
    rating: 4.8
  },
  {
    id: 2,
    name: "Carlos Nutri",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
    bio: "Nutricionista esportivo e criador de refeições para ganho muscular.",
    recipes: 32,
    followers: 9500,
    rating: 4.6
  },
  {
    id: 3,
    name: "Mariana Chef",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    bio: "Chef especializada em comida vegetariana rica em proteínas.",
    recipes: 28,
    followers: 8700,
    rating: 4.7
  },
  {
    id: 4,
    name: "Pedro Saudável",
    avatarUrl: "https://i.pravatar.cc/150?img=4",
    bio: "Especialista em sobremesas fitness e opções de baixa caloria.",
    recipes: 37,
    followers: 10200,
    rating: 4.5
  }
];

export const allRecipes: Recipe[] = [...featuredRecipes];
