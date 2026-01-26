# Instrucciones para montar el proyecto en StackBlitz

Hola, he preparado tu proyecto para que sea compatible con StackBlitz. Dado que no tengo acceso directo a tu cuenta de StackBlitz, debes seguir estos pasos para subirlo.

## Opción Recomendada: Usar GitHub (Más robusto)

1.  **Crea un repositorio en GitHub**: Ve a [github.com/new](https://github.com/new) y crea un nuevo repositorio (puede ser público o privado).
2.  **Sube el código desde tu terminal**:
    Abre una terminal en la carpeta de este proyecto y ejecuta los siguientes comandos:
    ```bash
    git init
    git add .
    git commit -m "Preparado para StackBlitz"
    git branch -M main
    git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
    git push -u origin main
    ```
    *(Reemplaza `TU_USUARIO` y `TU_REPOSITORIO` con los datos reales)*.

3.  **Importar en StackBlitz**:
    - Ve a tu Dashboard de StackBlitz: [https://stackblitz.com/](https://stackblitz.com/)
    - Haz clic en **"New Project"** -> **"Import from GitHub"**.
    - Selecciona el repositorio que acabas de crear.

## Configuración Automática

He realizado los siguientes cambios para facilitar el despliegue:
- **`package.json`**: Se ha añadido el comando `npm run dev` que ahora inicia tanto el frontend (Vite) como el backend (Node.js) simultáneamente.
- **`vite.config.ts`**: Se ha configurado un proxy para que las peticiones `/diagnostico` y `/consultas` se dirijan automáticamente al backend en el puerto 3001.
- **`api.ts`**: Se ha actualizado para usar rutas relativas, lo cual es necesario para que funcione el proxy en entornos como StackBlitz.

## Nota Importante sobre la Base de Datos

El proyecto utiliza `sqlite3`. En StackBlitz (WebContainers), esto suele funcionar correctamente, pero ten en cuenta que los datos guardados en la base de datos `database.db` dentro de StackBlitz son **volátiles** (pueden perderse si reinicias el contenedor o cierras la pestaña por mucho tiempo), a menos que uses una base de datos externa. Para pruebas y demostraciones, funcionará perfectamente.
