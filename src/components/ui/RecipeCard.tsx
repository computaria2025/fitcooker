
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '@/data/mockData';
import CategoryBadge from './CategoryBadge';
import MacroDisplay from './MacroDisplay';
import { Clock, Flame, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
  featured?: boolean;
  similar?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, className, featured = false, similar = false }) => {
  const { id, title, description, imageUrl, preparationTime, difficulty, macros, author, categories } = recipe;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  return (
    <div 
      className={cn(
        'recipe-card group overflow-hidden h-full flex flex-col bg-white shadow-md hover:shadow-xl transition-all duration-300',
        featured ? 'md:flex-row' : '',
        similar ? 'transform transition-all duration-500 hover:scale-105 hover:shadow-2xl' : '',
        className
      )}
    >
      <div className={cn(
        'relative overflow-hidden bg-gray-100',
        featured ? 'md:w-1/2' : 'w-full'
      )}>
        <Link to={`/recipe/${id}`} className="block relative">
          {!imageError ? (
            <>
              <img 
                src={imageUrl} 
                alt={title}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={cn(
                  "recipe-image w-full h-full object-cover transition-all duration-700",
                  featured ? "h-64 md:h-full" : "h-48",
                  imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
                  similar ? "group-hover:scale-110" : "group-hover:scale-105"
                )}
              />
              {!imageLoaded && (
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse",
                  featured ? "h-64 md:h-full" : "h-48"
                )} />
              )}
            </>
          ) : (
            <div className={cn(
              "w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center",
              featured ? "h-64 md:h-full" : "h-48"
            )}>
              <ChefHat className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
            <span className="text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              Ver receita
            </span>
          </div>
        </Link>
        
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[90%]">
          {categories.slice(0, featured ? 3 : 2).map((category, index) => (
            <CategoryBadge key={index} category={category} />
          ))}
          {categories.length > (featured ? 3 : 2) && (
            <span className="category-badge bg-black/70 text-white backdrop-blur-sm">
              +{categories.length - (featured ? 3 : 2)}
            </span>
          )}
        </div>
      </div>
      
      <div className={cn(
        'p-5 flex flex-col flex-grow',
        featured ? 'md:w-1/2' : '',
        similar ? 'transform transition-all duration-500 group-hover:bg-gray-50' : ''
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock size={16} />
            <span>{preparationTime} min</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Flame size={16} className={
              difficulty === 'Fácil' ? 'text-green-500' : 
              difficulty === 'Médio' ? 'text-yellow-500' : 'text-red-500'
            } />
            <span>{difficulty}</span>
          </div>
        </div>
        
        <Link to={`/recipe/${id}`} className="group-hover:text-fitcooker-orange transition-colors duration-200">
          <h3 className={cn(
            "heading-sm mb-2 line-clamp-2",
            similar ? "transform transition-all duration-500 group-hover:translate-x-1" : ""
          )}>{title}</h3>
        </Link>
        
        {featured && (
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{description}</p>
        )}
        
        <div className="mt-auto pt-4">
          <MacroDisplay 
            calories={macros.calories}
            protein={macros.protein}
            carbs={macros.carbs}
            fat={macros.fat}
            compact={true}
            className="mb-3"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                <img 
                  src={author.avatarUrl} 
                  alt={author.name} 
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">{author.name}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <ChefHat size={16} className="mr-1 text-fitcooker-orange" />
              <span>{recipe.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
