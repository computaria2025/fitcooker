// Recipes.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { Recipe } from '@/types/recipe';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RecipeCard from '@/components/ui/RecipeCard';
import RecipeCardSkeleton from '@/components/ui/RecipeCardSkeleton';
import RecipeFilters from '@/components/recipes/RecipeFilters';
import SectionTitle from '@/components/ui/SectionTitle';
import { useAuth } from '@/hooks/useAuth';

const Recipes: React.FC = () => {
  const { user } = useAuth();
	const { data: recipes, loading } = useRecipes();
  const [ filteredRecipes, setFilteredRecipes ] = React.useState<Recipe[]>(recipes || []);

  React.useEffect(() => {
    if (recipes?.length) setFilteredRecipes(recipes);
  }, [recipes]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
			<Navbar />
			<main className="py-12 pt-40">
				<div className="container mx-auto responsive-padding">
					<SectionTitle
						title="Receitas Deliciosas"
						subtitle="Descubra pratos incríveis criados pela nossa comunidade de chefs apaixonados"
					/>

					{/* Filters */}
          <RecipeFilters recipes={recipes} onFilter={setFilteredRecipes} user={user} />

					{/* Results */}
					{loading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{Array.from({ length: 12 }).map((_, i) => (
								<RecipeCardSkeleton key={i} />
							))}
						</div>
					) : ( filteredRecipes.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecipes.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * (i % 12) }}
                >
                  <RecipeCard recipe={r} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-3">
                Nenhuma receita encontrada
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Tente ajustar seus filtros ou termos de busca para encontrar receitas deliciosas.
              </p>
            </motion.div>
          ) ) }
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Recipes;
