import React, { useState } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RecipeStep {
  id: string;
  order: number;
  description: string;
  video_url?: string; // novo campo para o vídeo
}

interface StepsProps {
  steps: RecipeStep[];
  updateStepDescription: (id: string, description: string) => void;
  updateStepVideo: (id: string, videoUrl: string) => void; // função nova para atualizar vídeo
  removeStep: (id: string) => void;
  addStep: () => void;
}

const Steps: React.FC<StepsProps> = ({
  steps,
  updateStepDescription,
  updateStepVideo,
  removeStep,
  addStep
}) => {
  const [uploadingStepId, setUploadingStepId] = useState<string | null>(null);

  const handleVideoUpload = async (stepId: string, file: File) => {
    try {
      setUploadingStepId(stepId);

      const fileExt = file.name.split('.').pop();
      const fileName = `${stepId}-${Date.now()}.${fileExt}`;
      const filePath = `passos/${fileName}`;

      // Faz upload no Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('passos_videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('passos_videos')
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        updateStepVideo(stepId, urlData.publicUrl);
      }
    } catch (error) {
      console.error('Erro ao enviar vídeo:', error);
      alert('Erro ao enviar vídeo. Tente novamente.');
    } finally {
      setUploadingStepId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Modo de Preparo *</h2>
      
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium flex items-center">
                <div className="w-6 h-6 rounded-full bg-fitcooker-orange text-white flex items-center justify-center mr-2">
                  {step.order}
                </div>
                Passo {step.order}
              </h3>
              <button
                type="button"
                onClick={() => removeStep(step.id)}
                className="text-red-500 hover:text-red-700"
                disabled={steps.length <= 1}
              >
                <X size={18} />
              </button>
            </div>
            
            <textarea
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              rows={3}
              value={step.description}
              onChange={(e) => updateStepDescription(step.id, e.target.value)}
              placeholder={`Descreva o passo ${step.order}...`}
              required
            />

            {/* Upload de vídeo */}
            <div className="mt-3 flex items-center gap-2">
              <label
                htmlFor={`video-upload-${step.id}`}
                className="cursor-pointer flex items-center text-fitcooker-orange hover:text-orange-600 text-sm font-medium"
              >
                <Upload size={16} className="mr-1" />
                {uploadingStepId === step.id ? 'Enviando vídeo...' : 'Adicionar vídeo'}
              </label>
              <input
                id={`video-upload-${step.id}`}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleVideoUpload(step.id, file);
                }}
                disabled={uploadingStepId === step.id}
              />
            </div>

            {/* Preview do vídeo */}
            {step.video_url && (
              <div className="mt-3">
                <video
                  src={step.video_url}
                  controls
                  className="rounded-lg shadow-md max-h-60 w-full object-cover"
                />
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addStep}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-fitcooker-orange hover:border-fitcooker-orange transition-colors flex items-center justify-center"
        >
          <Plus size={18} className="mr-2" />
          Adicionar Passo
        </button>
      </div>
    </div>
  );
};

export default Steps;
