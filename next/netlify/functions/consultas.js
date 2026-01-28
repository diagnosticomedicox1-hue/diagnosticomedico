// API endpoint compatible con Next.js para Netlify
export async function handler(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    };
  }

  try {
    // Conectar a la base de datos local (simulada para deploy)
    // En producción, esto se conectaría a Turso
    
    // Datos de ejemplo que simulan conexión a Turso
    const datosDemo = [
      {
        id: "1",
        nombre: "Ana Teroja",
        edad: 30,
        sexo: "femenino",
        otros_datos: {
          municipality: "Colima, Colima.",
          neighborhood: "Av. Universidad #333, Colonia las víboras.",
          conditions: {
            isDiabetic: false,
            isHypertensive: true
          }
        },
        lat: 19.249857420536607,
        lng: -103.6988217414492,
        resumen: "Fiebre alta, tos persistente, congestión nasal, dolor de garganta. Presión arterial inestable, riesgo de deshidratación. Hipertensión arterial como factor de riesgo principal. Severidad alta por comorbilidad. Dificultad respiratoria y sangrado de mucosas son señales de alarma críticas.",
        diagnostico: {
          preliminaryDiagnosis: {
            condition: "Infección Viral Aguda (Sospecha de Dengue o ITRS) con Hipertensión Preexistente Descompensada",
            explanation: "Fiebre alta, tos persistente, congestión nasal, dolor de garganta. Presión arterial inestable, riesgo de deshidratación. Hipertensión arterial como factor de riesgo principal. Severidad alta por comorbilidad. Dificultad respiratoria y sangrado de mucosas son señales de alarma críticas.",
            severity: "alto",
            reasoning: "Coexistencia de síntomas infecciosos agudos y condición cardiovascular crónica. Dengue y la hipertensión elevan el riesgo de complicaciones graves. Síntomas respiratorios pueden indicar neumonía."
          }
        },
        recommendations: [
          {
            type: "URGENTE",
            description: "REQUIERE HOSPITALIZACIÓN INMEDIATA",
            duration: "Según indicación médica"
          },
          {
            type: "medicamento",
            description: "Paracetamol (Acetaminofén) para control de fiebre y dolor.",
            dosage: "500-1000 mg cada 6-8 horas según necesidad.",
            duration: "Según evolución sintomática."
          }
        ],
        doctors: [
          {
            specialty: "Medicina Interna",
            justification: "Manejo de la condición infecciosa y comorbilidad (hipertensión).",
            name: "Por asignar",
            location: "Hospital"
          }
        ],
        warningSignals: [
          "Dolor abdominal intenso y continuo",
          "Vómitos persistentes",
          "Sangrado de mucosas (encías, nariz)"
        ],
        requiresHospitalization: true,
        hospitalizationReason: "Presencia de signos de alarma (dificultad respiratoria, sangrado de mucosas) y el riesgo elevado por la hipertensión arterial preexistente sugieren una posible descompensación grave y la necesidad de monitorización y manejo intensivo.",
        availableHospitals: [
          {
            nombre: "Hospital Regional Universitario",
            direccion: "Av. Carlos de la Madrid Béjar S/N, Colima, Col.",
            telefono: "312 313 1063",
            tipo: "Público"
          }
        ],
        municipio: "Colima, Colima.",
        colonia: "Av. Universidad #333, Colonia las víboras.",
        clasificacion: "respiratorio",
        fecha: "2026-01-28T16:50:52.292Z"
      },
      {
        id: "2",
        nombre: "Marco Toys",
        edad: 25,
        sexo: "masculino",
        otros_datos: {
          municipality: "Colima, Colima.",
          neighborhood: "Av. Universidad #333, Colonia las víboras.",
          conditions: {
            isDiabetic: false,
            isHypertensive: true
          }
        },
        lat: 19.24984457915796,
        lng: -103.6988302245578,
        resumen: "Paciente Marco Toys (25años, 8m) presenta fiebre alta, petequias (signo de alarma de dengue), tos persistente y congestión nasal. IMC de 30.47 (Obesidad Clase I) e Hipertensión Arterial (HTA) preexistente aumentan el riesgo de complicaciones graves.",
        diagnostico: {
          preliminaryDiagnosis: {
            condition: "Sospecha de Dengue con Afección Respiratoria Coexistente",
            explanation: "Paciente Marco Toys (25años, 8m) presenta fiebre alta, petequias (signo de alarma de dengue), tos persistente y congestión nasal. IMC de 30.47 (Obesidad Clase I) e Hipertensión Arterial (HTA) preexistente aumentan el riesgo de complicaciones graves.",
            severity: "alto",
            reasoning: "El diagnóstico principal es la sospecha de Dengue debido a la fiebre alta, las petequias (zona endémica) y los factores de riesgo (HTA, obesidad). Coexiste una posible infección respiratoria viral. Las comorbilidades y los signos de alarma sugieren un alto riesgo de complicaciones."
          }
        },
        recommendations: [
          {
            type: "URGENTE",
            description: "REQUIERE HOSPITALIZACIÓN INMEDIATA",
            duration: "Según indicación médica"
          }
        ],
        doctors: [
          {
            specialty: "Médico Internista / Infectólogo",
            justification: "Manejo avanzado, monitoreo de complicaciones y ajuste de tratamiento para dengue y comorbilidades.",
            name: "Por asignar",
            location: "Colima, Colima"
          }
        ],
        warningSignals: [
          "Dolor abdominal intenso y continuo",
          "Vómitos persistentes (3+ en 1 hora, 4-5 en 6 horas)",
          "Cualquier sangrado de mucosas (encías, nariz, vaginal, etc.)"
        ],
        requiresHospitalization: true,
        hospitalizationReason: "Presencia de petequias, un signo de alarma importante para dengue, que indica fragilidad capilar y riesgo de sangrado. Requiere evaluación médica urgente y monitoreo estrecho debido a sus condiciones preexistentes (HTA, obesidad).",
        availableHospitals: [
          {
            nombre: "Hospital Regional Universitario",
            direccion: "Av. Carlos de la Madrid Béjar S/N, Colima, Col.",
            telefono: "312 313 1063",
            tipo: "Público"
          }
        ],
        municipio: "Colima, Colima.",
        colonia: "Av. Universidad #333, Colonia las víboras.",
        clasificacion: "dengue",
        fecha: "2026-01-27T18:49:50.174Z"
      }
    ];

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: JSON.stringify(datosDemo)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: JSON.stringify({
        error: "Error al obtener los registros",
        success: false
      })
    };
  }
}