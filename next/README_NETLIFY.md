# Configuración para Despliegue en Netlify

## Variables de Entorno Requeridas

Configura las siguientes variables de entorno en Netlify (Site settings → Environment variables):

1. `DATABASE_URL` - URL completa de Turso con authToken
2. `TURSO_DATABASE_URL` - URL de Turso sin authToken
3. `TURSO_AUTH_TOKEN` - Token de autenticación de Turso
4. `NEXT_PUBLIC_GEMINI_API_KEY` - API Key de Google Gemini

## Configuración de Build

- **Base directory**: `next`
- **Build command**: `npm install && npm run build`
- **Publish directory**: `.next`

## Notas Importantes

- El proyecto usa Next.js 16 con App Router
- Se requiere Node.js 20 (configurado en `.nvmrc`)
- El plugin `@netlify/plugin-nextjs` maneja automáticamente las funciones serverless
- Las rutas API están en `app/api/`
