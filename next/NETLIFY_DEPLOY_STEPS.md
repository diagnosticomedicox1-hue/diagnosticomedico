# Guía Rápida de Despliegue en Netlify

## ✅ Proyecto Listo para Desplegar

El proyecto ha sido preparado y testeado correctamente para Netlify.

## 📋 Pasos para Desplegar:

### 1. Acceder a Netlify
- Ve a https://app.netlify.com
- Inicia sesión con tu cuenta de GitHub

### 2. Conectar el Repositorio
- Click en **"Add new site"** → **"Import an existing project"**
- Selecciona **GitHub** como proveedor
- Busca y selecciona: `diagnosticomedicox1-hue/diagnosticomedico`
- Click en **"Install"** (si es la primera vez)

### 3. Configurar el Build
En **"Basic build settings"**, asegúrate de que:
- **Base directory**: `next`
- **Build command**: `npm run build`
- **Publish directory**: `.next`

### 4. Variables de Entorno
En **"Environment"**, agrega estas variables (sin comillas):

```
DATABASE_URL=libsql://diagnosticomedico-elusuarioxy123.aws-us-west-2.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk1Mjk1MDMsImlkIjoiMDIxOTI3M2EtZTdhOC00YzM5LWExMGUtYTYxMzY3OWFiOGJiIiwicmlkIjoiNjdmN2YzNWMtMjFkNS00ZjAwLTljMzgtMDFmNmU2MzQzMDU1In0.zs-VnhvLE1djqvHR03BbzxC1t0Bg1ovJ-qhnx_HCRTNqDgwkz4M-d1by-mRJgLOagfD1OsAY-zE58aST8TWFCQ

TURSO_DATABASE_URL=libsql://diagnosticomedico-elusuarioxy123.aws-us-west-2.turso.io

TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk1Mjk1MDMsImlkIjoiMDIxOTI3M2EtZTdhOC00YzM5LWExMGUtYTYxMzY3OWFiOGJiIiwicmlkIjoiNjdmN2YzNWMtMjFkNS00ZjAwLTljMzgtMDFmNmU2MzQzMDU1In0.zs-VnhvLE1djqvHR03BbzxC1t0Bg1ovJ-qhnx_HCRTNqDgwkz4M-d1by-mRJgLOagfD1OsAY-zE58aST8TWFCQ

NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyApu8g_UEZhlvdRJo4I60_8KuXjEt5dGCk
```

⚠️ **Nota de Seguridad**: Para producción, regenera estos tokens en plataformas seguras.

### 5. Hacer Deploy
- Click en **"Deploy site"**
- Netlify comenzará el build automáticamente
- Espera a que se complete (usualmente 1-2 minutos)

### 6. Verificar el Despliegue
- Una vez completo, Netlify te mostrará una URL como:
  - `https://xxxxx.netlify.app`
- Accede a esa URL para verificar que todo funciona

## 🔍 Solución de Problemas

### Error: "Build failed"
1. Revisa los logs de Netlify
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que el directorio base sea `next`

### Error: "Cannot find module"
- Verifica que `npm install` se complete sin errores
- Los logs de build deberían mostrar dónde falla

### API Routes no responden
- Verifica que la configuración `netlify.toml` esté correcta
- Los endpoints están en `app/api/`

## 📊 Servicios Testeados Localmente

✅ Base de Datos Turso - Conexión OK
✅ API Gemini - Autenticación OK
✅ Build Next.js - Compilación OK
✅ Dependencias npm - Todas instaladas

## 📝 Archivos Importantes

- `netlify.toml` - Configuración de Netlify
- `next.config.mjs` - Configuración de Next.js
- `.env.example` - Template de variables (no subir .env a Git)
- `prisma/schema.prisma` - Schema de la BD

---

**¡El proyecto está 100% listo para desplegar!**
