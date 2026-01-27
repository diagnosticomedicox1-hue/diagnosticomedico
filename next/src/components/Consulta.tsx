import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

const isBrowser = typeof window !== 'undefined';

let MapContainer: any;
let TileLayer: any;
let Marker: any;
let Popup: any;
let L: any;
let iconRespiratorio: any;
let iconDengue: any;
let iconOtros: any;
let iconHospital: any;

if (isBrowser) {
  // Cargamos react-leaflet y leaflet solo en el navegador
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RL = require('react-leaflet');
  MapContainer = RL.MapContainer;
  TileLayer = RL.TileLayer;
  Marker = RL.Marker;
  Popup = RL.Popup;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  L = require('leaflet');

  // Definir iconos personalizados sólo cuando Leaflet está disponible
  iconRespiratorio = new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  iconDengue = new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  iconOtros = new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  iconHospital = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2967/2967350.png', // icono hospital
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowUrl: undefined,
  });
}

interface Registro {
  id: number;
  nombre: string;
  sexo: string;
  edad: number;
  otros_datos: string;
  lat: number;
  lng: number;
  resumen: string;
  diagnostico: string;
  fecha: string;
  clasificacion?: string;
  form_data?: string;
}

type Filtro = 'todos' | 'respiratorio' | 'dengue' | 'otros' | 'busqueda';

const PAGE_SIZE = 10;

// Lista de hospitales de Colima (todos los municipios principales)
const HOSPITALES_COLIMA = [
  // Colima
  {
    nombre: "Hospital Regional Universitario",
    direccion: "Av. Carlos de la Madrid Béjar S/N, Colima, Col.",
    telefono: "312 313 1063",
    correo: "info@hru.colima.gob.mx",
    lat: 19.2497,
    lng: -103.7152
  },
  {
    nombre: "Hospital General de Zona No.1 IMSS",
    direccion: "Av. De los Maestros 149, Colima, Col.",
    telefono: "312 316 1111",
    correo: "info@imss.gob.mx",
    lat: 19.2455,
    lng: -103.7242
  },
  {
    nombre: "ISSSTE Colima",
    direccion: "Av. Gonzalo de Sandoval 750, Colima, Col.",
    telefono: "312 312 1270",
    correo: "info@issste.gob.mx",
    lat: 19.2491,
    lng: -103.7016
  },
  // Villa de Álvarez
  {
    nombre: "Hospital General Villa de Álvarez",
    direccion: "Av. J. Merced Cabrera 100, Villa de Álvarez, Col.",
    telefono: "312 316 6000",
    correo: "info@hgvilla.gob.mx",
    lat: 19.2781,
    lng: -103.7352
  },
  // Tecomán
  {
    nombre: "Hospital General Tecomán",
    direccion: "Av. Insurgentes 100, Tecomán, Col.",
    telefono: "313 324 2000",
    correo: "info@hgtecoman.gob.mx",
    lat: 18.9146,
    lng: -103.8762
  },
  {
    nombre: "IMSS Tecomán",
    direccion: "Calle 5 de Mayo 100, Tecomán, Col.",
    telefono: "313 324 1000",
    correo: "info@imsstecoman.gob.mx",
    lat: 18.9172,
    lng: -103.8775
  },
  // Manzanillo
  {
    nombre: "Hospital General Manzanillo",
    direccion: "Av. Elías Zamora Verduzco 100, Manzanillo, Col.",
    telefono: "314 332 1000",
    correo: "info@hgmanzanillo.gob.mx",
    lat: 19.1042,
    lng: -104.3386
  },
  {
    nombre: "IMSS Manzanillo",
    direccion: "Av. Paseo de las Gaviotas 100, Manzanillo, Col.",
    telefono: "314 332 2000",
    correo: "info@imssmanzanillo.gob.mx",
    lat: 19.1131,
    lng: -104.3421
  },
  // Armería
  {
    nombre: "Centro de Salud Armería",
    direccion: "Calle Independencia 50, Armería, Col.",
    telefono: "313 327 1000",
    correo: "info@csarmeria.gob.mx",
    lat: 18.9352,
    lng: -103.9631
  },
  // Coquimatlán
  {
    nombre: "Centro de Salud Coquimatlán",
    direccion: "Calle Hidalgo 10, Coquimatlán, Col.",
    telefono: "312 327 2000",
    correo: "info@cscoquimatlan.gob.mx",
    lat: 19.1801,
    lng: -103.8192
  },
  // Comala
  {
    nombre: "Centro de Salud Comala",
    direccion: "Calle Juárez 5, Comala, Col.",
    telefono: "312 327 3000",
    correo: "info@cscomala.gob.mx",
    lat: 19.2881,
    lng: -103.7592
  },
  // Cuauhtémoc
  {
    nombre: "Centro de Salud Cuauhtémoc",
    direccion: "Calle Morelos 20, Cuauhtémoc, Col.",
    telefono: "312 327 4000",
    correo: "info@cscuauhtemoc.gob.mx",
    lat: 19.3641,
    lng: -103.6702
  },
  // Ixtlahuacán
  {
    nombre: "Centro de Salud Ixtlahuacán",
    direccion: "Calle Hidalgo 15, Ixtlahuacán, Col.",
    telefono: "312 327 5000",
    correo: "info@csixtlahuacan.gob.mx",
    lat: 18.9081,
    lng: -103.7672
  },
  // Minatitlán
  {
    nombre: "Centro de Salud Minatitlán",
    direccion: "Calle Juárez 8, Minatitlán, Col.",
    telefono: "312 327 6000",
    correo: "info@csminatitlan.gob.mx",
    lat: 19.3831,
    lng: -104.0492
  }
];

// Determinar tipo de diagnóstico usando el campo 'clasificacion' si existe
function getTipoDiagnostico(registro: Registro): 'respiratorio' | 'dengue' | 'otros' {
  if (registro.clasificacion) {
    const c = registro.clasificacion.toLowerCase();
    if (c.includes('respiratorio')) return 'respiratorio';
    if (c.includes('dengue')) return 'dengue';
    return 'otros';
  }
  // Fallback: analizar el texto del diagnóstico
  const diag = registro.diagnostico?.toLowerCase() || '';
  if (diag.includes('respiratorio')) return 'respiratorio';
  if (diag.includes('dengue')) return 'dengue';
  return 'otros';
}

function getIcon(registro: Registro) {
  const tipo = getTipoDiagnostico(registro);
  if (tipo === 'respiratorio') return iconRespiratorio;
  if (tipo === 'dengue') return iconDengue;
  return iconOtros;
}

function filtrarRegistros(registros: Registro[], filtro: Filtro, busqueda: string) {
  if (filtro === 'respiratorio') {
    return registros.filter(r => getTipoDiagnostico(r) === 'respiratorio');
  }
  if (filtro === 'dengue') {
    return registros.filter(r => getTipoDiagnostico(r) === 'dengue');
  }
  if (filtro === 'otros') {
    return registros.filter(r => getTipoDiagnostico(r) === 'otros');
  }
  if (filtro === 'busqueda' && busqueda.trim()) {
    return registros.filter(r => r.diagnostico.toLowerCase().includes(busqueda.toLowerCase()));
  }
  return registros;
}

const Consulta: React.FC = () => {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [modalRegistro, setModalRegistro] = useState<Registro | null>(null);
  const [selectedForm, setSelectedForm] = useState<Registro | null>(null);

  useEffect(() => {
    fetch('/api/consultas')
      .then(res => res.json())
      .then(data => setRegistros(data));
  }, []);

  const registrosFiltrados = filtrarRegistros(registros, filtro, busqueda);
  const totalPaginas = Math.ceil(registrosFiltrados.length / PAGE_SIZE);
  const registrosPagina = registrosFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  // Centro del mapa: Colima, Colima, México
  const centro: [number, number] = [19.2433, -103.725];

  // Evitar scroll de fondo cuando el modal está abierto (solo en navegador)
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (modalRegistro || selectedForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [modalRegistro, selectedForm]);

  const [mapState, setMapState] = useState({ mounted: false, key: 0 });

  useEffect(() => {
    // Función de limpieza para eliminar el rastro de Leaflet del contenedor
    const cleanup = () => {
      const container = document.getElementById('map-container-active');
      if (container) {
        // @ts-ignore - Acceso interno de Leaflet para limpiar el ID
        delete container._leaflet_id;
      }
    };

    // Desmontar primero
    setMapState(prev => ({ mounted: false, key: prev.key }));
    cleanup();

    // Re-montar con nueva key tras un breve delay
    const timer = setTimeout(() => {
      setMapState(prev => ({
        mounted: true,
        key: prev.key + 1
      }));
    }, 150);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [filtro]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Consulta de Registros Georreferenciados</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => { setFiltro('todos'); setPagina(1); }} className={`px-3 py-1 rounded ${filtro === 'todos' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Todos</button>
        <button onClick={() => { setFiltro('respiratorio'); setPagina(1); }} className={`px-3 py-1 rounded ${filtro === 'respiratorio' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Respiratorias</button>
        <button onClick={() => { setFiltro('dengue'); setPagina(1); }} className={`px-3 py-1 rounded ${filtro === 'dengue' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Dengue</button>
        <button onClick={() => { setFiltro('otros'); setPagina(1); }} className={`px-3 py-1 rounded ${filtro === 'otros' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Otros</button>
        <input
          type="text"
          placeholder="Consulta libre..."
          value={busqueda}
          onChange={e => { setBusqueda(e.target.value); setFiltro('busqueda'); setPagina(1); }}
          className="px-2 py-1 border rounded"
        />
      </div>
      <div
        id="map-container-active"
        key={`map-wrapper-${mapState.key}`}
        className="h-[400px] w-full mb-4"
      >
        {mapState.mounted && (
          <MapContainer
            key={`map-instance-${mapState.key}`}
            center={centro}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Marcadores de hospitales */}
            {HOSPITALES_COLIMA.map(h => (
              <Marker key={h.nombre} position={[h.lat, h.lng]} icon={iconHospital}>
                <Popup>
                  <div>
                    <strong>{h.nombre}</strong><br />
                    <span className="block text-xs text-gray-700">{h.direccion}</span>
                    <span className="block text-xs text-gray-700">Tel: {h.telefono}</span>
                    <span className="block text-xs text-gray-700">Correo: {h.correo}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
            {/* Marcadores de registros */}
            {registrosFiltrados.map(r => (
              <Marker key={r.id} position={[r.lat, r.lng]} icon={getIcon(r)}>
                <Popup>
                  <div>
                    <strong>{r.nombre}</strong><br />
                    {r.diagnostico.slice(0, 60)}...<br />
                    <span className="text-xs text-gray-500">{new Date(r.fecha).toLocaleString()}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Registros encontrados: {registrosFiltrados.length}</h3>
        <ul className="divide-y divide-gray-200">
          {registrosPagina.map(r => (
            <li key={r.id} className="py-2 cursor-pointer hover:bg-blue-50 rounded flex justify-between items-center" onClick={() => setModalRegistro(r)}>
              <div>
                <div className="font-bold flex items-center gap-2">
                  {getTipoDiagnostico(r) === 'respiratorio' && <span className="inline-block w-3 h-3 rounded-full bg-blue-500" title="Respiratorio"></span>}
                  {getTipoDiagnostico(r) === 'dengue' && <span className="inline-block w-3 h-3 rounded-full bg-orange-500" title="Dengue"></span>}
                  {getTipoDiagnostico(r) === 'otros' && <span className="inline-block w-3 h-3 rounded-full bg-pink-400" title="Otro"></span>}
                  {r.nombre} ({r.edad} años, {r.sexo})
                </div>
                <div className="text-sm text-gray-700">{r.diagnostico.slice(0, 120)}...</div>
                <div className="text-xs text-gray-500">{new Date(r.fecha).toLocaleString()}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setSelectedForm(r); }} className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">Ver Formulario</button>
            </li>

          ))}
        </ul>
        <div className="flex gap-2 mt-2">
          <button disabled={pagina === 1} onClick={() => setPagina(p => p - 1)} className="px-2 py-1 border rounded disabled:opacity-50">Anterior</button>
          <span>Página {pagina} de {totalPaginas}</span>
          <button disabled={pagina === totalPaginas || totalPaginas === 0} onClick={() => setPagina(p => p + 1)} className="px-2 py-1 border rounded disabled:opacity-50">Siguiente</button>
        </div>
      </div>
      {/* Modal de detalles */}
      {selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto" style={{ zIndex: 10000 }}>
            <button onClick={() => setSelectedForm(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">×</button>
            <h3 className="text-xl font-bold mb-2">Datos del Formulario</h3>
            <div className="space-y-2 text-sm">
              {selectedForm.form_data ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs">
                  {(() => {
                    let parsed;
                    try {
                      parsed = JSON.parse(selectedForm.form_data);
                    } catch {
                      return <span className="text-gray-400">Datos no disponibles o inválidos</span>;
                    }
                    if (!parsed || typeof parsed !== 'object') return <span className="text-gray-400">Datos no disponibles</span>;
                    return (
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(parsed).map(([key, value]) => (
                          <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-1">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold mr-2 capitalize min-w-[120px]">{key.replace(/_/g, ' ')}:</span>
                            <span className="text-gray-700 whitespace-pre-wrap">{typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <p className="text-gray-500">No hay datos de formulario disponibles.</p>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setSelectedForm(null)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Cerrar</button>
            </div>
          </div>
        </div>
      )}
      {modalRegistro && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto" style={{ zIndex: 10000 }}>
            <button onClick={() => setModalRegistro(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">×</button>
            <h3 className="text-xl font-bold mb-2">Datos del Registro</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Nombre:</strong> {modalRegistro.nombre}</div>
              <div><strong>Sexo:</strong> {modalRegistro.sexo}</div>
              <div><strong>Edad:</strong> {modalRegistro.edad}</div>
              <div><strong>Fecha:</strong> {new Date(modalRegistro.fecha).toLocaleString()}</div>
              <div><strong>Latitud:</strong> {modalRegistro.lat}</div>
              <div><strong>Longitud:</strong> {modalRegistro.lng}</div>
              <div><strong>Resumen:</strong> {modalRegistro.resumen}</div>
              <div>
                <strong>Diagnóstico:</strong>
                <div className="mt-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs">
                  {(() => {
                    let parsed;
                    try {
                      parsed = JSON.parse(modalRegistro.diagnostico);
                    } catch {
                      return <span className="text-gray-700">{modalRegistro.diagnostico}</span>;
                    }
                    if (!parsed || typeof parsed !== 'object') return <span className="text-gray-700">{modalRegistro.diagnostico}</span>;
                    return (
                      <div className="space-y-1">
                        {parsed.municipio && (
                          <div><strong>Municipio:</strong> {parsed.municipio}</div>
                        )}
                        {parsed.colonia && (
                          <div><strong>Colonia:</strong> {parsed.colonia}</div>
                        )}
                        {parsed.calle && (
                          <div><strong>Calle:</strong> {parsed.calle}</div>
                        )}
                        {parsed.preliminaryDiagnosis && (
                          <div>
                            <strong>Condición:</strong> {parsed.preliminaryDiagnosis.condition}<br />
                            <strong>Explicación:</strong> {parsed.preliminaryDiagnosis.explanation}<br />
                            <strong>Severidad:</strong> {parsed.preliminaryDiagnosis.severity}<br />
                            <strong>Razonamiento:</strong> {parsed.preliminaryDiagnosis.reasoning}
                          </div>
                        )}
                        {parsed.recommendations && Array.isArray(parsed.recommendations) && (
                          <div>
                            <strong>Recomendaciones:</strong>
                            <ul className="list-disc ml-5">
                              {parsed.recommendations.map((rec: any, i: number) => (
                                <li key={i}>{rec.type}: {rec.description} {rec.dosage ? `- Dosis: ${rec.dosage}` : ''} {rec.duration ? `- Duración: ${rec.duration}` : ''}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {parsed.doctors && Array.isArray(parsed.doctors) && (
                          <div>
                            <strong>Especialistas recomendados:</strong>
                            <ul className="list-disc ml-5">
                              {parsed.doctors.map((doc: any, i: number) => (
                                <li key={i}>{doc.name} ({doc.specialty}) - {doc.location}. {doc.justification}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {parsed.warningSignals && Array.isArray(parsed.warningSignals) && (
                          <div>
                            <strong>Señales de alarma:</strong>
                            <ul className="list-disc ml-5">
                              {parsed.warningSignals.map((ws: any, i: number) => (
                                <li key={i}>{ws}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
              <div>
                <strong>Otros datos:</strong>
                <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs">
                  {(() => {
                    let parsed;
                    try {
                      parsed = JSON.parse(modalRegistro.otros_datos);
                    } catch {
                      return <span className="text-gray-400">Sin datos adicionales</span>;
                    }
                    if (!parsed || typeof parsed !== 'object') return <span className="text-gray-400">Sin datos adicionales</span>;
                    return (
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(parsed).map(([key, value]) => (
                          <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-1">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold mr-2 capitalize min-w-[120px]">{key.replace(/_/g, ' ')}:</span>
                            <span className="text-gray-700">{typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setModalRegistro(null)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consulta;