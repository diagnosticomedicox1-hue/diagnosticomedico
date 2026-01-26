import React, { useEffect, useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { AlertTriangle, Download, RotateCcw } from 'lucide-react';
import { Diagnosis, PatientInfo } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface DiagnosisResultProps {
  diagnosis: Diagnosis;
  patientInfo: PatientInfo;
  selectedSymptoms: string[];
  onReset: () => void;
}

const generatePDF = async (diagnosis: Diagnosis, patientInfo: PatientInfo, selectedSymptoms: string[]) => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const addNewPage = () => {
    const page = pdfDoc.addPage([595.276, 841.890]); // A4
    return { page, yOffset: 800 };
  };

  // Función modificada para manejar saltos de línea
  const writeText = (text: string, { page, yOffset }: { page: any, yOffset: number }, fontSize: number = 12, isTitle: boolean = false) => {
    const font = isTitle ? timesBoldFont : timesRomanFont;
    const maxWidth = 500;

    // Dividir el texto en líneas
    const paragraphs = text.split('\n');
    let currentY = yOffset;

    for (const paragraph of paragraphs) {
      const words = paragraph.split(' ');
      let line = '';

      for (const word of words) {
        const testLine = line + word + ' ';
        const width = font.widthOfTextAtSize(testLine, fontSize);

        if (width > maxWidth && line.length > 0) {
          // Verificar espacio en página
          if (currentY < 50) {
            const newPageData = addNewPage();
            page = newPageData.page;
            currentY = newPageData.yOffset;
          }

          // Escribir línea actual
          page.drawText(line.trim(), {
            x: 50,
            y: currentY,
            font: font,
            size: fontSize,
            color: rgb(0, 0, 0),
          });

          line = word + ' ';
          currentY -= fontSize + 2;
        } else {
          line = testLine;
        }
      }

      // Escribir última línea del párrafo
      if (line.trim().length > 0) {
        if (currentY < 50) {
          const newPageData = addNewPage();
          page = newPageData.page;
          currentY = newPageData.yOffset;
        }

        page.drawText(line.trim(), {
          x: 50,
          y: currentY,
          font: font,
          size: fontSize,
          color: rgb(0, 0, 0),
        });
        currentY -= fontSize + 2;
      }

      // Espacio extra entre párrafos
      currentY -= fontSize;
    }

    return { page, yOffset: currentY };
  };

  let { page, yOffset } = addNewPage();

  // Encabezado
  let pageData = writeText('REPORTE DE DIAGNÓSTICO PRELIMINAR', { page, yOffset }, 16, true);
  page = pageData.page;
  yOffset = pageData.yOffset - 20; // Espacio después del título

  // Información del paciente
  pageData = writeText(`Paciente: ${patientInfo.fullName}`, { page, yOffset }, 12, true);
  page = pageData.page;
  yOffset = pageData.yOffset - 10;

  pageData = writeText(`Edad: ${patientInfo.ageYears} años${patientInfo.ageMonths > 0 ? ` y ${patientInfo.ageMonths} meses` : ''}`, { page, yOffset });
  page = pageData.page;
  yOffset = pageData.yOffset;

  pageData = writeText(`Temperatura: ${patientInfo.temperature}°C`, { page, yOffset });
  page = pageData.page;
  yOffset = pageData.yOffset;

  // Para la explicación del diagnóstico, separar en párrafos
  const explanationText = diagnosis.preliminaryDiagnosis.explanation
    .replace(/\n+/g, ' ') // Reemplazar múltiples saltos de línea con espacio
    .trim();

  pageData = writeText('DIAGNÓSTICO PRELIMINAR', { page, yOffset: yOffset - 20 }, 14, true);
  page = pageData.page;
  yOffset = pageData.yOffset - 10;

  pageData = writeText(`Condición: ${diagnosis.preliminaryDiagnosis.condition}`, { page, yOffset });
  page = pageData.page;
  yOffset = pageData.yOffset - 10;

  pageData = writeText('Explicación:', { page, yOffset });
  page = pageData.page;
  yOffset = pageData.yOffset - 10;

  pageData = writeText(explanationText, { page, yOffset });
  page = pageData.page;
  yOffset = pageData.yOffset;

  // Recomendaciones
  pageData = writeText('\nRECOMENDACIONES', { page, yOffset: yOffset - 20 }, 14, true);
  page = pageData.page;
  yOffset = pageData.yOffset;

  for (const rec of diagnosis.recommendations) {
    pageData = writeText(`• ${rec.description}${rec.dosage ? ` - Dosis: ${rec.dosage}` : ''}${rec.duration ? ` - Duración: ${rec.duration}` : ''}`, { page, yOffset });
    page = pageData.page;
    yOffset = pageData.yOffset;
  }

  // Especialistas
  pageData = writeText('\nESPECIALISTAS RECOMENDADOS', { page, yOffset: yOffset - 20 }, 14, true);
  page = pageData.page;
  yOffset = pageData.yOffset;

  for (const doctor of diagnosis.doctors) {
    pageData = writeText(`• ${doctor.name} (${doctor.specialty})`, { page, yOffset });
    page = pageData.page;
    yOffset = pageData.yOffset;
  }

  // Señales de alarma
  pageData = writeText('\nSEÑALES DE ALARMA', { page, yOffset: yOffset - 20 }, 14, true);
  page = pageData.page;
  yOffset = pageData.yOffset;

  for (const signal of diagnosis.warningSignals) {
    pageData = writeText(`• ${signal}`, { page, yOffset });
    page = pageData.page;
    yOffset = pageData.yOffset;
  }

  // Nota final
  pageData = writeText('\nNOTA FINAL', { page, yOffset: yOffset - 20 }, 14, true);
  page = pageData.page;
  yOffset = pageData.yOffset;

  pageData = writeText('Este es un diagnóstico preliminar. Por favor consulte a un médico para un diagnóstico definitivo.', { page, yOffset });
  page = pageData.page;
  yOffset = pageData.yOffset;

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

export default function DiagnosisResult({
  diagnosis,
  patientInfo,
  selectedSymptoms,
  onReset,
}: DiagnosisResultProps) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error' | 'pending'>('idle');

  const API_KEY = 'AIzaSyBuhKP_j_XyLfk0lbqrqnlxY8KjsW83pUE';
  const genAI = new GoogleGenerativeAI(API_KEY);

  useEffect(() => {
    // Función para obtener la posición GPS
    const getPosition = () => {
      return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocalización no soportada'));
        } else {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
            },
            (err) => reject(err),
            { enableHighAccuracy: true, timeout: 10000 }
          );
        }
      });
    };

    // Función para generar resumen de 100 palabras
    const getSummary = (text: string) => {
      const words = text.split(/\s+/).slice(0, 100);
      return words.join(' ');
    };

    // Clasificar diagnóstico usando Gemini
    const clasificarDiagnostico = async (diagnostico) => {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Clasifica el siguiente diagnóstico médico en una de estas categorías: 'respiratorio', 'dengue' u 'otros'. Responde solo la palabra de la categoría.\nDiagnóstico: ${diagnostico}`;
      try {
        const result = await model.generateContent(prompt);
        const text = result?.response?.text()?.toLowerCase().trim();
        if (text.includes('respiratorio')) return 'respiratorio';
        if (text.includes('dengue')) return 'dengue';
        return 'otros';
      } catch {
        return 'otros';
      }
    };

    // Enviar datos al backend
    const saveConsulta = async () => {
      setSaveStatus('pending');
      try {
        const { lat, lng } = await getPosition();
        const resumen = getSummary(diagnosis.preliminaryDiagnosis.explanation);
        // Preparar datos del paciente
        const { fullName, gender, ageYears, ageMonths, temperature, municipality, neighborhood, additionalInfo, conditions, street } = patientInfo;
        const otros_datos = JSON.stringify({ municipality, neighborhood, street, additionalInfo, conditions });
        const clasificacion = await clasificarDiagnostico(diagnosis.preliminaryDiagnosis.explanation);
        // Agregar municipio, colonia y calle al JSON del diagnóstico
        const diagnosisWithLocation = {
          ...diagnosis,
          municipio: municipality,
          colonia: neighborhood,
          calle: street || '',
        };
        const payload = {
          nombre: fullName,
          sexo: gender,
          edad: ageYears,
          otros_datos,
          lat,
          lng,
          resumen,
          diagnostico: JSON.stringify(diagnosisWithLocation),
          clasificacion
        };
        const res = await fetch('https://bkclhs5s-3001.usw3.devtunnels.ms/diagnostico', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setSaveStatus('success');
        } else {
          setSaveStatus('error');
        }
      } catch (err) {
        setSaveStatus('error');
      }
    };

    saveConsulta();
    // eslint-disable-next-line
  }, []);

  const downloadPDF = async () => {
    const pdfBytes = await generatePDF(diagnosis, patientInfo, selectedSymptoms);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostico_${patientInfo.fullName.replace(/\s+/g, '_')}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Mensaje de guardado */}
      {saveStatus === 'success' && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">Registro guardado correctamente.</div>
      )}
      {saveStatus === 'error' && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">Error al guardar el registro.</div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Diagnóstico para {patientInfo.fullName}
        </h2>
        <div className="flex gap-4">
          <button
            onClick={downloadPDF}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Nuevo Diagnóstico
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Este es un diagnóstico preliminar. Por favor consulte a un médico para un diagnóstico definitivo.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Diagnóstico Preliminar</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {/* Diagnóstico preliminar */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900">{diagnosis.preliminaryDiagnosis.condition}</h4>
            <p className="mt-2 text-gray-600">{diagnosis.preliminaryDiagnosis.explanation}</p>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${diagnosis.preliminaryDiagnosis.severity === 'alto' ? 'bg-red-100 text-red-800' :
                  diagnosis.preliminaryDiagnosis.severity === 'medio' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                }`}>
                Severidad: {diagnosis.preliminaryDiagnosis.severity}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">{diagnosis.preliminaryDiagnosis.reasoning}</p>
          </div>

          {/* Recomendaciones */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900">Recomendaciones:</h4>
            <ul className="mt-2 space-y-2">
              {diagnosis.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-600">
                  <span className="font-medium">{rec.type}: </span>
                  {rec.description}
                  {rec.dosage && <span className="block text-sm text-gray-500">Dosis: {rec.dosage}</span>}
                  {rec.duration && <span className="block text-sm text-gray-500">Duración: {rec.duration}</span>}
                </li>
              ))}
            </ul>
          </div>

          {/* Especialistas */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900">Especialistas Recomendados:</h4>
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              {diagnosis.doctors.map((doctor, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <p className="font-medium">{doctor.name}</p>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  <p className="text-sm text-gray-500">{doctor.location}</p>
                  <p className="text-sm text-gray-600 mt-1">{doctor.justification}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Señales de alarma */}
          <div>
            <h4 className="font-medium text-gray-900">Señales de Alarma:</h4>
            <ul className="mt-2 list-disc list-inside space-y-1">
              {diagnosis.warningSignals.map((signal, index) => (
                <li key={index} className="text-gray-600">{signal}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}