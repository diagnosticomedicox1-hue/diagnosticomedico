# 🚀 Guía de Despliegue en Vercel

Esta guía te ayudará a desplegar tu aplicación de diagnóstico médico con IA en Vercel.

## 📋 Requisitos Previos

- Cuenta en [Vercel](https://vercel.com) (gratis)
- Cuenta en [GitHub](https://github.com) (gratis)
- Tu código ya debe estar en GitHub (✅ Ya está listo)
- API Key de Google Gemini

## 🎯 Configuración Realizada

Tu proyecto ya está configurado para Vercel con:

- ✅ `vercel.json` - Configuración de rutas y builds
- ✅ `.vercelignore` - Archivos excluidos del deployment
- ✅ `api/index.js` - Serverless function para el backend
- ✅ `backend/index.js` - Backend adaptado para serverless
- ✅ `package.json` - Script `vercel-build` añadido
- ✅ `vite.config.ts` - Configuración de build optimizada

## 🚀 Pasos para Desplegar

### Opción 1: Despliegue desde el Dashboard de Vercel (Recomendado)

#### 1. Conectar con GitHub

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Click en **"Add New..."** → **"Project"**
3. Selecciona **"Import Git Repository"**
4. Autoriza a Vercel para acceder a tu GitHub
5. Busca y selecciona: `diagnosticomedicox1-hue/diagnosticomedico`

#### 2. Configurar el Proyecto

Vercel detectará automáticamente que es un proyecto Vite. Verifica:

- **Framework Preset**: Vite
- **Root Directory**: `./` (raíz del proyecto)
- **Build Command**: `npm run vercel-build` (o déjalo en `npm run build`)
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### 3. Configurar Variables de Entorno

**MUY IMPORTANTE**: Antes de hacer deploy, añade las variables de entorno:

1. En la sección **"Environment Variables"**, añade:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: Tu API key de Google Gemini
   - **Environment**: Selecciona **Production**, **Preview**, y **Development**

2. Click en **"Add"**

#### 4. Desplegar

1. Click en **"Deploy"**
2. Espera 1-3 minutos mientras Vercel construye tu aplicación
3. ¡Listo! Tu aplicación estará en vivo

### Opción 2: Despliegue desde la CLI de Vercel

#### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login en Vercel

```bash
vercel login
```

#### 3. Configurar Variables de Entorno

Crea un archivo `.env.production` (NO lo subas a Git):

```bash
VITE_GEMINI_API_KEY=tu_api_key_real_aqui
```

#### 4. Desplegar

```bash
# Primera vez (configuración interactiva)
vercel

# Siguientes despliegues
vercel --prod
```

Durante la configuración, responde:

- **Set up and deploy?** → Yes
- **Which scope?** → Tu cuenta personal
- **Link to existing project?** → No
- **Project name?** → medical-diagnosis-app (o el que prefieras)
- **Directory?** → `./`
- **Override settings?** → No

## 🔧 Configuración de Variables de Entorno en Vercel

### Desde el Dashboard

1. Ve a tu proyecto en Vercel
2. Click en **"Settings"**
3. Selecciona **"Environment Variables"**
4. Añade:
   - **VITE_GEMINI_API_KEY**: Tu API key de Gemini

### Desde la CLI

```bash
vercel env add VITE_GEMINI_API_KEY
```

Cuando te pregunte:
- **Value**: Pega tu API key
- **Environment**: Selecciona Production, Preview, Development

## 📁 Estructura del Proyecto para Vercel

```
diagnosticomedico/
├── api/
│   └── index.js              # Serverless function (backend)
├── backend/
│   ├── index.js              # Lógica del backend
│   └── package.json          # Dependencias del backend
├── src/                      # Frontend React
├── dist/                     # Build del frontend (generado)
├── vercel.json               # Configuración de Vercel
├── .vercelignore             # Archivos ignorados
└── package.json              # Dependencias principales
```

## 🔄 Cómo Funcionan las Rutas en Vercel

Vercel enrutará las peticiones así:

- `/` → Frontend (React app)
- `/diagnostico` → API serverless (`api/index.js`)
- `/consultas` → API serverless (`api/index.js`)
- Cualquier otra ruta → Frontend (React Router)

## ⚠️ Limitaciones Importantes

### Base de Datos SQLite

**Problema**: Vercel usa funciones serverless que son **stateless** (sin estado). Esto significa:

- ❌ La base de datos SQLite se guarda en `/tmp` que es **efímero**
- ❌ Los datos se **pierden** cuando la función se reinicia (cada 10-15 minutos)
- ❌ No es adecuado para **producción real**

### Soluciones Recomendadas

Para una aplicación en producción, considera usar:

#### 1. **Vercel Postgres** (Recomendado para Vercel)
```bash
vercel postgres create
```
- ✅ Base de datos persistente
- ✅ Integración nativa con Vercel
- ✅ Plan gratuito disponible

#### 2. **Supabase** (Alternativa gratuita)
- ✅ PostgreSQL gratis
- ✅ 500MB de almacenamiento
- ✅ API REST automática
- 🔗 [supabase.com](https://supabase.com)

#### 3. **PlanetScale** (MySQL serverless)
- ✅ MySQL compatible
- ✅ Plan gratuito generoso
- 🔗 [planetscale.com](https://planetscale.com)

#### 4. **MongoDB Atlas**
- ✅ NoSQL
- ✅ Plan gratuito
- 🔗 [mongodb.com/atlas](https://www.mongodb.com/atlas)

### Para Demos y Pruebas

Si solo necesitas una demo temporal, SQLite funcionará, pero:
- ⚠️ Los datos se perderán periódicamente
- ⚠️ No uses para datos importantes
- ✅ Perfecto para mostrar funcionalidad

## 🔍 Verificar el Despliegue

Después del deployment:

1. **Verifica la URL**: Vercel te dará una URL como `https://tu-proyecto.vercel.app`
2. **Prueba el frontend**: Abre la URL en tu navegador
3. **Prueba el backend**: 
   - Abre DevTools (F12)
   - Ve a la pestaña Network
   - Realiza un diagnóstico
   - Verifica que las peticiones a `/diagnostico` y `/consultas` funcionen

## 🐛 Solución de Problemas

### Error: "Build failed"

**Causa**: Falta la variable de entorno o error en el build

**Solución**:
1. Verifica que `VITE_GEMINI_API_KEY` esté configurada
2. Revisa los logs de build en Vercel
3. Asegúrate de que el build funciona localmente: `npm run build`

### Error: "Function invocation failed"

**Causa**: Error en el backend serverless

**Solución**:
1. Revisa los logs de la función en Vercel Dashboard
2. Verifica que las dependencias del backend estén instaladas
3. Comprueba que `backend/package.json` existe

### Error: "API not responding"

**Causa**: Rutas mal configuradas

**Solución**:
1. Verifica que `vercel.json` esté en la raíz
2. Comprueba que `api/index.js` existe
3. Revisa los logs de Vercel

### Los datos desaparecen

**Causa**: SQLite es efímero en Vercel

**Solución**:
- Para demos: Es normal, los datos se pierden cada 10-15 minutos
- Para producción: Migra a una base de datos persistente (ver arriba)

## 🔄 Actualizar el Despliegue

### Automático (Recomendado)

Vercel se actualiza automáticamente cuando haces push a GitHub:

```bash
git add .
git commit -m "Actualización de la aplicación"
git push origin main
```

Vercel detectará el push y desplegará automáticamente.

### Manual desde CLI

```bash
vercel --prod
```

## 📊 Monitoreo y Analytics

Vercel proporciona:

- 📈 **Analytics**: Visitas, performance, etc.
- 🔍 **Logs**: Logs en tiempo real de funciones
- ⚡ **Speed Insights**: Métricas de rendimiento
- 🐛 **Error Tracking**: Errores en producción

Accede desde: Dashboard → Tu Proyecto → Analytics/Logs

## 🌐 Dominio Personalizado

Para usar tu propio dominio:

1. Ve a **Settings** → **Domains**
2. Click en **"Add"**
3. Ingresa tu dominio
4. Sigue las instrucciones para configurar DNS

## 💰 Costos

Vercel ofrece un plan **gratuito** que incluye:

- ✅ 100 GB de ancho de banda
- ✅ Despliegues ilimitados
- ✅ HTTPS automático
- ✅ Funciones serverless
- ✅ Analytics básicos

**Suficiente para proyectos personales y demos.**

## 🔗 Enlaces Útiles

- **Dashboard de Vercel**: https://vercel.com/dashboard
- **Documentación**: https://vercel.com/docs
- **Vercel CLI**: https://vercel.com/docs/cli
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
- **Tu Repositorio**: https://github.com/diagnosticomedicox1-hue/diagnosticomedico

## ✅ Checklist de Deployment

Antes de desplegar, verifica:

- [ ] Código pusheado a GitHub
- [ ] `vercel.json` en la raíz del proyecto
- [ ] `api/index.js` creado
- [ ] Variable `VITE_GEMINI_API_KEY` configurada en Vercel
- [ ] Build local funciona: `npm run build`
- [ ] Backend local funciona: `npm run dev`

## 🎉 ¡Listo!

Tu aplicación está configurada para Vercel. Solo necesitas:

1. Ir a [vercel.com](https://vercel.com)
2. Importar tu repositorio de GitHub
3. Configurar `VITE_GEMINI_API_KEY`
4. Click en Deploy

**¡Tu aplicación estará en vivo en minutos!** 🚀

---

**Nota**: Recuerda que para producción real, deberás migrar de SQLite a una base de datos persistente como Vercel Postgres o Supabase.
