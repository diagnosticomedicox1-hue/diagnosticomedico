# 🏥 Sistema de IA Generativa para Prediagnóstico Médico

Sistema web inteligente que utiliza IA generativa (Google Gemini) para proporcionar prediagnósticos médicos basados en síntomas y datos del paciente. Incluye geolocalización de consultas y generación de reportes en PDF.

## 🌟 Características

- **Diagnóstico con IA**: Utiliza Google Gemini AI para analizar síntomas y generar prediagnósticos
- **Formulario Inteligente**: Captura información detallada del paciente
- **Geolocalización**: Registra y visualiza consultas en un mapa interactivo
- **Generación de PDF**: Crea reportes médicos descargables
- **Historial de Consultas**: Almacena y consulta diagnósticos previos
- **Backend con SQLite**: Base de datos ligera y eficiente
- **Interfaz Moderna**: Diseño responsive con React y TailwindCSS

## 🛠️ Tecnologías

### Frontend
- **React 18** con TypeScript
- **Vite** - Build tool ultrarrápido
- **TailwindCSS** - Estilos modernos
- **React Router** - Navegación
- **Leaflet** - Mapas interactivos
- **jsPDF** - Generación de PDFs
- **Lucide React** - Iconos

### Backend
- **Node.js** con Express
- **SQLite3** - Base de datos
- **CORS** - Manejo de peticiones cross-origin

### IA
- **Google Gemini AI** - Modelo de lenguaje generativo

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- API Key de Google Gemini ([Obtener aquí](https://makersuite.google.com/app/apikey))

## 🚀 Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/diagnosticomedicox1-hue/diagnosticomedico.git
cd diagnosticomedico
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` y añade tu API key de Google Gemini:

```env
VITE_GEMINI_API_KEY=tu_api_key_real_aqui
```

### 3. Instalar dependencias

```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd backend
npm install
cd ..
```

### 4. Ejecutar el proyecto

```bash
# Ejecuta frontend y backend simultáneamente
npm run dev
```

El proyecto estará disponible en:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## 📦 Scripts Disponibles

- `npm run dev` - Inicia frontend y backend en modo desarrollo
- `npm run build` - Construye el proyecto para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter
- `npm run server` - Inicia solo el backend

## 🌐 Despliegue en StackBlitz

### Opción 1: Importar desde GitHub (Recomendado)

1. Asegúrate de que tu código está en GitHub
2. Ve a [StackBlitz](https://stackblitz.com/)
3. Haz clic en **"Import from GitHub"**
4. Selecciona tu repositorio: `diagnosticomedicox1-hue/diagnosticomedico`
5. StackBlitz detectará automáticamente la configuración de Vite
6. Configura las variables de entorno en StackBlitz:
   - Ve a **Settings** → **Environment Variables**
   - Añade `VITE_GEMINI_API_KEY` con tu API key

### Opción 2: Abrir directamente con URL

Puedes abrir el proyecto directamente con esta URL:

```
https://stackblitz.com/github/diagnosticomedicox1-hue/diagnosticomedico
```

### Configuración en StackBlitz

El proyecto está configurado para funcionar automáticamente en StackBlitz:

- ✅ **Proxy configurado**: Las peticiones al backend se redirigen automáticamente
- ✅ **Concurrently**: Frontend y backend se inician juntos con `npm run dev`
- ✅ **SQLite compatible**: Funciona en WebContainers de StackBlitz

> **Nota**: Los datos en la base de datos SQLite en StackBlitz son volátiles y se perderán al reiniciar el contenedor.

## 📁 Estructura del Proyecto

```
diagnosticomedico/
├── backend/
│   ├── index.js           # Servidor Express
│   ├── package.json       # Dependencias del backend
│   └── database.db        # Base de datos SQLite (generada automáticamente)
├── src/
│   ├── components/        # Componentes React
│   ├── pages/            # Páginas de la aplicación
│   ├── services/         # Servicios (API, Gemini)
│   ├── types/            # Tipos TypeScript
│   ├── App.tsx           # Componente principal
│   └── main.tsx          # Punto de entrada
├── public/               # Archivos estáticos
├── .env.example          # Plantilla de variables de entorno
├── package.json          # Dependencias del frontend
├── vite.config.ts        # Configuración de Vite
├── tailwind.config.js    # Configuración de TailwindCSS
└── README.md             # Este archivo
```

## 🔧 Configuración

### Proxy de Vite

El archivo `vite.config.ts` está configurado para redirigir las peticiones del frontend al backend:

```typescript
server: {
  proxy: {
    '/diagnostico': 'http://localhost:3001',
    '/consultas': 'http://localhost:3001',
  },
}
```

### API Service

El servicio de API (`src/services/api.ts`) usa rutas relativas que funcionan tanto en desarrollo local como en StackBlitz gracias al proxy.

## 🔐 Seguridad

- ⚠️ **No subas tu archivo `.env`** a GitHub (ya está en `.gitignore`)
- ⚠️ **No expongas tu API key de Gemini** en el código fuente
- ✅ Usa variables de entorno para información sensible
- ✅ El archivo `.env.example` sirve como plantilla sin datos reales

## 🗄️ Base de Datos

La base de datos SQLite (`backend/database.db`) se crea automáticamente al iniciar el backend. Contiene una tabla `consultas` con los siguientes campos:

- `id` - ID autoincremental
- `nombre` - Nombre del paciente
- `edad` - Edad del paciente
- `sexo` - Sexo del paciente
- `otros_datos` - Datos adicionales
- `lat`, `lng` - Coordenadas geográficas
- `resumen` - Resumen de síntomas
- `diagnostico` - Diagnóstico generado por IA
- `clasificacion` - Clasificación del diagnóstico
- `fecha` - Fecha de la consulta
- `form_data` - Datos completos del formulario (JSON)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👥 Autores

- **diagnosticomedicox1-hue** - [GitHub](https://github.com/diagnosticomedicox1-hue)

## 🐛 Reporte de Bugs

Si encuentras algún bug, por favor abre un [issue](https://github.com/diagnosticomedicox1-hue/diagnosticomedico/issues) en GitHub.

## 📧 Contacto

Para preguntas o sugerencias, abre un issue en el repositorio.

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub
