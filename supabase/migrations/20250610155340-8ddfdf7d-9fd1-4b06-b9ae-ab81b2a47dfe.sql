
-- Add preferences column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferencias TEXT[];

-- Create table for recipe ratings/reviews
CREATE TABLE IF NOT EXISTS public.avaliacoes (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receita_id INTEGER NOT NULL REFERENCES public.receitas(id) ON DELETE CASCADE,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, receita_id)
);

-- Create table for saved recipes
CREATE TABLE IF NOT EXISTS public.receitas_salvas (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receita_id INTEGER NOT NULL REFERENCES public.receitas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, receita_id)
);

-- Enable RLS on new tables
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receitas_salvas ENABLE ROW LEVEL SECURITY;

-- RLS policies for avaliacoes
CREATE POLICY "Users can view all reviews" ON public.avaliacoes
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own reviews" ON public.avaliacoes
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update their own reviews" ON public.avaliacoes
  FOR UPDATE USING (auth.uid() = usuario_id);

CREATE POLICY "Users can delete their own reviews" ON public.avaliacoes
  FOR DELETE USING (auth.uid() = usuario_id);

-- RLS policies for receitas_salvas
CREATE POLICY "Users can view their own saved recipes" ON public.receitas_salvas
  FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Users can save recipes" ON public.receitas_salvas
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can delete their own saved recipes" ON public.receitas_salvas
  FOR DELETE USING (auth.uid() = usuario_id);

-- Create storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for avatar storage
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can update their own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars');

-- Function to update recipe ratings automatically
CREATE OR REPLACE FUNCTION update_recipe_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.receitas 
  SET 
    nota_media = (
      SELECT AVG(nota)::DECIMAL(3,2)
      FROM public.avaliacoes 
      WHERE receita_id = COALESCE(NEW.receita_id, OLD.receita_id)
    ),
    avaliacoes_count = (
      SELECT COUNT(*)
      FROM public.avaliacoes 
      WHERE receita_id = COALESCE(NEW.receita_id, OLD.receita_id)
    )
  WHERE id = COALESCE(NEW.receita_id, OLD.receita_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic rating updates
DROP TRIGGER IF EXISTS trigger_update_recipe_rating_insert ON public.avaliacoes;
DROP TRIGGER IF EXISTS trigger_update_recipe_rating_update ON public.avaliacoes;
DROP TRIGGER IF EXISTS trigger_update_recipe_rating_delete ON public.avaliacoes;

CREATE TRIGGER trigger_update_recipe_rating_insert
  AFTER INSERT ON public.avaliacoes
  FOR EACH ROW EXECUTE FUNCTION update_recipe_rating();

CREATE TRIGGER trigger_update_recipe_rating_update
  AFTER UPDATE ON public.avaliacoes
  FOR EACH ROW EXECUTE FUNCTION update_recipe_rating();

CREATE TRIGGER trigger_update_recipe_rating_delete
  AFTER DELETE ON public.avaliacoes
  FOR EACH ROW EXECUTE FUNCTION update_recipe_rating();
