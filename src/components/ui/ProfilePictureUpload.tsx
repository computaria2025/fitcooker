
import React from 'react';
import { Camera, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ProfilePictureUploadProps {
  currentAvatarUrl?: string;
  onUploadComplete: (url: string) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentAvatarUrl,
  onUploadComplete
}) => {
  const { user, updateProfile } = useAuth();
  const { uploadImage, uploading } = useImageUpload();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const publicUrl = await uploadImage(file, 'avatars');
    
    if (publicUrl && user) {
      await updateProfile({ avatar_url: publicUrl });
      onUploadComplete(publicUrl);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
          <AvatarImage src={currentAvatarUrl} className="object-cover" />
          <AvatarFallback className="bg-gradient-to-r from-fitcooker-orange to-orange-500 text-white text-3xl">
            <User className="w-12 h-12" />
          </AvatarFallback>
        </Avatar>
        
        <label
          htmlFor="avatar-upload"
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        >
          <div className="text-white text-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <Camera className="w-8 h-8 mx-auto mb-1" />
                <span className="text-xs">Alterar</span>
              </>
            )}
          </div>
        </label>
        
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
        />
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Clique na imagem para alterar sua foto de perfil
        </p>
        <p className="text-xs text-gray-500">
          Formatos suportados: JPG, PNG, GIF (máx. 5MB)
        </p>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
