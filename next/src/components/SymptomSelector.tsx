import React, { useState } from 'react';
import { Symptom, BloodTest } from '../types';
import BloodTestForm from './BloodTestForm';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SymptomSelectorProps {
  symptoms: Symptom[];
  selectedSymptoms: string[];
  onSymptomToggle: (id: string) => void;
  onBloodTestChange?: (data: BloodTest) => void;
  bloodTestValues?: BloodTest;
}

export default function SymptomSelector({
  symptoms,
  selectedSymptoms,
  onSymptomToggle,
  onBloodTestChange,
  bloodTestValues = {}
}: SymptomSelectorProps) {
  const [showBloodTest, setShowBloodTest] = useState(false);

  const groupedSymptoms = {
    dengue: symptoms.filter(s => s.category === 'dengue'),
    respiratory: symptoms.filter(s => s.category === 'respiratory')
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Seleccione los síntomas presentes</h3>
      
      {Object.entries(groupedSymptoms).map(([category, categorySymptoms]) => (
        <div key={category} className="space-y-4">
          <h4 className="text-xl font-medium text-gray-900">
            {category === 'dengue' ? 'Dengue' : 'Síntomas Respiratorios'}
          </h4>
          
          {category === 'dengue' ? (
            ['general', 'alarm', 'severe'].map(subCat => {
              const subCategorySymptoms = categorySymptoms.filter(s => s.subCategory === subCat);
              return (
                <div key={subCat} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {subCategorySymptoms.map((symptom) => (
                    <label
                      key={symptom.id}
                      className={`flex items-center p-3 rounded-lg border ${
                        selectedSymptoms.includes(symptom.id)
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSymptoms.includes(symptom.id)}
                        onChange={() => onSymptomToggle(symptom.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{symptom.name}</span>
                    </label>
                  ))}
                </div>
              );
            })
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categorySymptoms.map((symptom) => (
                <label
                  key={symptom.id}
                  className={`flex items-center p-3 rounded-lg border ${
                    selectedSymptoms.includes(symptom.id)
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(symptom.id)}
                    onChange={() => onSymptomToggle(symptom.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{symptom.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Sección de Biometría Hemática */}
      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() => setShowBloodTest(!showBloodTest)}
          className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100"
        >
          <span className="font-medium text-gray-900">Si tiene datos de biometría hemática y serología</span>
          {showBloodTest ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        
        {showBloodTest && (
          <div className="p-4">
            <BloodTestForm
              onChange={onBloodTestChange || (() => {})}
              values={bloodTestValues}
            />
          </div>
        )}
      </div>
    </div>
  );
}