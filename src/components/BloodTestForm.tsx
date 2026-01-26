import React from 'react';
import { BloodTest, SerologyTest } from '../types';
import SerologyForm from './SerologyForm';

interface BloodTestFormProps {
  onChange: (data: BloodTest) => void;
  values: BloodTest;
}

export default function BloodTestForm({ onChange, values }: BloodTestFormProps) {
  const handleChange = (field: keyof BloodTest, value: string) => {
    onChange({
      ...values,
      [field]: value ? parseFloat(value) : undefined
    });
  };

  const handleSerologyChange = (data: SerologyTest) => {
    onChange({
      ...values,
      serology: data
    });
  };

  return (
    <div className="space-y-8">
      {/* Serie Roja */}
      <div>
        <h4 className="text-sm font-medium text-red-700 mb-3">🔴 Serie Roja</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">
              Glóbulos rojos (millones/μL)
              <span className="text-xs text-gray-500 block">
                H: 4.7-6.1 | M: 4.2-5.4
              </span>
            </label>
            <input
              type="number"
              step="0.1"
              value={values.redBloodCells || ''}
              onChange={(e) => handleChange('redBloodCells', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">
              Hemoglobina (g/dL)
              <span className="text-xs text-gray-500 block">
                H: 13.8-17.2 | M: 12.1-15.1
              </span>
            </label>
            <input
              type="number"
              step="0.1"
              value={values.hemoglobin || ''}
              onChange={(e) => handleChange('hemoglobin', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">
              Hematocrito (%)
              <span className="text-xs text-gray-500 block">
                H: 40-54 | M: 36-48
              </span>
            </label>
            <input
              type="number"
              step="0.1"
              value={values.hematocrit || ''}
              onChange={(e) => handleChange('hematocrit', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">
              VCM (fL)
              <span className="text-xs text-gray-500 block">80-100</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={values.mcv || ''}
              onChange={(e) => handleChange('mcv', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">
              HCM (pg)
              <span className="text-xs text-gray-500 block">27-33</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={values.mch || ''}
              onChange={(e) => handleChange('mch', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">
              CHCM (g/dL)
              <span className="text-xs text-gray-500 block">32-36</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={values.mchc || ''}
              onChange={(e) => handleChange('mchc', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">
              ADE/RDW (%)
              <span className="text-xs text-gray-500 block">11.5-14.5</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={values.rdw || ''}
              onChange={(e) => handleChange('rdw', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Serie Blanca */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">⚪ Serie Blanca</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">
              Leucocitos (células/μL)
              <span className="text-xs text-gray-500 block">4,000-11,000</span>
            </label>
            <input
              type="number"
              step="100"
              value={values.whiteBloodCells || ''}
              onChange={(e) => handleChange('whiteBloodCells', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">
              Neutrófilos (/μL)
              <span className="text-xs text-gray-500 block">1,800-7,700</span>
            </label>
            <input
              type="number"
              step="100"
              value={values.neutrophils || ''}
              onChange={(e) => handleChange('neutrophils', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">
              Linfocitos (/μL)
              <span className="text-xs text-gray-500 block">1,000-4,800</span>
            </label>
            <input
              type="number"
              step="100"
              value={values.lymphocytes || ''}
              onChange={(e) => handleChange('lymphocytes', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">
              Monocitos (/μL)
              <span className="text-xs text-gray-500 block">200-1,000</span>
            </label>
            <input
              type="number"
              step="100"
              value={values.monocytes || ''}
              onChange={(e) => handleChange('monocytes', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">
              Eosinófilos (/μL)
              <span className="text-xs text-gray-500 block">50-500</span>
            </label>
            <input
              type="number"
              step="10"
              value={values.eosinophils || ''}
              onChange={(e) => handleChange('eosinophils', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">
              Basófilos (/μL)
              <span className="text-xs text-gray-500 block">0-200</span>
            </label>
            <input
              type="number"
              step="10"
              value={values.basophils || ''}
              onChange={(e) => handleChange('basophils', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Serie Plaquetaria */}
      <div>
        <h4 className="text-sm font-medium text-red-900 mb-3">🩸 Serie Plaquetaria</h4>
        <div>
          <label className="block text-sm text-gray-700">
            Plaquetas (/μL)
            <span className="text-xs text-gray-500 block">150,000-450,000</span>
          </label>
          <input
            type="number"
            step="1000"
            value={values.platelets || ''}
            onChange={(e) => handleChange('platelets', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Sección de Serología */}
      <div className="border-t pt-6">
        <SerologyForm
          onChange={handleSerologyChange}
          values={values.serology || {}}
        />
      </div>
    </div>
  );
} 