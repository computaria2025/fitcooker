-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  data_nascimento DATE,
  peso DECIMAL(5,2),
  altura DECIMAL(5,2),
  nivel_atividade TEXT CHECK (nivel_atividade IN ('sedentario', 'leve', 'moderado', 'ativo', 'muito_ativo')),
  objetivo TEXT CHECK (objetivo IN ('perder_peso', 'manter_peso', 'ganhar_peso', 'ganhar_massa')),
  restricoes_alimentares TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categorias (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  ativa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ingredients table
CREATE TABLE public.ingredientes (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  calorias_por_100g DECIMAL(8,2) NOT NULL DEFAULT 0,
  proteinas_por_100g DECIMAL(8,2) NOT NULL DEFAULT 0,
  carboidratos_por_100g DECIMAL(8,2) NOT NULL DEFAULT 0,
  gorduras_por_100g DECIMAL(8,2) NOT NULL DEFAULT 0,
  fibras_por_100g DECIMAL(8,2) NOT NULL DEFAULT 0,
  sodio_por_100g DECIMAL(8,2) NOT NULL DEFAULT 0,
  unidade_padrao TEXT NOT NULL DEFAULT 'g',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recipes table
CREATE TABLE public.receitas (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  video_url TEXT,
  tempo_preparo INTEGER NOT NULL, -- em minutos
  porcoes INTEGER NOT NULL,
  dificuldade TEXT NOT NULL CHECK (dificuldade IN ('Fácil', 'Médio', 'Difícil')),
  calorias_total DECIMAL(8,2) NOT NULL DEFAULT 0,
  proteinas_total DECIMAL(8,2) NOT NULL DEFAULT 0,
  carboidratos_total DECIMAL(8,2) NOT NULL DEFAULT 0,
  gorduras_total DECIMAL(8,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'inativa', 'pendente')),
  nota_media DECIMAL(3,2) NOT NULL DEFAULT 0,
  avaliacoes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recipe categories junction table
CREATE TABLE public.receita_categorias (
  id SERIAL PRIMARY KEY,
  receita_id INTEGER NOT NULL REFERENCES public.receitas(id) ON DELETE CASCADE,
  categoria_id INTEGER NOT NULL REFERENCES public.categorias(id) ON DELETE CASCADE,
  UNIQUE(receita_id, categoria_id)
);

-- Create recipe ingredients table
CREATE TABLE public.receita_ingredientes (
  id SERIAL PRIMARY KEY,
  receita_id INTEGER NOT NULL REFERENCES public.receitas(id) ON DELETE CASCADE,
  ingrediente_id INTEGER NOT NULL REFERENCES public.ingredientes(id) ON DELETE CASCADE,
  quantidade DECIMAL(8,2) NOT NULL,
  unidade TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 1
);

-- Create recipe steps table
CREATE TABLE public.receita_passos (
  id SERIAL PRIMARY KEY,
  receita_id INTEGER NOT NULL REFERENCES public.receitas(id) ON DELETE CASCADE,
  numero_passo INTEGER NOT NULL,
  titulo TEXT,
  descricao TEXT NOT NULL,
  tempo_estimado INTEGER, -- em minutos
  imagem_url TEXT,
  UNIQUE(receita_id, numero_passo)
);

-- Create ratings table
CREATE TABLE public.avaliacoes (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receita_id INTEGER NOT NULL REFERENCES public.receitas(id) ON DELETE CASCADE,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, receita_id)
);

-- Create saved recipes table
CREATE TABLE public.receitas_salvas (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receita_id INTEGER NOT NULL REFERENCES public.receitas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, receita_id)
);

-- Create followers table
CREATE TABLE public.seguidores (
  id SERIAL PRIMARY KEY,
  seguidor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seguido_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(seguidor_id, seguido_id),
  CHECK (seguidor_id != seguido_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receita_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receita_ingredientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receita_passos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receitas_salvas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seguidores ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for categories (public read access)
CREATE POLICY "Categories are viewable by everyone" ON public.categorias FOR SELECT USING (ativa = true);

-- Create RLS policies for ingredients (public read access)
CREATE POLICY "Ingredients are viewable by everyone" ON public.ingredientes FOR SELECT USING (true);

-- Create RLS policies for recipes
CREATE POLICY "Published recipes are viewable by everyone" ON public.receitas FOR SELECT USING (status = 'ativa');
CREATE POLICY "Users can create their own recipes" ON public.receitas FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Users can update their own recipes" ON public.receitas FOR UPDATE USING (auth.uid() = usuario_id);
CREATE POLICY "Users can delete their own recipes" ON public.receitas FOR DELETE USING (auth.uid() = usuario_id);

-- Create RLS policies for recipe categories
CREATE POLICY "Recipe categories are viewable by everyone" ON public.receita_categorias FOR SELECT USING (true);
CREATE POLICY "Recipe owners can manage their recipe categories" ON public.receita_categorias FOR ALL USING (
  EXISTS (SELECT 1 FROM public.receitas WHERE id = receita_id AND usuario_id = auth.uid())
);

-- Create RLS policies for recipe ingredients
CREATE POLICY "Recipe ingredients are viewable by everyone" ON public.receita_ingredientes FOR SELECT USING (true);
CREATE POLICY "Recipe owners can manage their recipe ingredients" ON public.receita_ingredientes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.receitas WHERE id = receita_id AND usuario_id = auth.uid())
);

-- Create RLS policies for recipe steps
CREATE POLICY "Recipe steps are viewable by everyone" ON public.receita_passos FOR SELECT USING (true);
CREATE POLICY "Recipe owners can manage their recipe steps" ON public.receita_passos FOR ALL USING (
  EXISTS (SELECT 1 FROM public.receitas WHERE id = receita_id AND usuario_id = auth.uid())
);

-- Create RLS policies for ratings
CREATE POLICY "Ratings are viewable by everyone" ON public.avaliacoes FOR SELECT USING (true);
CREATE POLICY "Users can create ratings" ON public.avaliacoes FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Users can update their own ratings" ON public.avaliacoes FOR UPDATE USING (auth.uid() = usuario_id);
CREATE POLICY "Users can delete their own ratings" ON public.avaliacoes FOR DELETE USING (auth.uid() = usuario_id);

-- Create RLS policies for saved recipes
CREATE POLICY "Users can view their own saved recipes" ON public.receitas_salvas FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Users can save recipes" ON public.receitas_salvas FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Users can unsave their recipes" ON public.receitas_salvas FOR DELETE USING (auth.uid() = usuario_id);

-- Create RLS policies for followers
CREATE POLICY "Users can view all followers relationships" ON public.seguidores FOR SELECT USING (true);
CREATE POLICY "Users can create follow relationships" ON public.seguidores FOR INSERT WITH CHECK (auth.uid() = seguidor_id);
CREATE POLICY "Users can delete their own follow relationships" ON public.seguidores FOR DELETE USING (auth.uid() = seguidor_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_receitas_updated_at
  BEFORE UPDATE ON public.receitas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_avaliacoes_updated_at
  BEFORE UPDATE ON public.avaliacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', 'Usuário')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update recipe rating
CREATE OR REPLACE FUNCTION public.update_recipe_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Update recipe rating when a rating is added, updated, or deleted
  WITH rating_stats AS (
    SELECT 
      COALESCE(AVG(nota), 0) as avg_rating,
      COUNT(*) as rating_count
    FROM public.avaliacoes 
    WHERE receita_id = COALESCE(NEW.receita_id, OLD.receita_id)
  )
  UPDATE public.receitas 
  SET 
    nota_media = (SELECT avg_rating FROM rating_stats),
    avaliacoes_count = (SELECT rating_count FROM rating_stats)
  WHERE id = COALESCE(NEW.receita_id, OLD.receita_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers for rating updates
CREATE TRIGGER update_recipe_rating_on_insert
  AFTER INSERT ON public.avaliacoes
  FOR EACH ROW EXECUTE FUNCTION public.update_recipe_rating();

CREATE TRIGGER update_recipe_rating_on_update
  AFTER UPDATE ON public.avaliacoes
  FOR EACH ROW EXECUTE FUNCTION public.update_recipe_rating();

CREATE TRIGGER update_recipe_rating_on_delete
  AFTER DELETE ON public.avaliacoes
  FOR EACH ROW EXECUTE FUNCTION public.update_recipe_rating();

-- Insert default categories
INSERT INTO public.categorias (nome, descricao) VALUES
('Café da Manhã', 'Receitas para começar bem o dia'),
('Almoço', 'Pratos principais para o almoço'),
('Jantar', 'Receitas para o jantar'),
('Lanches', 'Opções de lanches saudáveis'),
('Sobremesas', 'Doces e sobremesas fit'),
('Bebidas', 'Sucos, vitaminas e drinks saudáveis'),
('Saladas', 'Saladas nutritivas e saborosas'),
('Proteínas', 'Pratos ricos em proteína'),
('Low Carb', 'Receitas com baixo teor de carboidratos'),
('Vegano', 'Receitas 100% vegetais'),
('Vegetariano', 'Receitas sem carne'),
('Sem Glúten', 'Receitas livres de glúten'),
('Sem Lactose', 'Receitas sem lácteos'),
('Fitness', 'Receitas para quem treina'),
('Detox', 'Receitas desintoxicantes');

-- Insert common ingredients
INSERT INTO public.ingredientes (nome, calorias_por_100g, proteinas_por_100g, carboidratos_por_100g, gorduras_por_100g) VALUES
('Peito de Frango', 165, 31, 0, 3.6),
('Arroz Integral', 123, 2.6, 23, 0.9),
('Batata Doce', 86, 1.6, 20, 0.1),
('Ovos', 155, 13, 1.1, 11),
('Aveia', 389, 16.9, 66, 6.9),
('Banana', 89, 1.1, 23, 0.3),
('Brócolis', 34, 2.8, 7, 0.4),
('Salmão', 208, 20, 0, 13),
('Quinoa', 368, 14.1, 64, 6.1),
('Azeite de Oliva', 884, 0, 0, 100);