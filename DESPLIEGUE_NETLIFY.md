# 🚀 Guía de Despliegue en Netlify (Versión Next.js)

Esta guía te ayudará a desplegar la versión de **Next.js** de tu aplicación de diagnóstico médico en Netlify.

## 📋 Requisitos Previos

- Cuenta en [Netlify](https://www.netlify.com/) (gratis)
- Cuenta en [GitHub](https://github.com/)
- API Key de Google Gemini
- Base de datos en Turso (ya configurada en el código)

## 🎯 Configuración Realizada

El proyecto ya incluye un archivo `netlify.toml` en la raíz configurado para detectar automáticamente la carpeta `next/` y desplegarla correctamente.

```toml
[build]
  base = "next"
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## 🚀 Pasos para Desplegar

### 1. Subir cambios a GitHub

Asegúrate de que los últimos cambios estén en tu repositorio:

```bash
git add .
git commit -m "Preparado para despliegue en Netlify"
git push origin main
```

### 2. Crear Nuevo Sitio en Netlify

1. Inicia sesión en [Netlify Dashboard](https://app.netlify.com/).
2. Haz clic en **"Add new site"** -> **"Import an existing project"**.
3. Selecciona **GitHub** y autoriza el acceso.
4. Busca y selecciona tu repositorio: `diagnosticomedicox1-hue/diagnosticomedico`.

### 3. Configurar el Build

Netlify debería detectar el archivo `netlify.toml` automáticamente, pero verifica estos valores:

- **Base directory**: `next`
- **Build command**: `npm run build`
- **Publish directory**: `.next`

### 4. Añadir Variables de Entorno (CRÍTICO)

Antes de hacer clic en "Deploy", debes configurar las variables de entorno para que la aplicación funcione y se conecte a Turso y Gemini:

1. Ve a **"Site configuration"** -> **"Environment variables"**.
2. Añade las siguientes variables:
   - `TURSO_DATABASE_URL`: Tu URL de Turso (ej: `libsql://tu-db.turso.io`)
   - `TURSO_AUTH_TOKEN`: Tu token de autenticación de Turso
   - `DATABASE_URL`: La misma URL de Turso (algunas partes del código podrían usarla)
   - `NEXT_PUBLIC_GEMINI_API_KEY`: Tu API key de Google Gemini

### 5. Desplegar

1. Haz clic en **"Deploy site"**.
2. Netlify comenzará a construir la aplicación. Esto suele tardar entre 2 y 5 minutos.
3. Una vez finalizado, verás el mensaje **"Published"** y te darán una URL (ej: `https://tu-sitio.netlify.app`).

---

## 🔧 Solución de Problemas Comunes

### Error de Build (Next.js Runtime)
Netlify usa el plugin `@netlify/plugin-nextjs` automáticamente. Si ves errores relacionados con funciones serverless, asegúrate de que el plugin esté activo en la pestaña "Plugins" de Netlify.

### Error de Conexión a Base de Datos
Verifica que `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` sean correctos y no tengan espacios extra.

### Error de Gemini (Diagnóstico no carga)
Asegúrate de que `NEXT_PUBLIC_GEMINI_API_KEY` esté bien configurada. Al tener el prefijo `NEXT_PUBLIC_`, estará disponible en el cliente (navegador).

## 🔄 Actualizaciones
Cada vez que hagas un `git push` a la rama `main`, Netlify detectará el cambio y realizará un nuevo despliegue automáticamente.
