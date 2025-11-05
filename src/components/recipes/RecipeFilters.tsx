// RecipeFilters.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import { Recipe } from '@/types/recipe';

const defaultTimeRange = [0, 181];
const defaultServingsRange = [1, 12];

interface RecipeFiltersProps {
	recipes: Recipe[];
	onFilter: (filtered: Recipe[]) => void;
}

const RecipeFilters: React.FC<RecipeFiltersProps> = ({ recipes, onFilter }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [selectedDifficulty, setSelectedDifficulty] = useState('all');
	const [sortBy, setSortBy] = useState('newest');
	const [timeRange, setTimeRange] = useState(defaultTimeRange);
	const [servingsRange, setServingsRange] = useState(defaultServingsRange);
  const { data: categories } = useCategories();

	// ✅ All filtering + sorting logic centralized here
	const filteredRecipes = useMemo(() => {
    if (!recipes?.length) return [];
		return recipes
			.filter((recipe) => {
				const matchesSearch =
					recipe.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
					recipe.descricao.toLowerCase().includes(searchTerm.toLowerCase());
				const matchesCategory =
					selectedCategory === 'all' ||
					recipe.categories?.some((cat: string) =>
						cat.toLowerCase().includes(selectedCategory.toLowerCase())
					);
				const matchesDifficulty =
					selectedDifficulty === 'all' ||
					recipe.dificuldade?.toLowerCase() === selectedDifficulty.toLowerCase();
				const matchesTime =
					recipe.tempo_preparo >= timeRange[0] &&
					recipe.tempo_preparo <= (timeRange[1] === 181 ? Infinity : timeRange[1]);
				const matchesServings =
					recipe.porcoes >= servingsRange[0] &&
					recipe.porcoes <= servingsRange[1];

				return (
					matchesSearch &&
					matchesCategory &&
					matchesDifficulty &&
					matchesTime &&
					matchesServings
				);
			})
			.sort((a, b) => {
				switch (sortBy) {
					case 'newest':
						return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
					case 'oldest':
						return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
					case 'rating':
						return (b.nota_media || 0) - (a.nota_media || 0);
					case 'time':
						return a.tempo_preparo - b.tempo_preparo;
					default:
						return 0;
				}
			});
	}, [recipes, searchTerm, selectedCategory, selectedDifficulty, sortBy, timeRange, servingsRange]);

  useEffect(() => {
		onFilter(filteredRecipes);
	}, [filteredRecipes, onFilter]);

	const clearFilters = () => {
		setSearchTerm('');
		setSelectedCategory('all');
		setSelectedDifficulty('all');
		setSortBy('newest');
		setTimeRange(defaultTimeRange);
		setServingsRange(defaultServingsRange);
	};

	return (
		<div>
			{/* Controls (simplified — keep your fancy UI here) */}
			<div className="mb-6 flex flex-wrap gap-4 items-center">
				<Input
					placeholder="Buscar receitas..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-64"
				/>
				<Select value={selectedCategory} onValueChange={setSelectedCategory}>
					<SelectTrigger className="w-48">
						<SelectValue placeholder="Categoria" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Todas</SelectItem>
						{categories.map((c) => (
							<SelectItem key={c.id} value={c.nome}>
								{c.nome}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={sortBy} onValueChange={setSortBy}>
					<SelectTrigger className="w-48">
						<SelectValue placeholder="Ordenar" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="newest">Mais recentes</SelectItem>
						<SelectItem value="oldest">Mais antigas</SelectItem>
						<SelectItem value="rating">Melhor avaliadas</SelectItem>
						<SelectItem value="time">Tempo</SelectItem>
					</SelectContent>
				</Select>

				<Button onClick={clearFilters} variant="outline">
					Limpar
				</Button>
			</div>
		</div>
	);
};

export default RecipeFilters;
