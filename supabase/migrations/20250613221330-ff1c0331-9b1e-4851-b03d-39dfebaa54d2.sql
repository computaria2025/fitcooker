
-- Primeiro, vamos limpar as categorias existentes e adicionar apenas as categorias solicitadas
DELETE FROM public.categorias;

-- Inserir as categorias específicas solicitadas
INSERT INTO public.categorias (nome, descricao, ativa) VALUES
('Cutting', 'Receitas para fase de definição/emagrecimento', true),
('Bulking', 'Receitas para fase de ganho de massa', true),
('Proteico', 'Receitas ricas em proteína', true),
('Pouco/zero carbo', 'Receitas com baixo ou zero carboidrato', true),
('Café da Manhã', 'Receitas para o café da manhã', true),
('Almoço', 'Receitas para o almoço', true),
('Lanche', 'Receitas para lanches', true),
('Jantar', 'Receitas para o jantar', true),
('Sobremesa', 'Receitas de sobremesas', true),
('Pré-treino', 'Receitas para consumo antes do treino', true),
('Sair da Dieta', 'Receitas para momentos de flexibilidade na dieta', true),
('Vegetariano', 'Receitas vegetarianas', true),
('Comida Rápida', 'Receitas de preparo rápido', true);
