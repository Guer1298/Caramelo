# Arquitectura Técnica y Especificaciones - CARAMELO

## 1. Estructura de Proyecto (Next.js 14+)
```text
/caramelo-platform
├── /src
│   ├── /app (App Router)
│   │   ├── /layout.tsx (Global TopAppBar & Footer)
│   │   ├── /page.tsx (Home)
│   │   ├── /reportar/page.tsx (Formulario)
│   │   ├── /casos/page.tsx (Lista y Filtros)
│   │   ├── /casos/[id]/page.tsx (Ficha del Perro)
│   │   ├── /mapa/page.tsx (Leaflet Map)
│   │   ├── /dashboard/page.tsx (Gestión Roles)
│   ├── /components (UI Elements)
│   │   ├── /ui (Button, Card, Input)
│   │   ├── /map (MapContainer)
│   │   ├── /cards (DogCard, CaseUpdateCard)
│   ├── /lib (Supabase Client, Utilities)
│   ├── /styles (Tailwind Config)
│   ├── /types (Typescript interfaces)
```

## 2. Modelo de Datos Detallado (Supabase/PostgreSQL)

### Tabla: users
- `id`: uuid (PK)
- `email`: string (Unique)
- `role`: enum (ciudadano, refugio, veterinario, admin, voluntario)
- `metadata`: jsonb (nombre, telefono, zona)

### Tabla: dog_profiles
- `id`: uuid (PK)
- `name`: string (temporal)
- `status`: enum (reportado, en_atencion, recuperacion, adopcion, adoptado, cerrado)
- `health_status`: text
- `urgency_level`: enum (critico, alto, medio, bajo)
- `location_lat`: float
- `location_lng`: float
- `photos`: text[] (URLs)
- `created_at`: timestamp

### Tabla: case_updates
- `id`: uuid (PK)
- `dog_id`: uuid (FK)
- `author_id`: uuid (FK)
- `status_change`: string
- `comment`: text
- `media_url`: string
- `created_at`: timestamp

### Tabla: donations
- `id`: uuid (PK)
- `user_id`: uuid (FK, nullable)
- `dog_id`: uuid (FK, nullable)
- `amount`: decimal
- `type`: enum (dinero, alimento, medicina)
- `evidence_url`: string

## 3. Instrucciones de Ejecución
1. Clonar repositorio.
2. Instalar dependencias: `npm install`.
3. Configurar variables de entorno (`.env.local`) con las claves de Supabase.
4. Ejecutar migraciones SQL (proporcionadas en `/supabase/migrations`).
5. Iniciar servidor local: `npm run dev`.
