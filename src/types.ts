export interface PatientInfo {
  fullName: string;
  gender: 'masculino' | 'femenino' | 'otro';
  ageYears: number;
  ageMonths: number;
  height: number;
  weight: number;
  temperature: number;
  municipality: string;
  neighborhood: string;
  hasAdditionalInfo?: boolean;
  additionalInfo?: string;
  conditions: {
    isDiabetic: boolean;
    isHypertensive: boolean;
  };
  bloodTest?: BloodTest;
  // Campos para geolocalización
  latitude?: number;
  longitude?: number;
}

export interface Symptom {
  id: string;
  name: string;
  category: 'dengue' | 'respiratory';
  subCategory?: 'general' | 'alarm' | 'severe';
}

export interface Doctor {
  specialty: string;
  justification: string;
  name: string;
  location: string;
}

export interface Diagnosis {
  preliminaryDiagnosis: {
    condition: string;
    explanation: string;
    severity: 'bajo' | 'medio' | 'alto';
    reasoning: string;
  };
  recommendations: {
    type: string;
    description: string;
    dosage?: string;
    duration?: string;
  }[];
  doctors: {
    specialty: string;
    justification: string;
    name: string;
    location: string;
  }[];
  warningSignals: string[];
}

export interface SerologyTest {
  ns1?: 'positive' | 'negative';
  igm?: 'positive' | 'negative';
  igg?: 'positive' | 'negative';
}

export interface BloodTest {
  // Serie Roja
  redBloodCells?: number;
  hemoglobin?: number;
  hematocrit?: number;
  mcv?: number;
  mch?: number;
  mchc?: number;
  rdw?: number;

  // Serie Blanca
  whiteBloodCells?: number;
  neutrophils?: number;
  lymphocytes?: number;
  monocytes?: number;
  eosinophils?: number;
  basophils?: number;

  // Serie Plaquetaria
  platelets?: number;

  serology?: SerologyTest;
}

// Nuevas interfaces para la API del backend
export interface ConsultaAPI {
  id: number;
  nombre: string;
  edad: number;
  sexo: string;
  otros_datos: string;
  lat: number;
  lng: number;
  resumen: string;
  diagnostico: string;
  clasificacion: string;
  fecha: string;
  form_data?: string;
}

export interface DiagnosticoRequest {
  nombre: string;
  edad: number;
  sexo: string;
  otros_datos: string;
  lat: number;
  lng: number;
  resumen: string;
  diagnostico: string;
  clasificacion: string;
}

export interface DiagnosticoResponse {
  id: number;
  success: boolean;
  message?: string;
}

export interface ConsultasResponse {
  consultas: ConsultaAPI[];
  success: boolean;
  message?: string;
}