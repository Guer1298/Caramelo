# CARAMELO

CARAMELO es una plataforma social y comunitaria para Popayan, Colombia. Conecta ciudadanos, refugios, veterinarios, voluntarios, donantes, adoptantes y autoridades locales para reportar, atender y prevenir casos de perros en situacion de calle, abandono, enfermedad o riesgo.

> CARAMELO no es solo tecnologia. Es una ciudad aprendiendo a cuidar antes de que sea demasiado tarde.

## Estado del proyecto

Este repositorio quedo preparado como una aplicacion estatica lista para Vercel. No necesita backend para correr el MVP actual; los datos son simulados y viven en `src/data.js`.

## Rutas principales

- `/` Inicio
- `/reportar` Reportar perro en riesgo
- `/casos` Listado de casos
- `/casos/case-canelo` Detalle de caso
- `/perros/dog-canelo` Ficha del perro
- `/mapa` Mapa de reportes
- `/adoptar` Adopciones
- `/donar` Donaciones
- `/campanas` Campanas
- `/educacion` Educacion
- `/dashboard` Metricas
- `/refugio` Panel refugio
- `/veterinario` Panel veterinario
- `/voluntariado` Panel voluntarios

La app tambien mantiene navegacion con hash internamente para compatibilidad estatica.

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir:

```text
http://127.0.0.1:5173
```

## Build de produccion

```bash
npm run build
```

Esto genera:

```text
dist/
  index.html
  src/
    app.js
    data.js
    styles.css
```

Vista previa local del build:

```bash
npm run preview
```

## Despliegue en Vercel

El proyecto ya incluye `vercel.json` con:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- rewrites para rutas limpias de SPA
- headers basicos de seguridad y cache

### Opcion 1: Desde GitHub

1. Subir este repositorio a GitHub.
2. En Vercel, seleccionar **Add New Project**.
3. Importar el repositorio.
4. Framework Preset: **Other**.
5. Vercel tomara la configuracion desde `vercel.json`.
6. Deploy.

### Opcion 2: Desde Vercel CLI

```bash
npm install
npm run build
npx vercel
```

Para produccion:

```bash
npx vercel --prod
```

No hay variables de entorno requeridas para este MVP.

## Archivos de despliegue

- `vercel.json`: configuracion de Vercel.
- `.vercelignore`: excluye prototipos originales de Stitch del deploy.
- `.gitignore`: excluye `node_modules`, `dist`, `.vercel` y archivos locales.
- `scripts/build.mjs`: genera la carpeta `dist`.
- `server.js`: servidor local para desarrollo y vista previa.

## Siguiente etapa

- Migrar a Next.js o Vite React si se requiere arquitectura por componentes.
- Conectar Supabase/PostgreSQL para reportes, usuarios, fotos y seguimiento.
- Agregar autenticacion por rol.
- Integrar mapa real con Leaflet.
- Subir fotos a storage.
- Agregar pruebas E2E antes de produccion.
