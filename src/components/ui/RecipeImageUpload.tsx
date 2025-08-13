import React, { useState } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, X, Upload } from 'lucide-react';

interface RecipeImageUploadProps {
  onImageUpload: (url: string) => void;
  onImageRemove?: (url: string) => void;
  currentImages?: string[];
  maxImages?: number;
  className?: string;
}

export const RecipeImageUpload: React.FC<RecipeImageUploadProps> = ({
  onImageUpload,
  onImageRemove,
  currentImages = [],
  maxImages = 5,
  className
}) => {
  const { uploadImage, uploading } = useImageUpload();
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (currentImages.length >= maxImages) return;

    const file = files[0];
    const publicUrl = await uploadImage(file, 'recipe-images', 'recipes');
    
    if (publicUrl) {
      onImageUpload(publicUrl);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragActive 
            ? 'border-fitcooker-orange bg-orange-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              {uploading ? (
                <Upload className="w-8 h-8 text-gray-400 animate-pulse" />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
            </div>
            
            <div className="mb-4">
              <p className="text-lg font-medium text-gray-900 mb-2">
                {uploading ? 'Enviando imagem...' : 'Adicionar foto da receita'}
              </p>
              <p className="text-sm text-gray-500">
                Arraste e solte ou clique para selecionar
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG até 5MB ({currentImages.length}/{maxImages} imagens)
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              disabled={uploading || currentImages.length >= maxImages}
              className="hidden"
              id="recipe-image-upload"
            />
            
            <Button
              asChild
              variant="outline"
              disabled={uploading || currentImages.length >= maxImages}
              className="border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white"
            >
              <label htmlFor="recipe-image-upload" className="cursor-pointer">
                {uploading ? 'Enviando...' : 'Selecionar arquivo'}
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Grid */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {currentImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imageUrl}
                  alt={`Recipe image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {onImageRemove && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onImageRemove(imageUrl)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-fitcooker-orange text-white text-xs px-2 py-1 rounded">
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeImageUpload;