# Estrategia de Producto: CARAMELO

## 1. Resumen Ejecutivo
CARAMELO es una infraestructura social y tecnológica diseñada para Popayán, Colombia. Transforma el caos de la información fragmentada (WhatsApp, redes sociales) en una red operativa de cuidado animal. No es solo una base de datos; es un sistema de coordinación de crisis y prevención.

## 2. Usuarios Principales
- **Ciudadanos:** Sensores activos de la ciudad.
- **Refugios/Fundaciones:** Operadores logísticos y de cuidado.
- **Veterinarios:** Soporte técnico y médico.
- **Voluntarios/Donantes:** El motor de recursos (tiempo, dinero, transporte).
- **Universidades/Autoridades:** Analistas de datos para políticas públicas.

## 3. Propuesta de Valor
"Convertir la empatía individual en una respuesta comunitaria organizada y medible."

## 4. Arquitectura de Información (Sitemap MVP)
- **Home:** Explicación, CTA principal (Reportar), métricas de impacto.
- **Reportar:** Flujo simplificado (Foto -> Ubicación -> Estado -> Urgencia).
- **Mapa de Casos:** Visualización geográfica de la red de cuidado.
- **Lista de Casos:** Feed de actividad con estados de seguimiento.
- **Ficha del Perro:** Perfil individual con historial médico y de vida.
- **Dashboard (Roles):** Gestión específica para refugios y veterinarios.

## 5. Modelo de Datos (Core)
- **User:** Perfiles con roles (Ciudadano, Refugio, Vet, Admin).
- **Report:** Vinculado a ubicación y nivel de urgencia (Crítico, Alto, Medio, Bajo).
- **DogProfile:** El "DNI" del animal, centralizando su paso por la red.
- **CaseUpdate:** Log cronológico de acciones sobre un reporte.

## 6. Recomendación Tecnológica (Opción A)
- **Frontend:** Next.js + Tailwind CSS (Rápido, SEO-friendly, responsive).
- **Backend/DB:** Supabase (PostgreSQL + Auth + Real-time).
- **Mapas:** Leaflet.js (Open Source, ligero).
- **Hosting:** Vercel.
- **Justificación:** Esta pila permite escalar de Popayán a nivel nacional con mínima fricción técnica y alta velocidad de iteración.
