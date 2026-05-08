# CARAMELO - Integracion MVP

CARAMELO quedo integrado como una SPA estatica y funcional, construida sobre los prototipos HTML generados por Stitch. Las carpetas originales se conservan como referencia visual; la plataforma navegable vive en la raiz del proyecto.

## Diagnostico inicial

- No existia `package.json`, framework Next/Vite, router, servidor local ni estructura `src`.
- Stitch genero pantallas aisladas en carpetas separadas con `code.html` y `screen.png`.
- Cada pantalla repetia configuracion Tailwind por CDN, estilos, navegacion y footer.
- La navegacion usaba `href="#"`, por lo que no habia rutas reales.
- Formularios de reporte, adopcion, donacion, voluntariado y veterinaria eran solo visuales.
- No habia datos compartidos, tipos normalizados ni estados consistentes.

## Archivos importantes encontrados

- `inicio_caramelo/code.html`
- `reportar_perro_en_riesgo_caramelo/code.html`
- `casos_activos_caramelo/code.html`
- `perfil_de_perro_caramelo/code.html`
- `mapa_de_la_red_caramelo/code.html`
- `adopciones_caramelo/code.html`
- `donaciones_caramelo/code.html`
- `educaci_n_y_gu_as_caramelo/code.html`
- `panel_de_gesti_n_caramelo/code.html`
- `panel_de_voluntarios_caramelo/code.html`
- `caramelo_design_system/DESIGN.md`
- `estrategia_de_producto_caramelo.md`
- `arquitectura_t_cnica_caramelo.md`

## Estructura final agregada

```text
/
  index.html
  package.json
  package-lock.json
  server.js
  README_CARAMELO.md
  /src
    app.js
    data.js
    styles.css
```

## Paginas conectadas

- `#/` Inicio
- `#/reportar` Reportar perro en riesgo
- `#/casos` Listado de casos
- `#/casos/:id` Detalle de caso
- `#/perros/:id` Ficha individual del perro
- `#/mapa` Mapa de reportes y zonas criticas
- `#/adoptar` Adopciones
- `#/donar` Donaciones
- `#/campanas` Campanas
- `#/educacion` Modulo educativo
- `#/dashboard` Dashboard de metricas
- `#/refugio` Panel para refugios
- `#/veterinario` Panel veterinario
- `#/voluntariado` Panel de voluntarios

## Datos mock centralizados

`src/data.js` contiene:

- usuarios y roles;
- perros;
- casos;
- registros veterinarios;
- refugios;
- voluntarios;
- donaciones;
- campanas;
- misiones;
- guias educativas;
- metricas;
- constantes de estados, urgencias y tipos de caso.

Estados usados:

- Reportado
- En revisión
- Asignado
- En atención
- En recuperación
- En adopción
- Cerrado
- No localizado

Urgencias usadas:

- Bajo
- Medio
- Alto
- Crítico

## Decisiones tecnicas

- No se migro a Next.js porque no existia una base real de Next/Vite que conservar.
- Se creo una SPA sin dependencias para que `npm install` y `npm run dev` funcionen de inmediato.
- Se usaron rutas hash para mantener navegacion funcional tambien en contexto estatico.
- Se preservaron assets remotos y lenguaje visual de Stitch, pero con estilos CSS centralizados.
- Se normalizo el CTA principal: "Reportar perro en riesgo".
- Los formularios ahora tienen comportamiento mock y confirmacion visible.

## Como correr el proyecto

```bash
npm install
npm run dev
```

Abrir:

```text
http://127.0.0.1:5173
```

Validacion tecnica:

```bash
npm run build
npm run check
```

## Verificacion realizada

- `npm install`: correcto.
- `npm run check`: correcto.
- `npm run build`: correcto.
- `npm run dev`: correcto con permiso para servidor local.
- HTTP `200 OK` para `/`, `/src/app.js`, `/src/styles.css` y fallback de ruta.

Nota: `agent-browser` no esta instalado en este entorno, por lo que no pude hacer verificacion automatizada de consola del navegador.

## Siguiente version recomendada

- Migrar a Next.js App Router o Vite React si se quiere arquitectura de componentes real.
- Conectar Supabase para usuarios, reportes, fotos, estados y comentarios de seguimiento.
- Agregar autenticacion por rol.
- Reemplazar imagenes remotas temporales por assets propios o almacenamiento.
- Integrar mapa real con Leaflet u otro proveedor.
- Agregar subida de fotos a storage.
- Agregar pruebas E2E con Playwright.
- Agregar auditoria de accesibilidad automatizada.
