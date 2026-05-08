import {
  CASE_STATUSES,
  CASE_TYPES,
  URGENCY_LEVELS,
  campaigns,
  cases,
  dogs,
  donations,
  educationGuides,
  images,
  metrics,
  shelters,
  users,
  veterinaryRecords,
  volunteerMissions,
  volunteers
} from "./data.js";

const app = document.querySelector("#app");

const state = {
  localCases: [],
  localDogs: [],
  lastReport: null,
  pendingPhoto: null,
  caseStatusFilter: "Todos",
  caseUrgencyFilter: "Todos",
  toast: null
};

const desktopRoutes = [
  { path: "#/", label: "Inicio" },
  { path: "#/casos", label: "Casos" },
  { path: "#/reportar", label: "Reportar" },
  { path: "#/mapa", label: "Mapa" },
  { path: "#/adoptar", label: "Adoptar" },
  { path: "#/donar", label: "Donar" },
  { path: "#/campanas", label: "Campanas" },
  { path: "#/dashboard", label: "Dashboard" }
];

const mobileRoutes = [
  { path: "#/", label: "Inicio", icon: "home" },
  { path: "#/casos", label: "Casos", icon: "list_alt" },
  { path: "#/reportar", label: "Reportar", icon: "add_circle", primary: true },
  { path: "#/mapa", label: "Mapa", icon: "map" },
  { path: "#/adoptar", label: "Adoptar", icon: "pets" }
];

function allCases() {
  return [...state.localCases, ...cases];
}

function allDogs() {
  return [...state.localDogs, ...dogs];
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function icon(name, label = "") {
  const aria = label ? ` aria-label="${escapeHtml(label)}"` : ' aria-hidden="true"';
  return `<span class="material-symbols-outlined"${aria}>${escapeHtml(name)}</span>`;
}

function slug(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getHashPath() {
  const hash = window.location.hash || "#/";
  if (hash && hash !== "#/" && hash !== "#") {
    return hash;
  }

  const pathname = window.location.pathname.replace(/\/+$/, "");
  if (pathname && pathname !== "") {
    return `#${pathname}`;
  }

  return "#/";
}

function isActive(path, routePath) {
  if (routePath === "#/") {
    return path === "#/";
  }
  return path === routePath || path.startsWith(`${routePath}/`);
}

function setTitle(title) {
  document.title = title ? `${title} | CARAMELO` : "CARAMELO | Red de cuidado animal en Popayan";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function money(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value);
}

function getDog(dogId) {
  return allDogs().find((dog) => dog.id === dogId);
}

function getCase(caseId) {
  return allCases().find((item) => item.id === caseId);
}

function getUser(userId) {
  return users.find((user) => user.id === userId);
}

function showToast(title, text) {
  state.toast = { title, text };
  render();
  window.setTimeout(() => {
    state.toast = null;
    render();
  }, 4200);
}

function renderHeader(path) {
  const links = desktopRoutes
    .map(
      (route) => `
        <a class="nav-link" href="${route.path}" ${isActive(path, route.path) ? 'aria-current="page"' : ""}>
          ${escapeHtml(route.label)}
        </a>
      `
    )
    .join("");

  return `
    <header class="site-header">
      <div class="topbar">
        <a class="brand" href="#/" aria-label="Ir al inicio de CARAMELO">
          <span class="brand-mark">C</span>
          <span>CARAMELO</span>
        </a>
        <nav class="desktop-nav" aria-label="Navegacion principal">
          ${links}
        </nav>
        <div class="header-actions">
          <a class="btn btn-primary" href="#/reportar">${icon("add_circle")}Reportar perro en riesgo</a>
        </div>
      </div>
    </header>
  `;
}

function renderFooter() {
  return `
    <footer class="footer">
      <div class="footer-inner">
        <div>
          <strong class="brand" aria-label="CARAMELO"><span class="brand-mark">C</span><span>CARAMELO</span></strong>
          <p class="muted">Red de cuidado animal para Popayan. Tecnologia, comunidad y accion temprana.</p>
        </div>
        <nav class="footer-links" aria-label="Enlaces secundarios">
          <a href="#/educacion">Ayuda</a>
          <a href="#/donar">Donar</a>
          <a href="#/voluntariado">Voluntariado</a>
          <a href="#/dashboard">Indicadores</a>
        </nav>
      </div>
    </footer>
  `;
}

function renderMobileNav(path) {
  const links = mobileRoutes
    .map(
      (route) => `
        <a class="${route.primary ? "report-link" : ""}" href="${route.path}" ${
          isActive(path, route.path) ? 'aria-current="page"' : ""
        }>
          ${icon(route.icon)}
          <span>${escapeHtml(route.label)}</span>
        </a>
      `
    )
    .join("");

  return `<nav class="mobile-nav" aria-label="Navegacion movil">${links}</nav>`;
}

function renderToast() {
  if (!state.toast) {
    return "";
  }

  return `
    <div class="toast is-visible" role="status" aria-live="polite">
      ${icon("check_circle")}
      <div>
        <strong>${escapeHtml(state.toast.title)}</strong>
        <p class="muted">${escapeHtml(state.toast.text)}</p>
      </div>
    </div>
  `;
}

function renderPageTitle(eyebrow, title, lead, action = "") {
  return `
    <section class="page-title section">
      <span class="eyebrow">${escapeHtml(eyebrow)}</span>
      <h1>${escapeHtml(title)}</h1>
      <p class="lead">${escapeHtml(lead)}</p>
      ${action}
    </section>
  `;
}

function renderStatusBadge(status, floating = false) {
  return `<span class="badge ${floating ? "badge-floating" : ""} status-${slug(status)}">${escapeHtml(status)}</span>`;
}

function renderUrgencyBadge(urgency) {
  return `<span class="badge urgency-${slug(urgency)}">${escapeHtml(urgency)}</span>`;
}

function renderCaseCard(caseItem) {
  const dog = getDog(caseItem.dogId);
  const dogName = dog?.name || "Sin nombre";
  const needs = caseItem.needs
    .slice(0, 3)
    .map((need) => `<li>${escapeHtml(need)}</li>`)
    .join("");

  return `
    <article class="card case-card">
      <div class="image-frame">
        <img src="${escapeHtml(caseItem.photo)}" alt="Foto del caso de ${escapeHtml(dogName)}" loading="lazy" />
        ${renderStatusBadge(caseItem.status, true)}
      </div>
      <div class="card-body">
        <div class="compact-stack">
          <div class="button-row" style="justify-content: space-between;">
            <h3 style="margin:0;">${escapeHtml(dogName)}</h3>
            ${renderUrgencyBadge(caseItem.urgencyLevel)}
          </div>
          <p class="muted">${icon("location_on")}${escapeHtml(caseItem.location)}</p>
        </div>
        <p>${escapeHtml(caseItem.description)}</p>
        <div>
          <div class="button-row" style="justify-content: space-between;">
            <strong>${escapeHtml(caseItem.caseType)}</strong>
            <span class="muted">${escapeHtml(formatDate(caseItem.createdAt))}</span>
          </div>
          <div class="progress" aria-label="Progreso del caso ${caseItem.progress}%">
            <span style="width: ${Number(caseItem.progress)}%;"></span>
          </div>
        </div>
        <ul class="meta-list">${needs}</ul>
        <div class="button-row">
          <a class="btn btn-primary" href="#/casos/${escapeHtml(caseItem.id)}">Ver detalle</a>
          <a class="btn btn-secondary" href="#/donar">Ayudar</a>
        </div>
      </div>
    </article>
  `;
}

function renderDogCard(dog) {
  return `
    <article class="card dog-card">
      <div class="image-frame">
        <img src="${escapeHtml(dog.photo)}" alt="Foto de ${escapeHtml(dog.name)}" loading="lazy" />
        <span class="badge badge-floating status-en-adopcion">${escapeHtml(dog.adoptionStatus)}</span>
      </div>
      <div class="card-body">
        <div class="button-row" style="justify-content: space-between;">
          <h3 style="margin:0;">${escapeHtml(dog.name)}</h3>
          <span class="badge">${escapeHtml(dog.size)}</span>
        </div>
        <p class="muted">${escapeHtml(dog.sex)} · ${escapeHtml(dog.estimatedAge)} · ${escapeHtml(dog.color)}</p>
        <p>${escapeHtml(dog.history)}</p>
        <ul class="meta-list">
          <li>${escapeHtml(dog.healthStatus)}</li>
          <li>${escapeHtml(dog.foundLocation)}</li>
        </ul>
        <div class="button-row">
          <a class="btn btn-primary" href="#/perros/${escapeHtml(dog.id)}">Ver ficha</a>
          <a class="btn btn-secondary" href="#/adoptar">Quiero adoptar</a>
        </div>
      </div>
    </article>
  `;
}

function renderHome() {
  setTitle("Inicio");
  const urgentCases = allCases()
    .filter((item) => ["Crítico", "Alto"].includes(item.urgencyLevel))
    .slice(0, 3)
    .map(renderCaseCard)
    .join("");

  return `
    <div class="page-stack">
      <section class="hero">
        <div class="hero-copy">
          <span class="eyebrow">${icon("location_on")} Popayan compasiva</span>
          <h1>Una ciudad aprendiendo a cuidar antes de que sea demasiado tarde.</h1>
          <p class="lead">CARAMELO conecta ciudadanos, refugios, veterinarios, voluntarios, donantes y autoridades locales para reportar, atender y prevenir casos de perros en riesgo.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/reportar">${icon("add_circle")}Reportar perro en riesgo</a>
            <a class="btn btn-secondary" href="#/casos">${icon("list_alt")}Ver casos activos</a>
          </div>
        </div>
        <div class="hero-media">
          <img src="${images.heroDog}" alt="Perro rescatado en una calle soleada de Popayan" />
        </div>
      </section>

      <section class="grid grid-4" aria-label="Metricas de impacto">
        <article class="flat-card metric-card">
          ${icon("pets")}
          <span class="metric-value">${metrics.impactedDogs.toLocaleString("es-CO")}+</span>
          <strong>Perros atendidos y reubicados</strong>
        </article>
        <article class="flat-card metric-card">
          ${icon("volunteer_activism")}
          <span class="metric-value">${metrics.activeVolunteers}+</span>
          <strong>Voluntarios activos</strong>
        </article>
        <article class="flat-card metric-card">
          ${icon("favorite")}
          <span class="metric-value">${metrics.reunionsRate}%</span>
          <strong>Casos con final positivo</strong>
        </article>
        <article class="flat-card metric-card">
          ${icon("emergency_home")}
          <span class="metric-value">${metrics.criticalCases}</span>
          <strong>Urgencias que necesitan apoyo hoy</strong>
        </article>
      </section>

      <section class="section">
        <div class="section-header">
          <div>
            <h2>Casos urgentes cerca de ti</h2>
            <p>Tu ayuda puede ser transporte, alimento, difusion, donacion u hogar temporal.</p>
          </div>
          <a class="btn btn-ghost" href="#/casos">Ver todos ${icon("arrow_forward")}</a>
        </div>
        <div class="grid grid-3">${urgentCases}</div>
      </section>

      <section class="grid grid-wide">
        <div class="flat-card">
          <span class="eyebrow">${icon("route")} Flujo principal</span>
          <h2>Reportar debe tomar menos de un minuto</h2>
          <div class="grid grid-3">
            ${["Foto y ubicacion", "Urgencia y tipo de caso", "Seguimiento visible"]
              .map(
                (item, index) => `
                  <div class="flat-card" style="box-shadow:none;">
                    <span class="badge">Paso ${index + 1}</span>
                    <h3>${escapeHtml(item)}</h3>
                    <p class="muted">${escapeHtml(
                      [
                        "El ciudadano comparte evidencia y punto de referencia.",
                        "La red prioriza sin lenguaje tecnico ni formularios frios.",
                        "El caso queda navegable para que la comunidad ayude."
                      ][index]
                    )}</p>
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
        <div class="flat-card">
          <h2>Roles conectados</h2>
          <ul class="inline-list">
            ${["Ciudadano", "Refugio", "Veterinario", "Voluntario", "Donante", "Adoptante", "Universidad", "Autoridad local"]
              .map((role) => `<li><span class="dot"></span>${escapeHtml(role)}</li>`)
              .join("")}
          </ul>
          <div class="button-row">
            <a class="btn btn-secondary" href="#/refugio">Panel refugio</a>
            <a class="btn btn-secondary" href="#/veterinario">Panel veterinario</a>
            <a class="btn btn-secondary" href="#/voluntariado">Panel voluntarios</a>
          </div>
        </div>
      </section>

      <section class="flat-card" style="background: var(--primary); color: white;">
        <div class="grid grid-2" style="align-items:center;">
          <div>
            <h2 style="margin-top:0;">No es solo tecnologia. Es una red de cuidado.</h2>
            <p>Gracias por reportar, donar, compartir o abrir un hogar temporal. Cada accion deja una ciudad un poco mas atenta.</p>
            <div class="button-row">
              <a class="btn" href="#/donar">Quiero donar</a>
              <a class="btn" href="#/voluntariado">Ser voluntario</a>
            </div>
          </div>
          <div class="image-frame" style="border-radius:18px; aspect-ratio: 4 / 3;">
            <img src="${images.community}" alt="Voluntarios de CARAMELO ayudando perros en Popayan" />
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderReportConfirmation() {
  const report = state.lastReport;
  return `
    <section class="form-card" role="status" aria-live="polite">
      <div class="compact-stack" style="text-align:center; justify-items:center;">
        <span class="badge status-en-revision">${icon("check_circle")}Reporte recibido</span>
        <h1>Gracias por reportar este caso.</h1>
        <p class="lead">Tu ayuda puede activar una red de cuidado. Estamos buscando apoyo cercano para revisar la ubicacion y priorizar la atencion.</p>
        <div class="flat-card" style="text-align:left; width:min(100%, 560px); box-shadow:none;">
          <strong>Codigo de seguimiento: ${escapeHtml(report.id)}</strong>
          <p class="muted">${escapeHtml(report.location)} · ${escapeHtml(report.caseType)} · ${escapeHtml(report.urgencyLevel)}</p>
          <p>${escapeHtml(report.description)}</p>
        </div>
        <div class="button-row" style="justify-content:center;">
          <a class="btn btn-primary" href="#/casos/${escapeHtml(report.id)}">Ver seguimiento</a>
          <button class="btn btn-secondary" type="button" data-action="new-report">Crear otro reporte</button>
        </div>
      </div>
    </section>
  `;
}

function renderReport() {
  setTitle("Reportar perro en riesgo");
  if (state.lastReport) {
    return renderReportConfirmation();
  }

  return `
    <div class="page-stack">
      ${renderPageTitle(
        "Reporte ciudadano",
        "Reportar perro enfermo, herido o en riesgo",
        "Comparte foto, ubicacion y urgencia. El reporte queda visible para refugios, veterinarios y voluntarios cercanos."
      )}
      <form id="report-form" class="form-card" novalidate>
        <div class="form-grid">
          <div class="upload-box" id="photo-preview">
            <div class="compact-stack">
              ${icon("add_a_photo")}
              <strong>Sube una foto del animal</strong>
              <span class="muted">JPG o PNG. Si no tienes foto, igual puedes reportar.</span>
              <input id="report-photo" name="photo" type="file" accept="image/*" />
            </div>
          </div>

          <div class="grid grid-2">
            <div class="field">
              <label for="case-type">Tipo de caso</label>
              <select id="case-type" name="caseType" required>
                ${CASE_TYPES.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("")}
              </select>
            </div>
            <fieldset class="field">
              <legend>Nivel de urgencia</legend>
              <div class="segmented">
                ${URGENCY_LEVELS.map(
                  (level, index) => `
                    <label>
                      <input type="radio" name="urgencyLevel" value="${escapeHtml(level)}" ${index === 2 ? "checked" : ""} />
                      <span>${escapeHtml(level)}</span>
                    </label>
                  `
                ).join("")}
              </div>
            </fieldset>
          </div>

          <div class="grid grid-2">
            <div class="field">
              <label for="location">Ubicacion o punto de referencia</label>
              <input id="location" name="location" placeholder="Ej: Barrio Caldas, cerca al parque" required />
              <small>Mientras mas precisa sea, mas rapido se activa la ayuda cercana.</small>
            </div>
            <div class="field">
              <label for="reporter-phone">Telefono de contacto</label>
              <input id="reporter-phone" name="phone" inputmode="tel" placeholder="+57..." />
              <small>Opcional. Solo para confirmar detalles del caso.</small>
            </div>
          </div>

          <div class="map-card" style="min-height: 260px;">
            <img src="${images.reportMap}" alt="Mapa aproximado de Popayan para ubicar reportes" />
            <div class="map-overlay"></div>
            <span class="map-marker" style="left: 52%; top: 48%;" data-urgency="Alto">${icon("location_on")}</span>
          </div>

          <div class="field">
            <label for="description">Descripcion breve</label>
            <textarea id="description" name="description" placeholder="Describe color, estado visible, si se mueve, si esta solo o con camada..." required></textarea>
          </div>

          <button class="btn btn-primary" type="submit">${icon("send")}Enviar reporte</button>
          <p class="muted">Al enviar, notificaremos a rescatistas, refugios y voluntarios cercanos. Reporte recibido. Estamos buscando apoyo cercano.</p>
        </div>
      </form>
    </div>
  `;
}

function renderCases() {
  setTitle("Casos activos");
  const filtered = allCases().filter((item) => {
    const byStatus = state.caseStatusFilter === "Todos" || item.status === state.caseStatusFilter;
    const byUrgency = state.caseUrgencyFilter === "Todos" || item.urgencyLevel === state.caseUrgencyFilter;
    return byStatus && byUrgency;
  });

  return `
    <div class="page-stack">
      ${renderPageTitle(
        "Seguimiento comunitario",
        "Casos activos",
        "Consulta estados visibles, urgencia, necesidades y responsables. Cada caso tiene una ficha conectada al perro."
      )}
      <section class="flat-card">
        <div class="grid grid-2">
          <div class="field">
            <label for="status-filter">Filtrar por estado</label>
            <select id="status-filter" data-filter="status">
              <option>Todos</option>
              ${CASE_STATUSES.map((status) => `<option ${state.caseStatusFilter === status ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="urgency-filter">Filtrar por urgencia</label>
            <select id="urgency-filter" data-filter="urgency">
              <option>Todos</option>
              ${URGENCY_LEVELS.map((level) => `<option ${state.caseUrgencyFilter === level ? "selected" : ""}>${escapeHtml(level)}</option>`).join("")}
            </select>
          </div>
        </div>
      </section>
      <section class="grid grid-3">
        ${filtered.length ? filtered.map(renderCaseCard).join("") : '<div class="empty-state">No hay casos con estos filtros.</div>'}
      </section>
    </div>
  `;
}

function renderCaseDetail(caseId) {
  const caseItem = getCase(caseId);
  if (!caseItem) {
    setTitle("Caso no encontrado");
    return `<div class="empty-state"><h1>Caso no encontrado</h1><p>Revisa la lista de casos activos.</p><a class="btn btn-primary" href="#/casos">Volver a casos</a></div>`;
  }

  const dog = getDog(caseItem.dogId);
  setTitle(`Caso de ${dog?.name || "perro en riesgo"}`);
  const reporter = getUser(caseItem.reporterId);
  const timeline = caseItem.updates
    .map(
      (update) => `
        <li>
          <strong>${escapeHtml(update.title)}</strong>
          <p class="muted">${escapeHtml(update.date)}</p>
          <p>${escapeHtml(update.text)}</p>
        </li>
      `
    )
    .join("");

  return `
    <div class="page-stack">
      <a class="btn btn-ghost" href="#/casos">${icon("arrow_back")}Volver a casos</a>
      <section class="split">
        <article class="card">
          <div class="image-frame" style="aspect-ratio: 16 / 10;">
            <img src="${escapeHtml(caseItem.photo)}" alt="Foto principal del caso" />
            ${renderStatusBadge(caseItem.status, true)}
          </div>
          <div class="card-body">
            <div class="button-row">
              ${renderUrgencyBadge(caseItem.urgencyLevel)}
              <span class="badge">${escapeHtml(caseItem.caseType)}</span>
            </div>
            <h1 style="margin:0;">${escapeHtml(dog?.name || "Perro sin nombre")}</h1>
            <p class="lead">${escapeHtml(caseItem.description)}</p>
            <div class="progress" aria-label="Progreso del caso ${caseItem.progress}%">
              <span style="width:${Number(caseItem.progress)}%;"></span>
            </div>
            <ul class="meta-list">
              <li>${icon("location_on")}${escapeHtml(caseItem.location)}</li>
              <li>${icon("calendar_month")}${escapeHtml(formatDate(caseItem.createdAt))}</li>
              <li>${icon("person")}${escapeHtml(reporter?.name || "Reporte ciudadano")}</li>
              <li>${icon("assignment_ind")}${escapeHtml(caseItem.assignedTo)}</li>
            </ul>
            <div class="button-row">
              <a class="btn btn-primary" href="#/perros/${escapeHtml(caseItem.dogId)}">Ver ficha del perro</a>
              <a class="btn btn-secondary" href="#/donar">Ayudar este caso</a>
            </div>
          </div>
        </article>
        <aside class="compact-stack">
          <div class="flat-card">
            <h2>Necesidades actuales</h2>
            <ul class="meta-list">
              ${caseItem.needs.map((need) => `<li>${escapeHtml(need)}</li>`).join("")}
            </ul>
            <p class="muted">Puedes ayudar donando, compartiendo, transportando o siendo hogar temporal.</p>
          </div>
          <div class="flat-card">
            <h2>Linea de tiempo</h2>
            <ol class="timeline">${timeline}</ol>
          </div>
        </aside>
      </section>
    </div>
  `;
}

function renderDogProfile(dogId) {
  const dog = getDog(dogId);
  if (!dog) {
    setTitle("Perro no encontrado");
    return `<div class="empty-state"><h1>Ficha no encontrada</h1><a class="btn btn-primary" href="#/casos">Volver a casos</a></div>`;
  }

  setTitle(`Ficha de ${dog.name}`);
  const records = veterinaryRecords.filter((record) => record.dogId === dog.id);
  const relatedCases = allCases().filter((item) => item.dogId === dog.id);

  return `
    <div class="page-stack">
      <a class="btn btn-ghost" href="#/casos">${icon("arrow_back")}Volver a casos</a>
      <section class="split">
        <article class="card">
          <div class="image-frame" style="aspect-ratio: 16 / 10;">
            <img src="${escapeHtml(dog.photo)}" alt="Foto de ${escapeHtml(dog.name)}" />
          </div>
          <div class="card-body">
            <span class="eyebrow">${icon("pets")} Ficha individual</span>
            <h1 style="margin:0;">${escapeHtml(dog.name)}</h1>
            <p class="lead">${escapeHtml(dog.history)}</p>
            <ul class="meta-list">
              <li>${escapeHtml(dog.sex)}</li>
              <li>${escapeHtml(dog.size)}</li>
              <li>${escapeHtml(dog.color)}</li>
              <li>${escapeHtml(dog.estimatedAge)}</li>
              <li>${escapeHtml(dog.adoptionStatus)}</li>
            </ul>
          </div>
        </article>
        <aside class="compact-stack">
          <div class="flat-card">
            <h2>Salud y cuidado</h2>
            <p>${escapeHtml(dog.healthStatus)}</p>
            <p class="muted">${icon("location_on")}${escapeHtml(dog.foundLocation)}</p>
          </div>
          <div class="flat-card">
            <h2>Casos vinculados</h2>
            <div class="compact-stack">
              ${
                relatedCases.length
                  ? relatedCases
                      .map(
                        (item) => `
                          <a class="btn btn-secondary" href="#/casos/${escapeHtml(item.id)}">
                            ${escapeHtml(item.caseType)} · ${escapeHtml(item.status)}
                          </a>
                        `
                      )
                      .join("")
                  : '<p class="muted">Sin casos activos vinculados.</p>'
              }
            </div>
          </div>
          <div class="flat-card">
            <h2>Registro veterinario</h2>
            ${
              records.length
                ? records
                    .map(
                      (record) => `
                        <div class="compact-stack">
                          <strong>${escapeHtml(record.diagnosis)}</strong>
                          <p>${escapeHtml(record.treatment)}</p>
                          <p class="muted">Proxima revision: ${escapeHtml(record.nextCheckup)}</p>
                        </div>
                      `
                    )
                    .join("")
                : '<p class="muted">Aun no hay registro veterinario cargado.</p>'
            }
          </div>
        </aside>
      </section>
      <section class="grid grid-3">
        ${dog.gallery.map((photo) => `<div class="image-frame card" style="aspect-ratio: 1 / 1;"><img src="${escapeHtml(photo)}" alt="Galeria de ${escapeHtml(dog.name)}" loading="lazy" /></div>`).join("")}
      </section>
    </div>
  `;
}

function renderMap() {
  setTitle("Mapa de la red");
  const positions = [
    ["48%", "47%"],
    ["58%", "35%"],
    ["38%", "62%"],
    ["68%", "55%"],
    ["44%", "30%"],
    ["54%", "68%"],
    ["34%", "42%"],
    ["63%", "48%"]
  ];
  const markers = allCases()
    .map(
      (item, index) => `
        <a class="map-marker" href="#/casos/${escapeHtml(item.id)}" style="left:${positions[index % positions.length][0]}; top:${positions[index % positions.length][1]};" data-urgency="${escapeHtml(item.urgencyLevel)}" aria-label="Ver caso ${escapeHtml(item.id)}">
          ${icon("location_on")}
        </a>
      `
    )
    .join("");

  return `
    <div class="page-stack">
      ${renderPageTitle(
        "Zonas criticas",
        "Mapa de reportes y red de apoyo",
        "Visualiza concentracion de casos, puntos de apoyo, refugios y rutas de voluntariado en Popayan."
      )}
      <section class="grid grid-wide">
        <div class="map-card">
          <img src="${images.map}" alt="Mapa visual de Popayan con zonas criticas" />
          <div class="map-overlay"></div>
          ${markers}
        </div>
        <aside class="compact-stack">
          <div class="flat-card">
            <h2>Capas visibles</h2>
            <ul class="inline-list">
              <li><span class="dot" style="background: var(--danger);"></span>Casos criticos</li>
              <li><span class="dot"></span>Reportes activos</li>
              <li><span class="dot" style="background: var(--tertiary);"></span>Apoyo cercano</li>
            </ul>
          </div>
          <div class="flat-card">
            <h2>Zonas con mas actividad</h2>
            <div class="compact-stack">
              ${metrics.zoneHotspots
                .map(
                  (zone) => `
                    <div class="button-row" style="justify-content: space-between;">
                      <strong>${escapeHtml(zone.zone)}</strong>
                      <span>${escapeHtml(zone.cases)} casos · ${renderUrgencyBadge(zone.urgency)}</span>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
          <a class="btn btn-primary" href="#/reportar">${icon("add_location_alt")}Reportar desde mi zona</a>
        </aside>
      </section>
    </div>
  `;
}

function renderAdoption() {
  setTitle("Adopciones");
  const adoptable = allDogs().filter((dog) => dog.adoptionStatus === "Disponible");

  return `
    <div class="page-stack">
      <section class="flat-card" style="padding:0; overflow:hidden;">
        <div class="image-frame" style="aspect-ratio: 16 / 7;">
          <img src="${images.pipo}" alt="Perro feliz listo para adopcion" />
        </div>
        <div class="card-body">
          <span class="eyebrow">${icon("home")} Adopcion responsable</span>
          <h1 style="margin:0;">Tu nuevo mejor amigo te espera</h1>
          <p class="lead">Conoce perros rehabilitados y listos para una familia. Adoptar tambien es hacer seguimiento y cuidar a largo plazo.</p>
        </div>
      </section>
      <section class="section">
        <div class="section-header">
          <div>
            <h2>Perros disponibles</h2>
            <p>Perfiles conectados con historial y estado de salud.</p>
          </div>
        </div>
        <div class="grid grid-3">${adoptable.map(renderDogCard).join("")}</div>
      </section>
      <section class="grid grid-2">
        <div class="flat-card">
          <h2>Proceso de adopcion</h2>
          <ol class="timeline">
            <li><strong>Formulario</strong><p>Cuéntanos sobre tu hogar, tiempo y experiencia.</p></li>
            <li><strong>Entrevista</strong><p>Validamos que el entorno sea seguro para el perro.</p></li>
            <li><strong>Seguimiento</strong><p>CARAMELO acompaña el proceso durante las primeras semanas.</p></li>
          </ol>
        </div>
        <form id="adoption-form" class="form-card">
          <h2>Postulacion express</h2>
          <div class="form-grid">
            <div class="field">
              <label for="adopter-name">Nombre completo</label>
              <input id="adopter-name" name="name" required />
            </div>
            <div class="grid grid-2">
              <div class="field">
                <label for="adopter-phone">WhatsApp</label>
                <input id="adopter-phone" name="phone" inputmode="tel" required />
              </div>
              <div class="field">
                <label for="adopter-dog">Perro de interes</label>
                <select id="adopter-dog" name="dog">
                  ${adoptable.map((dog) => `<option>${escapeHtml(dog.name)}</option>`).join("")}
                  <option>Aun no lo se</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label for="adoption-reason">Por que deseas adoptar</label>
              <textarea id="adoption-reason" name="reason" required></textarea>
            </div>
            <button class="btn btn-primary" type="submit">Enviar solicitud de adopcion</button>
          </div>
        </form>
      </section>
    </div>
  `;
}

function renderDonations() {
  setTitle("Donaciones");
  const caseOptions = allCases()
    .map((item) => {
      const dog = getDog(item.dogId);
      return `<option value="${escapeHtml(item.id)}">${escapeHtml(dog?.name || item.id)} · ${escapeHtml(item.status)}</option>`;
    })
    .join("");

  return `
    <div class="page-stack">
      ${renderPageTitle(
        "Apoyo transparente",
        "Tu ayuda salva vidas hoy",
        "Puedes apoyar un caso especifico, donar alimento, cubrir medicamentos o fortalecer el fondo general de emergencias."
      )}
      <section class="grid grid-3">
        <article class="card">
          <div class="image-frame" style="aspect-ratio: 4 / 3;"><img src="${images.donation}" alt="Perro rescatado esperando apoyo" /></div>
          <div class="card-body"><h3>Emergencias medicas</h3><p>Medicamentos, radiografias, curaciones y hospitalizacion.</p></div>
        </article>
        <article class="card">
          <div class="image-frame" style="aspect-ratio: 4 / 3;"><img src="${images.food}" alt="Perros recibiendo alimento en refugio" /></div>
          <div class="card-body"><h3>Alimento y refugio</h3><p>Concentrado, cobijas, transporte y hogares temporales.</p></div>
        </article>
        <article class="card">
          <div class="image-frame" style="aspect-ratio: 4 / 3;"><img src="${images.medicalBill}" alt="Insumos medicos y factura veterinaria" /></div>
          <div class="card-body"><h3>Transparencia</h3><p>Cada aporte queda conectado a un caso o campana.</p></div>
        </article>
      </section>
      <section class="grid grid-2">
        <form id="donation-form" class="form-card">
          <h2>Crear intencion de donacion</h2>
          <div class="form-grid">
            <div class="field">
              <label for="donation-type">Tipo de ayuda</label>
              <select id="donation-type" name="type">
                <option>Dinero</option>
                <option>Alimento</option>
                <option>Medicina</option>
                <option>Transporte</option>
                <option>Hogar temporal</option>
              </select>
            </div>
            <div class="field">
              <label for="donation-amount">Monto aproximado en COP</label>
              <input id="donation-amount" name="amount" inputmode="numeric" placeholder="Ej: 50000" />
            </div>
            <div class="field">
              <label for="donation-case">Caso relacionado</label>
              <select id="donation-case" name="caseId">
                <option value="">Fondo general CARAMELO</option>
                ${caseOptions}
              </select>
            </div>
            <div class="field">
              <label for="donation-description">Descripcion</label>
              <textarea id="donation-description" name="description" placeholder="Ej: Puedo entregar alimento el sabado en el centro."></textarea>
            </div>
            <button class="btn btn-primary" type="submit">Continuar con mi donacion</button>
          </div>
        </form>
        <div class="flat-card">
          <h2>Ultimos apoyos registrados</h2>
          <div class="compact-stack">
            ${donations
              .map(
                (item) => `
                  <div class="flat-card" style="box-shadow:none;">
                    <div class="button-row" style="justify-content:space-between;">
                      <strong>${escapeHtml(item.type)}</strong>
                      <span class="badge">${escapeHtml(item.status)}</span>
                    </div>
                    <p>${escapeHtml(item.description)}</p>
                    <p class="muted">${item.amount ? money(item.amount) : "Aporte en especie"} · ${escapeHtml(formatDate(item.date))}</p>
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderCampaigns() {
  setTitle("Campanas");
  return `
    <div class="page-stack">
      ${renderPageTitle(
        "Prevencion",
        "Campanas de esterilizacion, vacunacion y adopcion",
        "CARAMELO tambien trabaja antes de la emergencia: prevencion, educacion y jornadas con aliados locales."
      )}
      <section class="grid grid-3">
        ${campaigns
          .map(
            (campaign) => `
              <article class="flat-card">
                <span class="badge">${escapeHtml(campaign.type)}</span>
                <h2>${escapeHtml(campaign.name)}</h2>
                <p>${escapeHtml(campaign.description)}</p>
                <ul class="meta-list">
                  <li>${icon("event")}${escapeHtml(formatDate(campaign.date))}</li>
                  <li>${icon("location_on")}${escapeHtml(campaign.location)}</li>
                  <li>${icon("groups")}${escapeHtml(campaign.capacity)} cupos</li>
                </ul>
                <p class="muted">Aliados: ${escapeHtml(campaign.partners.join(", "))}</p>
                <a class="btn btn-primary" href="#/reportar">Solicitar cupo prioritario</a>
              </article>
            `
          )
          .join("")}
      </section>
    </div>
  `;
}

function renderEducation() {
  setTitle("Educacion");
  return `
    <div class="page-stack">
      <section class="hero" style="min-height:auto;">
        <div class="hero-copy">
          <span class="eyebrow">${icon("menu_book")} Modulo educativo</span>
          <h1>Guias claras para actuar sin improvisar.</h1>
          <p class="lead">La ayuda empieza con decisiones simples: observar, reportar bien, no ponerse en riesgo y activar la red correcta.</p>
          <a class="btn btn-primary" href="#/reportar">Reportar perro en riesgo</a>
        </div>
        <div class="hero-media"><img src="${images.education}" alt="Persona cuidando a un perro en Popayan" /></div>
      </section>
      <section class="grid grid-3">
        ${educationGuides
          .map(
            (guide) => `
              <article class="flat-card">
                <span class="badge">${escapeHtml(guide.category)}</span>
                <h2>${escapeHtml(guide.title)}</h2>
                <p>${escapeHtml(guide.summary)}</p>
                <ol class="timeline">
                  ${guide.steps.map((step) => `<li><p>${escapeHtml(step)}</p></li>`).join("")}
                </ol>
              </article>
            `
          )
          .join("")}
      </section>
      <section class="flat-card">
        <h2>Preguntas frecuentes</h2>
        <details>
          <summary><strong>Puedo reportar si no tengo foto?</strong></summary>
          <p>Si. Una foto ayuda, pero la ubicacion y una descripcion clara tambien activan la red.</p>
        </details>
        <details>
          <summary><strong>CARAMELO reemplaza a refugios o autoridades?</strong></summary>
          <p>No. CARAMELO coordina informacion y apoyo para que refugios, voluntarios y autoridades actuen mejor.</p>
        </details>
        <details>
          <summary><strong>Que hago si el caso es critico?</strong></summary>
          <p>Reporta de inmediato, mantente seguro y evita mover al animal si puede haber fracturas o agresividad por dolor.</p>
        </details>
      </section>
    </div>
  `;
}

function renderDashboard() {
  setTitle("Dashboard");
  const statusRows = Object.entries(metrics.statusDistribution)
    .map(
      ([status, count]) => `
        <tr>
          <td>${escapeHtml(status)}</td>
          <td>${count}</td>
          <td>${renderStatusBadge(status)}</td>
        </tr>
      `
    )
    .join("");
  const bars = metrics.weeklyCases
    .map((value) => `<span style="height:${value * 4}%"><strong>${value}</strong></span>`)
    .join("");

  return `
    <div class="page-stack">
      ${renderPageTitle(
        "Indicadores",
        "Dashboard de cuidado animal",
        "Vista mock para refugios, universidades, autoridades y administradores. Lista para conectar datos reales despues."
      )}
      <section class="grid grid-4">
        <article class="flat-card metric-card"><span>Casos asignados</span><span class="metric-value">${metrics.activeCases}</span><strong>+12% vs mes anterior</strong></article>
        <article class="flat-card metric-card"><span>Capacidad refugios</span><span class="metric-value">${metrics.shelterCapacity}%</span><div class="progress"><span style="width:${metrics.shelterCapacity}%;"></span></div></article>
        <article class="flat-card metric-card"><span>Urgencias pendientes</span><span class="metric-value" style="color:var(--danger);">${metrics.criticalCases}</span><strong>Requiere atencion inmediata</strong></article>
        <article class="flat-card metric-card"><span>Voluntarios</span><span class="metric-value">${metrics.activeVolunteers}</span><strong>Activos en Popayan</strong></article>
      </section>
      <section class="grid grid-dashboard">
        <div class="flat-card">
          <h2>Impacto semanal</h2>
          <div class="chart-bars">${bars}</div>
          <ul class="chart-legend">
            <li>Lun</li><li>Mar</li><li>Mie</li><li>Jue</li><li>Vie</li><li>Sab</li><li>Hoy</li>
          </ul>
        </div>
        <div class="flat-card">
          <h2>Estados de casos</h2>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Estado</th><th>Total</th><th>Etiqueta</th></tr></thead>
              <tbody>${statusRows}</tbody>
            </table>
          </div>
        </div>
      </section>
      <section class="grid grid-3">
        <a class="flat-card" href="#/refugio"><h2>Panel refugio</h2><p class="muted">Capacidad, tareas, casos asignados y necesidades.</p></a>
        <a class="flat-card" href="#/veterinario"><h2>Panel veterinario</h2><p class="muted">Triage, diagnosticos y proximas revisiones.</p></a>
        <a class="flat-card" href="#/voluntariado"><h2>Panel voluntarios</h2><p class="muted">Misiones, disponibilidad e impacto personal.</p></a>
      </section>
    </div>
  `;
}

function renderShelterPanel() {
  setTitle("Panel refugio");
  const assigned = allCases().filter((item) => ["Reportado", "En revisión", "Asignado", "En atención"].includes(item.status)).slice(0, 4);

  return `
    <div class="page-stack">
      ${renderPageTitle(
        "Refugios y fundaciones",
        "Panel para priorizar y coordinar casos",
        "Gestiona urgencias, capacidad, tareas de cuidado y necesidades del refugio con datos mock."
      )}
      <section class="grid grid-3">
        ${shelters
          .map(
            (shelter) => `
              <article class="flat-card">
                <h2>${escapeHtml(shelter.name)}</h2>
                <p class="muted">${icon("location_on")}${escapeHtml(shelter.location)} · ${escapeHtml(shelter.contact)}</p>
                <span class="metric-value">${escapeHtml(shelter.availableCapacity)}</span>
                <strong>Cupos disponibles</strong>
                <ul class="meta-list">${shelter.needs.map((need) => `<li>${escapeHtml(need)}</li>`).join("")}</ul>
                <span class="badge urgency-alto">${escapeHtml(shelter.status)}</span>
              </article>
            `
          )
          .join("")}
      </section>
      <section class="grid grid-wide">
        <div class="flat-card">
          <h2>Solicitudes de urgencia</h2>
          <div class="grid grid-2">${assigned.map(renderCaseCard).join("")}</div>
        </div>
        <aside class="flat-card">
          <h2>Tareas prioritarias</h2>
          <ol class="timeline">
            <li><strong>Vacunacion pendiente para Pecas</strong><p>Vence hoy a las 17:00.</p></li>
            <li><strong>Entrevista adopcion: Toby</strong><p>Manana, 10:00 AM.</p></li>
            <li><strong>Pedido de alimento balanceado</strong><p>Stock bajo: 15 kg restantes.</p></li>
          </ol>
        </aside>
      </section>
    </div>
  `;
}

function renderVeterinaryPanel() {
  setTitle("Panel veterinario");
  const critical = allCases().filter((item) => ["Crítico", "Alto"].includes(item.urgencyLevel)).slice(0, 3);

  return `
    <div class="page-stack">
      ${renderPageTitle(
        "Atencion veterinaria",
        "Panel veterinario",
        "Registra triage basico, diagnosticos, tratamientos y proximas revisiones para cada perro."
      )}
      <section class="grid grid-2">
        <div class="flat-card">
          <h2>Triage prioritario</h2>
          <div class="compact-stack">
            ${critical
              .map((item) => {
                const dog = getDog(item.dogId);
                return `
                  <div class="flat-card" style="box-shadow:none;">
                    <div class="button-row" style="justify-content:space-between;">
                      <strong>${escapeHtml(dog?.name || "Sin nombre")}</strong>
                      ${renderUrgencyBadge(item.urgencyLevel)}
                    </div>
                    <p>${escapeHtml(item.description)}</p>
                    <a class="btn btn-secondary" href="#/casos/${escapeHtml(item.id)}">Abrir caso</a>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
        <form id="vet-form" class="form-card">
          <h2>Registro medico basico</h2>
          <div class="form-grid">
            <div class="field">
              <label for="vet-dog">Perro</label>
              <select id="vet-dog" name="dogId">${allDogs().map((dog) => `<option value="${escapeHtml(dog.id)}">${escapeHtml(dog.name)}</option>`).join("")}</select>
            </div>
            <div class="field">
              <label for="diagnosis">Diagnostico</label>
              <textarea id="diagnosis" name="diagnosis" required></textarea>
            </div>
            <div class="field">
              <label for="treatment">Tratamiento</label>
              <textarea id="treatment" name="treatment" required></textarea>
            </div>
            <button class="btn btn-primary" type="submit">Guardar registro mock</button>
          </div>
        </form>
      </section>
      <section class="grid grid-2">
        ${veterinaryRecords
          .map((record) => {
            const dog = getDog(record.dogId);
            return `
              <article class="flat-card">
                <span class="badge">${escapeHtml(record.date)}</span>
                <h2>${escapeHtml(dog?.name || "Perro")}</h2>
                <p><strong>${escapeHtml(record.diagnosis)}</strong></p>
                <p>${escapeHtml(record.treatment)}</p>
                <p class="muted">Vacunas: ${escapeHtml(record.vaccines.join(", "))} · Esterilizado: ${record.sterilized ? "Si" : "No"}</p>
              </article>
            `;
          })
          .join("")}
      </section>
    </div>
  `;
}

function renderVolunteerPanel() {
  setTitle("Panel voluntarios");
  return `
    <div class="page-stack">
      <section class="hero" style="min-height:auto;">
        <div class="hero-copy">
          <span class="eyebrow">${icon("volunteer_activism")} Voluntariado</span>
          <h1>Hola, Juan. Tu compromiso esta cambiando vidas en Popayan.</h1>
          <p class="lead">Explora misiones activas y ayuda con transporte, hogar temporal, alimento o difusion.</p>
        </div>
        <div class="hero-media"><img src="${images.volunteer}" alt="Voluntarios ayudando perros en un parque" /></div>
      </section>
      <section class="grid grid-3">
        <article class="flat-card metric-card"><span>Rescates apoyados</span><span class="metric-value">12</span><strong>Este trimestre</strong></article>
        <article class="flat-card metric-card"><span>Hogares temporales</span><span class="metric-value">4</span><strong>Verificados</strong></article>
        <article class="flat-card metric-card"><span>Zonas activas</span><span class="metric-value">2</span><strong>Norte y Centro</strong></article>
      </section>
      <section class="grid grid-wide">
        <div class="flat-card">
          <h2>Misiones disponibles</h2>
          <div class="compact-stack">
            ${volunteerMissions
              .map(
                (mission) => `
                  <article class="card">
                    <div class="grid grid-2">
                      <div class="image-frame" style="aspect-ratio: 4 / 3;"><img src="${escapeHtml(mission.image)}" alt="${escapeHtml(mission.title)}" /></div>
                      <div class="card-body">
                        <span class="badge">${escapeHtml(mission.type)}</span>
                        <h3>${escapeHtml(mission.title)}</h3>
                        <p>${escapeHtml(mission.description)}</p>
                        <p class="muted">${escapeHtml(mission.zone)} · ${escapeHtml(mission.distance)}</p>
                        <div class="button-row">
                          <button class="btn btn-primary" type="button" data-action="accept-mission">Aceptar mision</button>
                          <a class="btn btn-secondary" href="#/casos/${escapeHtml(mission.relatedCaseId)}">Detalles</a>
                        </div>
                      </div>
                    </div>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
        <form id="volunteer-form" class="form-card">
          <h2>Mi disponibilidad</h2>
          <div class="form-grid">
            <div class="field">
              <label for="vol-zone">Zonas de ayuda</label>
              <input id="vol-zone" name="zone" value="Norte, Centro" />
            </div>
            <div class="field">
              <label for="vol-availability">Horario preferido</label>
              <select id="vol-availability" name="availability">
                <option>Mananas</option>
                <option selected>Tardes</option>
                <option>Noches</option>
                <option>Fines de semana</option>
              </select>
            </div>
            <fieldset class="field">
              <legend>Tipo de ayuda</legend>
              <label><input type="checkbox" checked /> Transporte</label>
              <label><input type="checkbox" checked /> Hogar temporal</label>
              <label><input type="checkbox" /> Difusion</label>
            </fieldset>
            <button class="btn btn-primary" type="submit">Actualizar mi perfil</button>
          </div>
        </form>
      </section>
    </div>
  `;
}

function renderRoute() {
  const path = getHashPath();
  const parts = path.replace(/^#\/?/, "").split("/").filter(Boolean);

  if (parts.length === 0) return renderHome();
  if (parts[0] === "reportar") return renderReport();
  if (parts[0] === "casos" && parts[1]) return renderCaseDetail(parts[1]);
  if (parts[0] === "casos") return renderCases();
  if (parts[0] === "perros" && parts[1]) return renderDogProfile(parts[1]);
  if (parts[0] === "mapa") return renderMap();
  if (parts[0] === "adoptar") return renderAdoption();
  if (parts[0] === "donar") return renderDonations();
  if (parts[0] === "campanas") return renderCampaigns();
  if (parts[0] === "educacion") return renderEducation();
  if (parts[0] === "dashboard") return renderDashboard();
  if (parts[0] === "refugio") return renderShelterPanel();
  if (parts[0] === "veterinario") return renderVeterinaryPanel();
  if (parts[0] === "voluntariado") return renderVolunteerPanel();

  setTitle("Pagina no encontrada");
  return `<div class="empty-state"><h1>Pagina no encontrada</h1><p>La ruta solicitada no existe en el MVP.</p><a class="btn btn-primary" href="#/">Ir al inicio</a></div>`;
}

function render() {
  const path = getHashPath();
  app.innerHTML = `
    <div class="site-shell">
      ${renderHeader(path)}
      <main id="main-content" class="main" tabindex="-1">
        ${renderRoute()}
      </main>
      ${renderFooter()}
      ${renderMobileNav(path)}
      ${renderToast()}
    </div>
  `;
  bindEvents();
  const main = document.querySelector("#main-content");
  if (main) main.focus({ preventScroll: true });
}

function bindEvents() {
  const reportForm = document.querySelector("#report-form");
  if (reportForm) {
    reportForm.addEventListener("submit", handleReportSubmit);
    const input = reportForm.querySelector("#report-photo");
    input?.addEventListener("change", handlePhotoPreview);
  }

  document.querySelectorAll("[data-filter]").forEach((select) => {
    select.addEventListener("change", (event) => {
      if (event.target.dataset.filter === "status") {
        state.caseStatusFilter = event.target.value;
      }
      if (event.target.dataset.filter === "urgency") {
        state.caseUrgencyFilter = event.target.value;
      }
      render();
    });
  });

  document.querySelector("#adoption-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.reset();
    showToast("Solicitud enviada", "El equipo de adopciones revisara tu postulacion y te contactara por WhatsApp.");
  });

  document.querySelector("#donation-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.reset();
    showToast("Donacion registrada", "Tu intencion de apoyo quedo registrada en el mock de CARAMELO.");
  });

  document.querySelector("#vet-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.reset();
    showToast("Registro guardado", "El registro veterinario mock quedo listo para conectar a base de datos.");
  });

  document.querySelector("#volunteer-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Perfil actualizado", "Tus zonas y disponibilidad quedaron actualizadas en esta sesion.");
  });

  document.querySelectorAll("[data-action='accept-mission']").forEach((button) => {
    button.addEventListener("click", () => {
      showToast("Mision aceptada", "Gracias. El refugio recibira tu postulacion de apoyo.");
    });
  });

  document.querySelector("[data-action='new-report']")?.addEventListener("click", () => {
    state.lastReport = null;
    render();
  });
}

function handlePhotoPreview(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (state.pendingPhoto) {
    URL.revokeObjectURL(state.pendingPhoto);
  }
  state.pendingPhoto = URL.createObjectURL(file);
  const preview = document.querySelector("#photo-preview");
  if (preview) {
    preview.innerHTML = `
      <div class="image-frame" style="width:100%; max-height:260px; border-radius:18px;">
        <img src="${state.pendingPhoto}" alt="Vista previa de la foto del reporte" />
      </div>
      <label class="btn btn-secondary" for="report-photo">${icon("change_circle")}Cambiar foto</label>
      <input id="report-photo" name="photo" type="file" accept="image/*" class="visually-hidden" />
    `;
    preview.querySelector("#report-photo")?.addEventListener("change", handlePhotoPreview);
  }
}

function handleReportSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  const timestamp = Date.now();
  const dogId = `dog-report-${timestamp}`;
  const caseId = `case-report-${timestamp}`;
  const location = data.get("location") || "Ubicacion por confirmar";
  const description = data.get("description") || "Reporte ciudadano sin descripcion adicional.";
  const photo = state.pendingPhoto || images.careHand;

  const dog = {
    id: dogId,
    name: "Sin nombre",
    photo,
    gallery: [photo],
    sex: "Por confirmar",
    size: "Por confirmar",
    color: "Por confirmar",
    estimatedAge: "Por confirmar",
    healthStatus: "Pendiente de valoracion",
    adoptionStatus: "No disponible aun",
    foundLocation: String(location),
    history: "Caso creado desde un reporte ciudadano. La red esta verificando la situacion."
  };

  const caseItem = {
    id: caseId,
    dogId,
    reporterId: "user-ciudadana-1",
    photo,
    location: String(location),
    coordinates: { lat: 2.45, lng: -76.61 },
    description: String(description),
    urgencyLevel: String(data.get("urgencyLevel") || "Alto"),
    caseType: String(data.get("caseType") || "Otro"),
    status: "Reportado",
    createdAt: new Date().toISOString(),
    assignedTo: "Red CARAMELO",
    progress: 8,
    needs: ["Verificacion cercana", "Difusion", "Apoyo comunitario"],
    updates: [
      {
        date: new Date().toLocaleString("es-CO"),
        title: "Reporte recibido",
        text: "Gracias por reportar este caso. Tu ayuda puede activar una red de cuidado."
      }
    ]
  };

  state.localDogs.unshift(dog);
  state.localCases.unshift(caseItem);
  state.lastReport = caseItem;
  state.pendingPhoto = null;
  render();
}

window.addEventListener("hashchange", () => {
  if (!getHashPath().startsWith("#/reportar")) {
    state.lastReport = null;
  }
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

render();
