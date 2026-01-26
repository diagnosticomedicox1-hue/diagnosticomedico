import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { User, Ruler, Weight, Thermometer, Heart, MapPin, Navigation } from 'lucide-react';
import { PatientInfo } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';

interface PatientFormProps {
  onSubmit: (data: PatientInfo) => void;
}

export default function PatientForm({ onSubmit }: PatientFormProps) {
  const { register, handleSubmit, watch, control } = useForm<PatientInfo>({
    defaultValues: {
      conditions: {
        isDiabetic: false,
        isHypertensive: false
      }
    }
  });
  
  const hasAdditionalInfo = watch('hasAdditionalInfo');
  const weight = useWatch({ control, name: 'weight' });
  const height = useWatch({ control, name: 'height' });

  const calculateBMI = (weight: number, heightCm: number) => {
    if (!weight || !heightCm || weight <= 0 || heightCm <= 0) return null;
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    return bmi;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Bajo peso';
    if (bmi < 25) return 'Peso normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidad';
  };

  const bmi = calculateBMI(Number(weight), Number(height));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <User className="w-6 h-6 text-blue-500" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input
              {...register('fullName', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <User className="w-6 h-6 text-blue-500" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Género</label>
            <div className="mt-2 space-y-2">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  {...register('gender', { required: true })}
                  value="masculino"
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Masculino</span>
              </label>
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  {...register('gender', { required: true })}
                  value="femenino"
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Femenino</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('gender', { required: true })}
                  value="otro"
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Otro</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Ruler className="w-6 h-6 text-blue-500" />
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-medium text-gray-700">Edad</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">Años</label>
                <input
                  {...register('ageYears', { 
                    required: true, 
                    min: 0,
                    max: 120,
                    valueAsNumber: true
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  type="number"
                  placeholder="Ej: 25"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Meses</label>
                <input
                  {...register('ageMonths', { 
                    required: true,
                    min: 0,
                    max: 11,
                    valueAsNumber: true
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  type="number"
                  placeholder="0-11"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Weight className="w-6 h-6 text-blue-500" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Peso (kg)
              <span className="text-xs text-gray-500 ml-1">
                Use punto decimal para fracciones de kilo (ej: 65.5)
              </span>
            </label>
            <input
              {...register('weight', { 
                required: true, 
                min: 0,
                validate: {
                  decimal: value => 
                    Number.isInteger(value * 10) || 
                    'Solo se permiten hasta un decimal'
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              type="number"
              step="0.1"
              placeholder="Ejemplo: 65.5"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Ruler className="w-6 h-6 text-blue-500" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Talla o Estatura (cm)</label>
            <input
              {...register('height', { required: true, min: 0 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              type="number"
              placeholder="Ejemplo: 170"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Thermometer className="w-6 h-6 text-blue-500" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Temperatura (°C)</label>
            <input
              {...register('temperature', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              type="number"
              step="0.1"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Heart className="w-6 h-6 text-blue-500" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Condiciones Preexistentes</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('conditions.isDiabetic')}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Diabetes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('conditions.isHypertensive')}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Hipertensión</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('hasAdditionalInfo')}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">¿Tiene información adicional relevante?</span>
            </label>

            {hasAdditionalInfo && (
              <textarea
                {...register('additionalInfo')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                placeholder="Ingrese información adicional relevante para el diagnóstico..."
              />
            )}
          </div>
        </div>

        {/* Ubicación */}
        <div className="flex items-center space-x-4">
          <MapPin className="w-6 h-6 text-blue-500" />
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Municipio</label>
              <input
                {...register('municipality', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                type="text"
                placeholder="Ejemplo: Colima"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Calle y Colonia</label>
              <input
                {...register('neighborhood', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                type="text"
                placeholder="Ejemplo: Av. Universidad 333, Centro"
              />
            </div>
          </div>
        </div>
      </div>

      {bmi && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900">Índice de Masa Corporal (IMC)</h4>
          <p className="mt-1 text-sm text-blue-700">
            IMC: {bmi.toFixed(1)} kg/m² - {getBMICategory(bmi)}
          </p>
          <p className="mt-1 text-xs text-blue-600">
            Valores de referencia: 
            Bajo peso {'<'}18.5 | Normal 18.5-24.9 | Sobrepeso 25-29.9 | Obesidad ≥30
          </p>
        </div>
      )}

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Continuar
      </button>
    </form>
  );
}