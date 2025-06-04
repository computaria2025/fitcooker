
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface RecipeCardSkeletonProps {
  featured?: boolean;
  className?: string;
}

const RecipeCardSkeleton: React.FC<RecipeCardSkeletonProps> = ({ featured = false, className }) => {
  return (
    <div 
      className={cn(
        'recipe-card overflow-hidden h-full flex flex-col bg-white',
        featured ? 'md:flex-row' : '',
        className
      )}
    >
      <div className={cn(
        'relative overflow-hidden',
        featured ? 'md:w-1/2' : 'w-full'
      )}>
        <Skeleton className={cn(
          "w-full object-cover",
          featured ? "h-64 md:h-full" : "h-48"
        )} />
        
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
      
      <div className={cn(
        'p-5 flex flex-col flex-grow',
        featured ? 'md:w-1/2' : ''
      )}>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        
        {featured && (
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}
        
        <div className="mt-auto pt-4">
          <div className="grid grid-cols-4 gap-2 mb-3">
            <Skeleton className="h-8 rounded-lg" />
            <Skeleton className="h-8 rounded-lg" />
            <Skeleton className="h-8 rounded-lg" />
            <Skeleton className="h-8 rounded-lg" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCardSkeleton;
