-- Create function for atomic recipe creation
CREATE OR REPLACE FUNCTION public.create_recipe_transaction(
  p_titulo text,
  p_descricao text,
  p_tempo_preparo integer,
  p_porcoes integer,
  p_dificuldade text,
  p_imagem_url text DEFAULT NULL,
  p_video_url text DEFAULT NULL,
  p_usuario_id uuid,
  p_ingredientes jsonb,
  p_passos jsonb,
  p_categorias integer[],
  p_calorias_total numeric DEFAULT 0,
  p_proteinas_total numeric DEFAULT 0,
  p_carboidratos_total numeric DEFAULT 0,
  p_gorduras_total numeric DEFAULT 0
) RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_receita_id integer;
  v_ingrediente jsonb;
  v_passo jsonb;
  v_categoria_id integer;
  v_ingrediente_id integer;
BEGIN
  -- Insert recipe
  INSERT INTO public.receitas (
    titulo,
    descricao,
    tempo_preparo,
    porcoes,
    dificuldade,
    imagem_url,
    video_url,
    usuario_id,
    calorias_total,
    proteinas_total,
    carboidratos_total,
    gorduras_total
  ) VALUES (
    p_titulo,
    p_descricao,
    p_tempo_preparo,
    p_porcoes,
    p_dificuldade,
    p_imagem_url,
    p_video_url,
    p_usuario_id,
    p_calorias_total,
    p_proteinas_total,
    p_carboidratos_total,
    p_gorduras_total
  ) RETURNING id INTO v_receita_id;

  -- Insert ingredients
  FOR v_ingrediente IN SELECT * FROM jsonb_array_elements(p_ingredientes)
  LOOP
    -- Check if ingredient exists, if not create it
    SELECT id INTO v_ingrediente_id
    FROM public.ingredientes
    WHERE nome = (v_ingrediente->>'nome');
    
    IF v_ingrediente_id IS NULL THEN
      INSERT INTO public.ingredientes (
        nome,
        unidade_padrao,
        proteinas_por_100g,
        carboidratos_por_100g,
        gorduras_por_100g,
        calorias_por_100g
      ) VALUES (
        v_ingrediente->>'nome',
        'g',
        (v_ingrediente->>'proteinas_por_100g')::numeric,
        (v_ingrediente->>'carboidratos_por_100g')::numeric,
        (v_ingrediente->>'gorduras_por_100g')::numeric,
        (v_ingrediente->>'calorias_por_100g')::numeric
      ) RETURNING id INTO v_ingrediente_id;
    END IF;
    
    -- Link ingredient to recipe
    INSERT INTO public.receita_ingredientes (
      receita_id,
      ingrediente_id,
      quantidade,
      unidade,
      ordem
    ) VALUES (
      v_receita_id,
      v_ingrediente_id,
      (v_ingrediente->>'quantidade')::numeric,
      v_ingrediente->>'unidade',
      (v_ingrediente->>'ordem')::integer
    );
  END LOOP;

  -- Insert steps
  FOR v_passo IN SELECT * FROM jsonb_array_elements(p_passos)
  LOOP
    INSERT INTO public.receita_passos (
      receita_id,
      numero_passo,
      descricao
    ) VALUES (
      v_receita_id,
      (v_passo->>'numero_passo')::integer,
      v_passo->>'descricao'
    );
  END LOOP;

  -- Insert categories
  FOREACH v_categoria_id IN ARRAY p_categorias
  LOOP
    INSERT INTO public.receita_categorias (
      receita_id,
      categoria_id
    ) VALUES (
      v_receita_id,
      v_categoria_id
    );
  END LOOP;

  RETURN v_receita_id;
END;
$$;