# Guía de Despliegue en Netlify

## Configuración en Netlify

### 1. Configuración del Sitio

En **Site settings → Build & deploy → Build settings**:

- **Base directory**: `next`
- **Build command**: `npm install && npm run build`
- **Publish directory**: `.next`

### 2. Variables de Entorno

En **Site settings → Environment variables**, agrega:

```
DATABASE_URL=libsql://tu-db.turso.io?authToken=tu-token
TURSO_DATABASE_URL=libsql://tu-db.turso.io
TURSO_AUTH_TOKEN=tu-token-aqui
NEXT_PUBLIC_GEMINI_API_KEY=tu-api-key-de-gemini
```

### 3. Node.js Version

Netlify detectará automáticamente la versión desde `.nvmrc` (Node 20).

### 4. Plugin de Next.js

El plugin `@netlify/plugin-nextjs` está configurado en `netlify.toml` y se instalará automáticamente.

## Comandos de Build Local (para probar)

```bash
cd next
npm install
npm run build
```

## Solución de Problemas

### Error: "Cannot find module"
- Verifica que todas las dependencias estén en `package.json`
- Ejecuta `npm install` localmente para verificar

### Error: "Build failed"
- Revisa los logs de Netlify para el error específico
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que el directorio base sea `next`

### Error: "Prisma Client not generated"
- El script `postinstall` ejecuta `prisma generate` automáticamente
- Si falla, verifica que `DATABASE_URL` esté configurada correctamente

## Estructura del Proyecto

```
project/
├── next/                    # Directorio base para Netlify
│   ├── app/                 # Next.js App Router
│   ├── components/          # Componentes compartidos
│   ├── lib/                 # Utilidades
│   ├── prisma/              # Schema de Prisma
│   ├── package.json         # Dependencias
│   └── next.config.mjs      # Configuración de Next.js
├── src/                     # Código fuente compartido
└── netlify.toml             # Configuración de Netlify
