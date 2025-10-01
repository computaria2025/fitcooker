-- Force types.ts regeneration by creating an index
-- This is a performance optimization that will also trigger type regeneration

CREATE INDEX IF NOT EXISTS idx_receitas_usuario_status 
ON public.receitas(usuario_id, status) 
WHERE status = 'ativa';

-- Add index for better query performance on nutritional values
CREATE INDEX IF NOT EXISTS idx_receitas_nutritional 
ON public.receitas(calorias_total, proteinas_total) 
WHERE status = 'ativa';

-- Update table comment to ensure types are refreshed
COMMENT ON TABLE public.receitas IS 'Tabela de receitas com informações nutricionais completas - Updated for type sync';
