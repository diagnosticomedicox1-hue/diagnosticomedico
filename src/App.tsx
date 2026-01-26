import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import PatientForm from './components/PatientForm';
import SymptomSelector from './components/SymptomSelector';
import DiagnosisResult from './components/DiagnosisResult';
import { PatientInfo, Symptom, Diagnosis, BloodTest } from './types';
import { Activity, AlertCircle, Ruler, ExternalLink, Info, AlertTriangle } from 'lucide-react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Consulta from './components/Consulta';

// Initialize Google Gemini with API key
const API_KEY = 'AIzaSyBuhKP_j_XyLfk0lbqrqnlxY8KjsW83pUE';
const genAI = new GoogleGenerativeAI(API_KEY);

const symptoms: Symptom[] = [
  // Dengue - Síntomas generales
  { id: 'fever', name: 'Fiebre alta', category: 'dengue', subCategory: 'general' },
  { id: 'eyePain', name: 'Dolor detrás de los ojos', category: 'dengue', subCategory: 'general' },
  { id: 'rash', name: 'Erupciones en la piel', category: 'dengue', subCategory: 'general' },
  { id: 'muscleJointPain', name: 'Dolor muscular o articular', category: 'dengue', subCategory: 'general' },
  { id: 'fatigue', name: 'Fatiga excesiva', category: 'dengue', subCategory: 'general' },
  { id: 'nausea', name: 'Náuseas o vómitos', category: 'dengue', subCategory: 'general' },
  { id: 'chills', name: 'Escalofríos', category: 'dengue', subCategory: 'general' },
  { id: 'petechiae', name: 'Petequias o prueba del torniquete', category: 'dengue', subCategory: 'general' },
  { id: 'leukopenia', name: 'Leucopenia (glóbulos "leucocitos" blancos bajos)', category: 'dengue', subCategory: 'general' },

  // Dengue - Signos de alarma
  { id: 'severePainAbdomen', name: 'Dolor abdominal intenso y sostenido', category: 'dengue', subCategory: 'alarm' },
  { id: 'persistentVomiting', name: 'Vómitos persistentes', category: 'dengue', subCategory: 'alarm' },
  { id: 'fluidAccumulation', name: 'Acumulación de líquidos (derrame pleural, ascitis)', category: 'dengue', subCategory: 'alarm' },
  { id: 'mucosalBleeding', name: 'Sangrado de mucosas (encías, nariz, orina, heces)', category: 'dengue', subCategory: 'alarm' },
  { id: 'lethargy', name: 'Letargo o irritabilidad', category: 'dengue', subCategory: 'alarm' },
  { id: 'posturalHypotension', name: 'Hipotensión postural (lipotimia)', category: 'dengue', subCategory: 'alarm' },
  { id: 'enlargedLiver', name: 'Hepatomegalia mayor a 2 cm', category: 'dengue', subCategory: 'alarm' },
  { id: 'hematocritPlatelets', name: 'Aumento de hematocrito con descenso de plaquetas', category: 'dengue', subCategory: 'alarm' },

  // Dengue - Síntomas graves
  { id: 'severeShock', name: 'Choque o dificultad respiratoria por extravasación de plasma', category: 'dengue', subCategory: 'severe' },
  { id: 'severeBleeding', name: 'Sangrado grave', category: 'dengue', subCategory: 'severe' },
  { id: 'liverDamage', name: 'Daño hepático severo', category: 'dengue', subCategory: 'severe' },
  { id: 'myocarditis', name: 'Miocarditis (inflamación del corazón)', category: 'dengue', subCategory: 'severe' },
  { id: 'neuroAlteration', name: 'Alteraciones neurológicas (convulsiones, encefalopatía)', category: 'dengue', subCategory: 'severe' },

  // Síntomas respiratorios
  { id: 'cough', name: 'Tos persistente', category: 'respiratory' },
  { id: 'breathingDifficulty', name: 'Dificultad para respirar', category: 'respiratory' },
  { id: 'congestion', name: 'Congestión nasal', category: 'respiratory' },
  { id: 'soreThroat', name: 'Dolor de garganta', category: 'respiratory' },
  { id: 'chestPain', name: 'Dolor en el pecho', category: 'respiratory' }
];

// Agregar constante con hospitales de la región
const HOSPITALES_REGION = [
  {
    nombre: "Hospital Regional Universitario",
    direccion: "Av. Carlos de la Madrid Béjar S/N, Colima, Col.",
    telefono: "312 313 1063",
    tipo: "Público"
  },
  {
    nombre: "Hospital General de Zona No.1 IMSS",
    direccion: "Av. De los Maestros 149, Colima, Col.",
    telefono: "312 316 1111",
    tipo: "IMSS"
  },
  {
    nombre: "ISSSTE Colima",
    direccion: "Av. Gonzalo de Sandoval 750, Colima, Col.",
    telefono: "312 312 1270",
    tipo: "ISSSTE"
  }
];

export default function App() {
  const [step, setStep] = useState(1);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [bloodTest, setBloodTest] = useState<BloodTest>({});
  const location = useLocation();

  const handlePatientSubmit = (data: PatientInfo) => {
    setPatientInfo(data);
    setStep(2);
  };

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleBloodTestChange = (data: BloodTest) => {
    setBloodTest(data);
  };

  const generateDiagnosis = async () => {
    if (!patientInfo) {
      setError('Por favor complete la información del paciente');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const analysisPrompt = `Como médico profesional, analiza detalladamente este caso:
        Paciente con:
        - Nombre: ${patientInfo.fullName}
        - Género: ${patientInfo.gender === 'masculino' ? 'Masculino' : 'Femenino'}
        - Edad: ${patientInfo.ageYears} años${patientInfo.ageMonths > 0 ? ` y ${patientInfo.ageMonths} meses` : ''}
        - Talla: ${patientInfo.height} cm
        - Peso: ${patientInfo.weight} kg
        - Temperatura: ${patientInfo.temperature}°C
        - Ubicación: ${patientInfo.municipality}, ${patientInfo.neighborhood}
        ${patientInfo.conditions.isDiabetic ? '- Paciente diabético' : ''}
        ${patientInfo.conditions.isHypertensive ? '- Paciente hipertenso' : ''}

        ${Object.keys(bloodTest).length > 0 ? `
        Resultados de Biometría Hemática:
        ${bloodTest.redBloodCells ? `- Glóbulos rojos: ${bloodTest.redBloodCells} millones/μL` : ''}
        ${bloodTest.hemoglobin ? `- Hemoglobina: ${bloodTest.hemoglobin} g/dL` : ''}
        ${bloodTest.hematocrit ? `- Hematocrito: ${bloodTest.hematocrit}%` : ''}
        ${bloodTest.whiteBloodCells ? `- Leucocitos: ${bloodTest.whiteBloodCells} células/μL` : ''}
        ${bloodTest.platelets ? `- Plaquetas: ${bloodTest.platelets}/μL` : ''}
        ${bloodTest.neutrophils ? `- Neutrófilos: ${bloodTest.neutrophils}/μL` : ''}
        ${bloodTest.lymphocytes ? `- Linfocitos: ${bloodTest.lymphocytes}/μL` : ''}
        ` : ''}

        ${selectedSymptoms.length > 0 
          ? `Síntomas específicos reportados:
            ${selectedSymptoms.map(id => {
              const symptom = symptoms.find(s => s.id === id);
              return `- ${symptom?.name} (${symptom?.category === 'dengue' ? 'posible dengue' : 'afección respiratoria'})`;
            }).join('\n      ')}`
          : 'El paciente no reporta síntomas específicos de dengue o enfermedades respiratorias.'
        }
        ${patientInfo.additionalInfo ? `\nInformación adicional relevante: ${patientInfo.additionalInfo}` : ''}

        ${selectedSymptoms.length > 0 
          ? `Considera en tu análisis:
            1. La combinación específica de síntomas reportados y su posible relación con dengue o afecciones respiratorias
            2. Evaluación general del paciente incluyendo su IMC y condición física
            3. Posibles riesgos considerando sus condiciones preexistentes
            4. Recomendaciones específicas basadas en los síntomas presentes
            5. Qué especialistas deberían dar seguimiento según los síntomas y condiciones
            6. Señales de alarma a vigilar específicas para los síntomas reportados`
          : `Considera en tu análisis:
            1. Evaluación general del estado de salud del paciente
            2. Análisis del IMC y recomendaciones de salud relacionadas
            3. Evaluación preventiva considerando edad y condición física
            4. Recomendaciones para mantener y mejorar la salud
            5. Sugerencias de chequeos médicos preventivos
            6. Hábitos saludables recomendados`
        }

        ${patientInfo.conditions.isDiabetic || patientInfo.conditions.isHypertensive 
          ? 'Presta especial atención a las complicaciones relacionadas con sus condiciones crónicas.'
          : ''}

        IMPORTANTE: Si el paciente presenta alguno de estos signos de dengue grave:
        - Choque o dificultad respiratoria por extravasación de plasma
        - Sangrado grave
        - Daño orgánico grave
        O signos de alarma como:
        - Dolor abdominal intenso
        - Vómitos persistentes
        - Sangrado de mucosas
        - Letargo o irritabilidad
        - Hepatomegalia >2cm
        
        DEBES indicar "HOSPITALIZACIÓN INMEDIATA" en las recomendaciones y proporcionar la información de los hospitales disponibles.`;

      const analysisResult = await model.generateContent(analysisPrompt);
      if (!analysisResult?.response) {
        throw new Error('No se pudo obtener el análisis médico');
      }
      const medicalAnalysis = analysisResult.response.text();

      // Segundo paso: Estructurar el diagnóstico con instrucciones más específicas
      const structurePrompt = `Basándote en este análisis médico:
        "${medicalAnalysis}"

        Genera un diagnóstico conciso para ${patientInfo.gender === 'masculino' ? 'el' : 'la'} paciente ${patientInfo.fullName} (${patientInfo.ageYears} años${patientInfo.ageMonths > 0 ? ` y ${patientInfo.ageMonths} meses` : ''}) en formato JSON con la siguiente estructura:

        {
          "preliminaryDiagnosis": {
            "condition": "Nombre breve de la condición principal",
            "explanation": "Explicación concisa que incluya solo:\n
              - Síntomas clave presentados\n
              - Valores críticos de laboratorio\n
              - Factor de riesgo principal\n
              - Justificación breve de severidad",
            "severity": "bajo|medio|alto",
            "reasoning": "Razonamiento clínico breve que incluya:\n
              - Diagnóstico principal y alternativo\n
              - Factores determinantes"
          },
          "recommendations": [
            {
              "type": "medicamento|cuidado|seguimiento|preventiva",
              "description": "Descripción breve y directa de la recomendación",
              "dosage": "Dosis específica si aplica",
              "duration": "Duración del tratamiento"
            }
          ],
          "doctors": [
            {
              "specialty": "Especialidad médica",
              "justification": "Razón breve de consulta",
              "name": "Nombre del especialista si está disponible",
              "location": "Ubicación"
            }
          ],
          "warningSignals": [
            "Lista concisa de señales críticas que requieren atención inmediata"
          ]
        }

        Si detectas signos de dengue grave o signos de alarma, incluye esta estructura adicional:
        {
          "requiresHospitalization": true,
          "hospitalizationReason": "Razón específica para hospitalización",
          "availableHospitals": ${JSON.stringify(HOSPITALES_REGION)}
        }

        En caso de requerir hospitalización, agregar como primera recomendación:
        {
          "type": "URGENTE",
          "description": "REQUIERE HOSPITALIZACIÓN INMEDIATA",
          "justification": "Explicación breve de la urgencia"
        }

        Importante: Mantén todas las explicaciones y recomendaciones breves y directas, limitando cada descripción a máximo 2 líneas.`;

      const structureResult = await model.generateContent(structurePrompt);
      if (!structureResult?.response) {
        throw new Error('No se pudo estructurar el diagnóstico');
      }
      
      const structuredResponse = structureResult.response.text();
      
      // Validar que la respuesta no esté vacía
      if (!structuredResponse?.trim()) {
        throw new Error('La respuesta del modelo está vacía');
      }

      let diagnosisData;
      
      try {
        // Limpiar y extraer el JSON
        const cleanResponse = structuredResponse
          .replace(/```json\n?|\n?```/g, '')
          .trim();
        
        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error('Respuesta recibida:', structuredResponse);
          throw new Error('No se encontró un objeto JSON válido en la respuesta');
        }

        diagnosisData = JSON.parse(jsonMatch[0]);
        
        // En la validación del diagnóstico, asegurarnos de que se consideran los síntomas
        if (!diagnosisData.preliminaryDiagnosis || 
            !diagnosisData.preliminaryDiagnosis.condition ||
            !diagnosisData.preliminaryDiagnosis.explanation) {
          diagnosisData.preliminaryDiagnosis = {
            condition: selectedSymptoms.length > 0 
              ? "Evaluación de síntomas múltiples"
              : "Evaluación general de salud",
            explanation: selectedSymptoms.length > 0
              ? `Paciente presenta: ${selectedSymptoms.map(id => 
                  symptoms.find(s => s.id === id)?.name
                ).join(', ')}. Se requiere evaluación médica para diagnóstico definitivo.`
              : "Evaluación general de salud y prevención.",
            severity: "bajo",
            reasoning: selectedSymptoms.length > 0
              ? "Basado en la combinación de síntomas reportados"
              : "Evaluación preventiva"
          };
        }

        // Validar recomendaciones
        if (!Array.isArray(diagnosisData.recommendations) || 
            diagnosisData.recommendations.length === 0) {
          diagnosisData.recommendations = [{
            type: "general",
            description: "Se recomienda consultar con un médico para una evaluación presencial.",
            duration: "Inmediato"
          }];
        }

        // Validar doctores
        if (!Array.isArray(diagnosisData.doctors) || 
            diagnosisData.doctors.length === 0) {
          diagnosisData.doctors = [{
            name: "Por asignar",
            specialty: "Medicina General",
            location: "Consulte con su centro de salud más cercano",
            justification: "Se requiere evaluación médica general"
          }];
        }

        // Validar señales de alarma
        if (!Array.isArray(diagnosisData.warningSignals) || 
            diagnosisData.warningSignals.length === 0) {
          diagnosisData.warningSignals = [
            "Cualquier síntoma que empeore o persista",
            "Desarrollo de nuevos síntomas preocupantes"
          ];
        }

        // Asegurar que cada recomendación tenga los campos requeridos
        diagnosisData.recommendations = diagnosisData.recommendations.map(rec => ({
          type: rec.type || "general",
          description: rec.description || "No se especificó la recomendación",
          dosage: rec.dosage,
          duration: rec.duration || "Según indicación médica"
        }));

        // Asegurar que cada doctor tenga los campos requeridos
        diagnosisData.doctors = diagnosisData.doctors.map(doc => ({
          specialty: doc.specialty || "No especificada",
          justification: doc.justification || "Se requiere evaluación",
          name: doc.name || "Por asignar",
          location: doc.location || "Consulte con su centro de salud"
        }));

        setDiagnosis(diagnosisData);
        setStep(3);
      } catch (parseError) {
        console.error('Error al procesar la respuesta:', parseError);
        // Crear un diagnóstico con mensaje de error
        const errorDiagnosis: Diagnosis = {
          preliminaryDiagnosis: {
            condition: "Error en el procesamiento",
            explanation: "No se pudo generar el diagnóstico correctamente.",
            severity: "bajo",
            reasoning: "Se produjo un error técnico durante el análisis."
          },
          recommendations: [{
            type: "importante",
            description: "Por favor, intente generar el diagnóstico nuevamente o consulte con un médico.",
            duration: "Inmediato"
          }],
          doctors: [{
            specialty: "Medicina General",
            justification: "Se requiere evaluación presencial",
            name: "Por asignar",
            location: "Centro médico más cercano"
          }],
          warningSignals: [
            "Si presenta síntomas graves, busque atención médica inmediata",
            "No ignore síntomas persistentes"
          ]
        };
        setDiagnosis(errorDiagnosis);
        setStep(3);
      }
    } catch (error) {
      console.error('Error en el proceso:', error);
      setError(
        error instanceof Error 
          ? `Error: ${error.message}` 
          : 'Ha ocurrido un error al generar el diagnóstico. Por favor, intente nuevamente.'
      );
      // Asegurarnos de que no avanzamos al siguiente paso si hay error
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setPatientInfo(null);
    setSelectedSymptoms([]);
    setDiagnosis(null);
    setError(null);
  };

  return (
    <div>
      {/* Mostrar barra solo en /consulta */}
      {location.pathname === '/consulta' && (
        <nav className="bg-blue-600 p-4 flex gap-4">
          <Link to="/consulta" className="text-white font-bold">Consulta Georreferenciada</Link>
        </nav>
      )}
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gray-100">
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <img 
                    src="https://portal.ucol.mx/cms/dependenciasv2/img/iconos/escudo-web-color.svg" 
                    alt="Universidad de Colima" 
                    className="h-16"
                  />
                  <Activity className="h-12 w-12 text-blue-500" />
                </div>
                <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
                  Sistema de IA generativa para el Prediagnóstico Médico
                </h1>
                <p className="mt-2 text-gray-600">
                  Asistente de diagnóstico preliminar para dengue y afecciones respiratorias
                </p>
                <button
                  onClick={() => setShowAbout(true)}
                  className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <Info className="h-4 w-4 mr-1" />
                  Acerca de los autores
                </button>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                {/* Términos y condiciones */}
                <div className="mb-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      Acepto los términos y condiciones de uso de la aplicación
                    </label>
                    <button
                      onClick={() => setShowTerms(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Ver términos
                    </button>
                  </div>
                  {!acceptedTerms && (
                    <p className="text-sm text-red-600">
                      Debe aceptar los términos y condiciones para continuar
                    </p>
                  )}
                  
                  {/* Nueva leyenda */}
                  <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 text-sm text-gray-700">
                    Si en su domicilio hay más personas con síntomas similares, complete un formulario de prediagnóstico para cada una de ellas.
                  </div>
                </div>

                {error && (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {acceptedTerms && (
                  <>
                    {step === 1 && <PatientForm onSubmit={handlePatientSubmit} />}
                    {step === 2 && (
                      <div className="space-y-6">
                        <SymptomSelector
                          symptoms={symptoms}
                          selectedSymptoms={selectedSymptoms}
                          onSymptomToggle={handleSymptomToggle}
                          onBloodTestChange={handleBloodTestChange}
                          bloodTestValues={bloodTest}
                        />
                        
                        <button
                          onClick={generateDiagnosis}
                          disabled={loading}
                          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            loading
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                          }`}
                        >
                          {loading ? 'Generando diagnóstico...' : 'Generar diagnóstico'}
                        </button>
                      </div>
                    )}

                    {step === 3 && diagnosis && patientInfo && (
                      <DiagnosisResult
                        diagnosis={diagnosis}
                        patientInfo={patientInfo}
                        selectedSymptoms={selectedSymptoms}
                        onReset={handleReset}
                      />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Modal de términos y condiciones */}
            {showTerms && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
                  <button
                    onClick={() => setShowTerms(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Términos y Condiciones de Uso
                  </h3>
                  <div className="prose prose-sm">
                    <p className="text-gray-600">
                      Los datos recabados serán utilizados con fines estadísticos y sólo en caso de un Brote 
                      Epidémico por Dengue se emitirá un Reporte Epidemiológico del área o zona por 
                      Geolocalización de los Casos Clínicos, a las Autoridades Sanitarias de la Secretaría 
                      de Salud, quienes determinarán las acciones sanitarias preventivas pertinentes en el 
                      control y combate del Dengue, para el beneficio de la Población.
                    </p>
                    <p className="text-gray-600 mt-4">
                      Puedes consultar el aviso de privacidad institucional en el siguiente{' '}
                      <a
                        href="http://shorturl.at/khepa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                      >
                        enlace
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setShowTerms(false)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal de Acerca de */}
            {showAbout && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
                  <button
                    onClick={() => setShowAbout(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                  <div className="flex items-center justify-center mb-6">
                    <img 
                      src="https://portal.ucol.mx/cms/dependenciasv2/img/iconos/escudo-web-color.svg" 
                      alt="Universidad de Colima" 
                      className="h-16"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                    Universidad de Colima
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-600 mb-4">
                      <span className="font-bold">CA UCOL No. 57: "ESTUDIO DE LAS ENFERMEDADES TRANSMISIBLES"</span><br/>
                      <span className="uppercase">
                        D. EN C. HÉCTOR RAFAEL TEJEDA CHÁVEZ, D. EN C. FABIÁN ROJAS LARIOS, D. EN C. SERGIO ADRIÁN MONTERO CRUZ, D. EN C. GABRIEL CEJA ESPÍRITU, D. EN C. MARIO RAMÍREZ FLORES
                      </span>
                    </p>
                    <p className="text-gray-600 mb-4">
                      <span className="font-bold">CA UCOL No. 55: "INGENIERÍA DE SOFTWARE Y TECNOLOGÍAS DE INFORMACIÓN"</span><br/>
                      <span className="uppercase">
                        D. EN E. ARMANDO ROMÁN GALLARDO, D. EN C. JOSÉ ROMÁN HERRERAMORALES, M. EN C. SARA SANDOVAL CARRILLO
                      </span>
                    </p>
                    <p className="text-gray-600">
                      <span className="font-bold">CA UCOL No. 54: "REDES Y TELECOMUNICACIONES"</span><br/>
                      <span className="uppercase">
                        D. EN C. JUAN MANUEL RAMÍREZ ALCARAZ
                      </span>
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setShowAbout(false)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-center text-gray-700">Generando diagnóstico...</p>
                </div>
              </div>
            )}
          </div>
        } />
        <Route path="/consulta" element={<Consulta />} />
      </Routes>
    </div>
  );
}