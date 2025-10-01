-- Force types regeneration by adding a comment to the table
-- This will trigger Supabase to regenerate the types.ts file correctly
COMMENT ON TABLE public.receitas IS 'Tabela de receitas com informações nutricionais completas';

-- Ensure columns exist with correct definitions (idempotent)
DO $$
BEGIN
  -- Verify fibras_total exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'receitas' 
    AND column_name = 'fibras_total'
  ) THEN
    ALTER TABLE public.receitas ADD COLUMN fibras_total numeric NOT NULL DEFAULT 0;
  END IF;
  
  -- Verify sodio_total exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'receitas' 
    AND column_name = 'sodio_total'
  ) THEN
    ALTER TABLE public.receitas ADD COLUMN sodio_total numeric NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Add helpful comments to the columns
COMMENT ON COLUMN public.receitas.fibras_total IS 'Total de fibras em gramas para a receita completa';
COMMENT ON COLUMN public.receitas.sodio_total IS 'Total de sódio em miligramas para a receita completa';
