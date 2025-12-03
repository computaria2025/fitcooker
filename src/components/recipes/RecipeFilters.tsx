import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, X, Clock, Users, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useCategories } from '@/hooks/useCategories';
import { Recipe } from '@/types/recipe';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

const defaultTimeRange = [0, 181];
const defaultServingsRange = [1, 12];

interface RecipeFiltersProps {
	recipes: Recipe[];
	onFilter: (filtered: Recipe[]) => void;
	user: User | null;
}

const RecipeFilters: React.FC<RecipeFiltersProps> = ({ recipes, onFilter, user }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const { data: categories } = useCategories();
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [selectedDifficulty, setSelectedDifficulty] = useState('all');
	const [sortBy, setSortBy] = useState('newest');
	const [timeRange, setTimeRange] = useState(defaultTimeRange);
	const [servingsRange, setServingsRange] = useState(defaultServingsRange);
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [allAllergenics, setAllAllergenics] = useState<string[]>([]);
	const [selectedAllergenics, setSelectedAllergenics] = useState<string[]>([]);
	const [userAllergies, setUserAllergies] = useState<string[]>([]);
	const [useAllergyFilter, setUseAllergyFilter] = useState(true);

	useEffect(() => {
		if (!user) return;
		const fetchAllergies = async () => {
			const { data, error } = await supabase
				.from('user_alergenio')
				.select('alergenios(name)')
				.eq('usuario', user.id);
	
			if (error) console.error(error);
			else {
				const allergies = data.map((a) => a.alergenios.name);
				setUserAllergies(allergies);
				setSelectedAllergenics(allergies);
			}
		};

		const fetchAllergenics = async () => {
			const { data, error } = await supabase
				.from('alergenios')
				.select('name');
	
			if (error) console.error(error);
			else {
				const allergenics = data.map((a) => a.name);
				setAllAllergenics(allergenics);
			}
		};
	
		fetchAllergies();
		fetchAllergenics();
	}, [user]);
	
	// Filter + sort logic
	const filteredRecipes = useMemo(() => {
		if (!recipes?.length) return [];

		return recipes
			.filter((recipe) => {
				const matchesSearch =
					recipe.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
					recipe.descricao.toLowerCase().includes(searchTerm.toLowerCase());
				const matchesCategory =
					selectedCategory === 'all' ||
					recipe.categories?.some((cat) =>
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
				const alergens = new Set(recipe.alergens);
				const intersect = selectedAllergenics.filter(al => alergens.has(al));
				const matchesAllergenics = !(useAllergyFilter && intersect.length > 0);
				return (
					matchesSearch &&
					matchesCategory &&
					matchesDifficulty &&
					matchesTime &&
					matchesServings &&
					matchesAllergenics
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
	}, [recipes, searchTerm, selectedCategory, selectedDifficulty, sortBy, timeRange, servingsRange, selectedAllergenics, useAllergyFilter]);

	useEffect(() => {
		onFilter(filteredRecipes);
	}, [filteredRecipes, onFilter]);

	const hasActiveFilters =
		searchTerm ||
		selectedCategory !== 'all' ||
		selectedDifficulty !== 'all' ||
		timeRange[0] > defaultTimeRange[0] ||
		timeRange[1] < defaultTimeRange[1] ||
		servingsRange[0] > defaultServingsRange[0] ||
		servingsRange[1] < defaultServingsRange[1] ||
		(useAllergyFilter && selectedAllergenics.length);

	const clearFilters = () => {
		setSearchTerm('');
		setSelectedCategory('all');
		setSelectedDifficulty('all');
		setSortBy('newest');
		setTimeRange(defaultTimeRange);
		setServingsRange(defaultServingsRange);
		setSelectedAllergenics(userAllergies);
		setUseAllergyFilter(true);
	};

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative mb-12">
			<div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-white to-orange-50 rounded-3xl"></div>
			<div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>

			<div className="relative p-8">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center space-x-3">
						<div className="w-12 h-12 bg-gradient-to-r from-fitcooker-orange to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
							<Filter className="w-6 h-6 text-white" />
						</div>
						<div>
							<h3 className="text-xl font-bold text-gray-900">Filtros Inteligentes</h3>
							<p className="text-gray-600 text-sm">Encontre a receita perfeita</p>
						</div>
					</div>
					<Button
						onClick={() => setShowAdvanced(!showAdvanced)}
						variant="outline"
						size="sm"
						className="border-2 border-fitcooker-orange/20 hover:bg-fitcooker-orange/10"
					>
						<SlidersHorizontal className="w-4 h-4 mr-2" />
						{showAdvanced ? 'Ocultar' : 'Avançado'}
					</Button>
				</div>

				{/* Main Filters */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
					{/* Search */}
					<div className="lg:col-span-2">
						<div className="relative group">
							<div className="absolute inset-0 bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
							<div className="relative bg-white rounded-xl border-2 border-transparent group-hover:border-fitcooker-orange/30 transition-all duration-300">
								<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-fitcooker-orange w-5 h-5" />
								<Input
									type="text"
									placeholder="Buscar receitas por nome, ingredientes..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-12 py-3 text-lg border-0 focus-visible:ring-0 bg-transparent"
								/>
								{searchTerm && (
									<button
										onClick={() => setSearchTerm('')}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
									>
										<X className="w-4 h-4" />
									</button>
								)}
							</div>
						</div>
					</div>

					{/* Category */}
					<Select value={selectedCategory} onValueChange={setSelectedCategory}>
						<SelectTrigger className="border-2 border-fitcooker-orange/20 focus:border-fitcooker-orange rounded-xl py-3 hover:border-fitcooker-orange/40 transition-colors">
							<SelectValue placeholder="Categoria" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Todas as categorias</SelectItem>
							{categories.map((category) => (
								<SelectItem key={category.id} value={category.nome}>
									{category.nome}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* === Allergy Filter === */}
					<div className="md:col-span-3">
						<label className="text-sm font-medium text-gray-700 mb-3 block">Alérgenos</label>

						<div className="flex items-center mb-2">
							<input
								type="checkbox"
								checked={useAllergyFilter}
								onChange={(e) => setUseAllergyFilter(e.target.checked)}
								className="mr-2 accent-fitcooker-orange"
							/>
							<span className="text-gray-700 text-sm">Filtrar por alérgenos</span>
						</div>

						{useAllergyFilter && (
							<div className="flex flex-wrap gap-2">
								{allAllergenics.length === 0 ? (
									<p className="text-sm text-gray-500 italic">Nenhum alérgeno cadastrado</p>
								) : (
									allAllergenics.map((allergenic) => (
										<span
											key={allergenic}
											onClick={() =>
												setSelectedAllergenics((prev) =>
													prev.includes(allergenic)
														? prev.filter((a) => a !== allergenic)
														: [...prev, allergenic]
												)
											}
											className={`cursor-pointer border-2 px-2 py-1 rounded-lg text-sm transition ${
												selectedAllergenics.includes(allergenic)
													? 'bg-fitcooker-orange text-white border-fitcooker-orange'
													: 'border-fitcooker-orange/40 text-fitcooker-orange hover:bg-fitcooker-orange/10'
											}`}
										>
											{allergenic}
										</span>
									))
								)}
							</div>
						)}
					</div>


					{/* Sort */}
					<Select value={sortBy} onValueChange={setSortBy}>
						<SelectTrigger className="border-2 border-fitcooker-orange/20 focus:border-fitcooker-orange rounded-xl py-3 hover:border-fitcooker-orange/40 transition-colors">
							<SelectValue placeholder="Ordenar por" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="newest">
								<div className="flex items-center">
									<TrendingUp className="w-4 h-4 mr-2" />
									Mais recentes
								</div>
							</SelectItem>
							<SelectItem value="oldest">Mais antigas</SelectItem>
							<SelectItem value="rating">Melhor avaliadas</SelectItem>
							<SelectItem value="time">Tempo de preparo</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Advanced Filters */}
				{showAdvanced && (
					<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border-t border-gray-200 pt-6 mb-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{/* Difficulty */}
							<div>
								<label className="text-sm font-medium text-gray-700 mb-3 block">Dificuldade</label>
								<Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
									<SelectTrigger className="border-2 border-gray-200 focus:border-fitcooker-orange rounded-xl">
										<SelectValue placeholder="Dificuldade" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Todas as dificuldades</SelectItem>
										<SelectItem value="Fácil">Fácil</SelectItem>
										<SelectItem value="Médio">Médio</SelectItem>
										<SelectItem value="Difícil">Difícil</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Time Range */}
							<div>
								<label className="text-sm font-medium text-gray-700 mb-3 block flex items-center">
									<Clock className="w-4 h-4 mr-2" />
									Tempo: {timeRange[0]}-{(timeRange[1] === 181 ? '∞' : timeRange[1])} min
								</label>
								<div className="px-3">
									<Slider value={timeRange} onValueChange={setTimeRange} max={181} min={0} step={1} className="w-full" />
								</div>
							</div>

							{/* Servings Range */}
							<div>
								<label className="text-sm font-medium text-gray-700 mb-3 block flex items-center">
									<Users className="w-4 h-4 mr-2" />
									Porções: {servingsRange[0]}-{servingsRange[1]}
								</label>
								<div className="px-3">
									<Slider value={servingsRange} onValueChange={setServingsRange} max={12} min={1} step={1} className="w-full" />
								</div>
							</div>
						</div>
					</motion.div>
				)}

				{/* Active Filters */}
				{hasActiveFilters && (
					<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 pt-4 border-t border-gray-200">
						<span className="text-sm text-gray-600 font-medium">Filtros ativos:</span>
						<div className="flex flex-wrap gap-2">
							{searchTerm && (
								<Badge variant="outline" className="bg-fitcooker-orange/10 border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white transition-colors">
									Busca: {searchTerm}
									<button onClick={() => setSearchTerm('')} className="ml-2">×</button>
								</Badge>
							)}
							{selectedCategory !== 'all' && (
								<Badge variant="outline" className="bg-fitcooker-orange/10 border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white transition-colors">
									{selectedCategory}
									<button onClick={() => setSelectedCategory('all')} className="ml-2">×</button>
								</Badge>
							)}
							{selectedDifficulty !== 'all' && (
								<Badge variant="outline" className="bg-fitcooker-orange/10 border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white transition-colors">
									{selectedDifficulty}
									<button onClick={() => setSelectedDifficulty('all')} className="ml-2">×</button>
								</Badge>
							)}
							{useAllergyFilter === true && (
								<Badge variant="outline" className="bg-fitcooker-orange/10 border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white transition-colors">
									Alérgenos
									<button onClick={() => setUseAllergyFilter(false)} className="ml-2">×</button>
								</Badge>
							)}
						</div>
						<Button onClick={clearFilters} variant="ghost" size="sm" className="ml-auto text-gray-500 hover:text-gray-700">
							<X className="w-4 h-4 mr-1" />
							Limpar tudo
						</Button>
					</motion.div>
				)}
			</div>
		</motion.div>
	);
};

export default RecipeFilters;
