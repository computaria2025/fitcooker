
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '@/types/recipe';
import CategoryBadge from './CategoryBadge';
import { Clock, Users, Star, ChefHat, Zap, Beef, Wheat, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
  featured?: boolean;
  similar?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, className, featured = false, similar = false }) => {
  const { id, title, description, imageUrl, preparationTime, difficulty, macros, author, categories, rating, servings } = recipe;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  return (
    <div 
      className={cn(
        'recipe-card group overflow-hidden h-full flex flex-col bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl border border-gray-100',
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
                  "recipe-image w-full h-full object-cover transition-all duration-700 rounded-t-xl",
                  featured ? "h-64 md:h-full md:rounded-t-none md:rounded-l-xl" : "h-48",
                  imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
                  similar ? "group-hover:scale-110" : "group-hover:scale-105"
                )}
              />
              {!imageLoaded && (
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-t-xl",
                  featured ? "h-64 md:h-full md:rounded-t-none md:rounded-l-xl" : "h-48"
                )} />
              )}
            </>
          ) : (
            <div className={cn(
              "w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-t-xl",
              featured ? "h-64 md:h-full md:rounded-t-none md:rounded-l-xl" : "h-48"
            )}>
              <ChefHat className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
            <span className="text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              Ver receita completa
            </span>
          </div>
        </Link>
        
        {/* Categories as small icons */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[90%]">
          {categories.slice(0, 3).map((category, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700">
              {category}
            </Badge>
          ))}
          {categories.length > 3 && (
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700">
              +{categories.length - 3}
            </Badge>
          )}
        </div>

        {/* Rating in top right */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-xs font-bold text-gray-700">{rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className={cn(
        'p-4 flex flex-col flex-grow',
        featured ? 'md:w-1/2' : '',
        similar ? 'transform transition-all duration-500 group-hover:bg-gray-50' : ''
      )}>
        {/* Recipe stats */}
        <div className="flex items-center justify-between mb-3 text-xs text-gray-600">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{preparationTime}min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{servings}</span>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs",
              difficulty === 'Fácil' ? 'border-green-500 text-green-600' : 
              difficulty === 'Médio' ? 'border-yellow-500 text-yellow-600' : 
              'border-red-500 text-red-600'
            )}
          >
            {difficulty}
          </Badge>
        </div>
        
        <Link to={`/recipe/${id}`} className="group-hover:text-fitcooker-orange transition-colors duration-200">
          <h3 className={cn(
            "font-bold text-lg mb-2 line-clamp-2 text-gray-900",
            similar ? "transform transition-all duration-500 group-hover:translate-x-1" : ""
          )}>{title}</h3>
        </Link>
        
        {featured && (
          <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm">{description}</p>
        )}
        
        {/* Quick macro preview */}
        <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3 text-fitcooker-orange" />
              <span className="font-bold">{macros.calories}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Beef className="w-3 h-3 text-blue-500" />
              <span>{macros.protein}g</span>
            </div>
            <div className="flex items-center space-x-1">
              <Wheat className="w-3 h-3 text-green-500" />
              <span>{macros.carbs}g</span>
            </div>
            <div className="flex items-center space-x-1">
              <Droplets className="w-3 h-3 text-yellow-500" />
              <span>{macros.fat}g</span>
            </div>
          </div>
        </div>
        
        {/* Author info */}
        <div className="mt-auto">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
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
            <span className="text-xs font-medium text-gray-700 truncate">por {author.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
