import React from 'react';
import { SerologyTest } from '../types';

interface SerologyFormProps {
  onChange: (data: SerologyTest) => void;
  values: SerologyTest;
}

export default function SerologyForm({ onChange, values }: SerologyFormProps) {
  const handleChange = (test: keyof SerologyTest, value: string) => {
    onChange({
      ...values,
      [test]: value as 'positive' | 'negative'
    });
  };

  return (
    <div className="space-y-6">
      <h4 className="text-sm font-medium text-red-700 mb-3">🧪 Pruebas Serológicas para Dengue</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            NS1
            <span className="text-xs text-gray-500 block">
              Detecta infección temprana
            </span>
          </label>
          <select
            value={values.ns1 || ''}
            onChange={(e) => handleChange('ns1', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar...</option>
            <option value="positive">Positivo</option>
            <option value="negative">Negativo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            IgM
            <span className="text-xs text-gray-500 block">
              Detecta infección reciente
            </span>
          </label>
          <select
            value={values.igm || ''}
            onChange={(e) => handleChange('igm', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar...</option>
            <option value="positive">Positivo</option>
            <option value="negative">Negativo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            IgG
            <span className="text-xs text-gray-500 block">
              Detecta infección previa
            </span>
          </label>
          <select
            value={values.igg || ''}
            onChange={(e) => handleChange('igg', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar...</option>
            <option value="positive">Positivo</option>
            <option value="negative">Negativo</option>
          </select>
        </div>
      </div>

      {/* Información de interpretación */}
      <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <h5 className="font-medium mb-2">Interpretación de resultados:</h5>
        <ul className="list-disc pl-5 space-y-1">
          <li>"Dengue confirmado en fase temprana" (NS1 positivo)</li>
          <li>"Dengue probable en fase tardía" (IgM positivo, NS1 negativo)</li>
          <li>"Dengue previo detectado" (IgG positivo)</li>
          <li>"Riesgo de dengue grave" (Plaquetas {'<'}100,000/μL y hematocrito elevado)</li>
        </ul>
      </div>
    </div>
  );
} 