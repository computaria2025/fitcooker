
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface PreferencesSelectorProps {
  preferences: string[];
  onChange: (preferences: string[]) => void;
}

const PreferencesSelector: React.FC<PreferencesSelectorProps> = ({
  preferences,
  onChange
}) => {
  const [newPreference, setNewPreference] = useState('');

  const addPreference = () => {
    if (newPreference.trim() && !preferences.includes(newPreference.trim())) {
      onChange([...preferences, newPreference.trim()]);
      setNewPreference('');
    }
  };

  const removePreference = (preference: string) => {
    onChange(preferences.filter(p => p !== preference));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPreference();
    }
  };

  return (
    <div className="space-y-3">
      <Label>Preferências</Label>
      
      {/* Display current preferences */}
      <div className="flex flex-wrap gap-2 min-h-[2rem]">
        {preferences.map((preference, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1"
          >
            {preference}
            <button
              onClick={() => removePreference(preference)}
              className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Add new preference */}
      <div className="flex gap-2">
        <Input
          value={newPreference}
          onChange={(e) => setNewPreference(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite uma preferência..."
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addPreference}
          size="sm"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PreferencesSelector;
