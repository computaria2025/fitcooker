
import React from 'react';
import { Plus, X } from 'lucide-react';

interface RecipeStep {
  id: string;
  order: number;
  description: string;
}

interface StepsProps {
  steps: RecipeStep[];
  updateStepDescription: (id: string, description: string) => void;
  removeStep: (id: string) => void;
  addStep: () => void;
}

const Steps: React.FC<StepsProps> = ({
  steps,
  updateStepDescription,
  removeStep,
  addStep
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Modo de Preparo *</h2>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
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
