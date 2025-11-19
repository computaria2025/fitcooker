import React, { useState } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RecipeStep {
  id: string;
  order: number;
  description: string;
  video_url?: string; // campo para o vídeo
}

interface StepsProps {
  steps: RecipeStep[];
  updateStepDescription: (id: string, description: string) => void;
  updateStepVideo: (id: string, videoUrl: string) => void; // função para atualizar vídeo
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
    // Verificação de tamanho: limite de 10MB (10 * 1024 * 1024 bytes)
    if (file.size > 10 * 1024 * 1024) {
      console.log('O arquivo de vídeo deve ter no máximo 10MB.');
      return;
    }

    try {
      setUploadingStepId(stepId);

      const fileExt = file.name.split('.').pop();
      const fileName = `${stepId}-${Date.now()}.${fileExt}`;
      const filePath = `passos/${fileName}`;

      // 1. Faz upload no Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('passos_videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Obtém URL Pública
      const { data: urlData } = supabase.storage
        .from('passos_videos')
        .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          console.log('✅ URL Pública Gerada com Sucesso:', urlData.publicUrl);
          // 3. Atualiza o estado local para exibir o vídeo (preview)
          updateStepVideo(stepId, urlData.publicUrl);
        } else {
          console.error('❌ Falha ao obter publicUrl. Verifique as RLS do bucket.');
          console.log('Erro ao obter a URL do vídeo. Verifique as permissões do bucket.');
        }

    } catch (error) {
      console.error('Erro ao enviar vídeo:', error);
      console.log('Erro ao enviar vídeo. Tente novamente.');
    } finally {
      setUploadingStepId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Modo de Preparo *</h2>
      
      <div className="space-y-6">
        {/* FIX: Adicionando verificação defensiva (steps || []) para evitar TypeError: Cannot read properties of undefined (reading 'map') */}
        {(steps || []).map((step) => (
          // Container de cada Passo
          <div 
            key={step.id} 
            className="border border-gray-200 rounded-xl p-5 bg-gray-50 transition-shadow duration-300 hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg flex items-center text-gray-700">
                <div className="w-7 h-7 rounded-full bg-fitcooker-orange text-white flex items-center justify-center mr-3 text-sm shadow-md">
                  {step.order}
                </div>
                Passo {step.order}
              </h3>
              <button
                type="button"
                onClick={() => removeStep(step.id)}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                disabled={steps.length <= 1}
                aria-label="Remover passo"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Campo de Descrição */}
            <textarea
              className="flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 transition-all duration-200 resize-y"
              rows={3}
              value={step.description}
              onChange={(e) => updateStepDescription(step.id, e.target.value)}
              placeholder={`Descreva o passo ${step.order}... (Ex: 'Refogue a cebola e o alho em azeite até dourar...')`}
              required
            />

            {/* Preview do vídeo - Aparece no topo do bloco de mídia quando a URL existe */}
            {step.video_url && (
              <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden shadow-inner">
                <video
                  src={step.video_url}
                  controls
                  className="w-full object-cover max-h-80"
                  key={step.video_url} // Força a remontagem se a URL mudar
                  poster="https://placehold.co/600x400/eeeeee/333333?text=Video+Carregado"
                >
                    Seu navegador não suporta a tag de vídeo.
                </video>
              </div>
            )}
            
            {/* Upload de vídeo */}
            <div className="mt-4 flex items-center gap-3">
              <label
                htmlFor={`video-upload-${step.id}`}
                // Mantendo as classes originais do seu projeto: bg-orange-100 text-orange-600
                className={`cursor-pointer flex items-center bg-orange-100 text-orange-600 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-orange-200 transition-colors ${uploadingStepId === step.id ? 'opacity-60 pointer-events-none' : ''}`}
                title="Formatos de vídeo aceitos: MP4, MOV, WEBM. Máx: 10MB."
              >
                <Upload size={16} className="mr-2" />
                {uploadingStepId === step.id ? 'Enviando (Aguarde)...' : step.video_url ? 'Substituir Vídeo' : 'Adicionar Vídeo'}
              </label>
              <input
                id={`video-upload-${step.id}`}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleVideoUpload(step.id, file);
                  e.target.value = ''; // Permite re-upload do mesmo arquivo
                }}
                disabled={uploadingStepId === step.id}
              />
              {step.video_url && (
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full border border-green-200">
                    Vídeo anexado
                  </span>
              )}
            </div>

          </div>
        ))}

        {/* Botão Adicionar Passo */}
        <button
          type="button"
          onClick={addStep}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-orange-600 hover:border-orange-500 hover:bg-orange-50 transition-colors duration-200 flex items-center justify-center font-semibold mt-4"
        >
          <Plus size={20} className="mr-2" />
          Adicionar Novo Passo
        </button>
      </div>
    </div>
  );
};

export default Steps;
