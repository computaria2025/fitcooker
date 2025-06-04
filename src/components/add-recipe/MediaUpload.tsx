
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Video, X, Star, Upload, ImagePlus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  file?: File;
  preview?: string;
  url?: string;
  isMain: boolean;
}

interface MediaUploadProps {
  mediaItems: MediaItem[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddVideoUrl: (url: string) => void;
  handleRemoveMediaItem: (id: string) => void;
  handleSetMainImage: (id: string) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  mediaItems,
  handleImageChange,
  handleAddVideoUrl,
  handleRemoveMediaItem,
  handleSetMainImage
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');
  
  const triggerImageInput = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };
  
  const triggerVideoInput = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click();
    }
  };
  
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      files.forEach((file, index) => {
        const newMediaItem: MediaItem = {
          id: Date.now().toString() + index,
          type: 'video',
          file: file,
          preview: URL.createObjectURL(file),
          isMain: false
        };
        
        // Simular o mesmo comportamento do handleAddVideoUrl mas com arquivo
        const fakeUrl = URL.createObjectURL(file);
        handleAddVideoUrl(fakeUrl);
      });
    }
  };
  
  const renderPreview = (item: MediaItem) => {
    if (item.type === 'image') {
      if (item.preview) {
        return (
          <img 
            src={item.preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        );
      } else if (item.file) {
        return (
          <img 
            src={URL.createObjectURL(item.file)}
            alt="Preview"
            className="w-full h-full object-cover"
            onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
          />
        );
      }
    } else if (item.type === 'video') {
      if (item.file) {
        return (
          <video 
            src={URL.createObjectURL(item.file)}
            className="w-full h-full object-cover"
            controls={false}
            muted
          />
        );
      } else if (item.url) {
        return (
          <div className="flex items-center justify-center h-full bg-gray-800 text-white">
            <Video className="w-8 h-8" />
            <span className="ml-2 text-sm">Vídeo</span>
          </div>
        );
      }
    }
    
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-gray-400">Sem prévia</span>
      </div>
    );
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Mídia</h2>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
          <div className="flex justify-center gap-4 mb-6">
            <Button 
              type="button"
              variant={uploadType === 'image' ? 'default' : 'outline'}
              onClick={() => setUploadType('image')}
              className={uploadType === 'image' ? 'bg-fitcooker-orange hover:bg-fitcooker-orange/90' : ''}
            >
              <ImagePlus className="w-5 h-5 mr-2" />
              Imagem
            </Button>
            <Button 
              type="button"
              variant={uploadType === 'video' ? 'default' : 'outline'}
              onClick={() => setUploadType('video')}
              className={uploadType === 'video' ? 'bg-fitcooker-orange hover:bg-fitcooker-orange/90' : ''}
            >
              <Video className="w-5 h-5 mr-2" />
              Vídeo
            </Button>
          </div>
          
          {uploadType === 'image' ? (
            <>
              <Input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
              
              <div className="text-center">
                <Camera className="w-10 h-10 mx-auto text-gray-400" />
                <h3 className="text-lg font-medium mt-2">Adicione fotos da sua receita</h3>
                <p className="text-gray-500 mt-1 mb-4">
                  Arraste e solte ou clique para fazer upload (máx. 5MB cada)
                </p>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={triggerImageInput}
                  className="mx-auto"
                >
                  Escolher Imagens
                </Button>
              </div>
            </>
          ) : (
            <>
              <Input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={handleVideoChange}
              />
              
              <div className="text-center">
                <Video className="w-10 h-10 mx-auto text-gray-400" />
                <h3 className="text-lg font-medium mt-2">Adicione vídeos da sua receita</h3>
                <p className="text-gray-500 mt-1 mb-4">
                  Selecione vídeos do seu dispositivo (máx. 50MB cada)
                </p>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={triggerVideoInput}
                  className="mx-auto"
                >
                  Escolher Vídeos
                </Button>
              </div>
            </>
          )}
        </div>
        
        {mediaItems.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Mídia Adicionada</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`relative aspect-square rounded-lg overflow-hidden border ${item.isMain ? 'border-2 border-fitcooker-orange' : 'border-gray-200'}`}
                >
                  {renderPreview(item)}
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-all duration-200">
                    <div className="flex gap-2">
                      <Button 
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="bg-white text-gray-800 hover:bg-gray-100"
                        onClick={() => handleSetMainImage(item.id)}
                        disabled={item.isMain}
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button 
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleRemoveMediaItem(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {item.isMain && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-fitcooker-orange text-white text-xs px-2 py-1 rounded-full">Principal</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaUpload;
