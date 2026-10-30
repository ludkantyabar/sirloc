"use strict";

const app = document.querySelector("#app");
const dialog = document.querySelector("#action-dialog");
const announcer = document.querySelector("#announcer");
const validDemoDni = "40374767";

const state = {
  screen: "home",
  registrationStatus: "Vigente",
  verifiedDni: "",
  study: ["Título profesional", "Ingeniería de sistemas", "Universidad de demostración", "Lima / Perú"],
  personal: {
    names: "Ludkant Ronald",
    paternal: "Yabar",
    maternal: "Galindo",
    email: "ciudadano@ejemplo.pe",
    phone: "900 000 000",
    address: "Dirección de demostración",
    department: "Puno",
    province: "Puno",
    district: "Puno",
  },
  accepted: new Set(),
  courses: [
    ["Curso", "Gestión de proyectos", "Instituto de demostración", "80"],
    ["Taller", "Herramientas digitales", "Centro de formación", "40"],
  ],
  experience: [
    ["Entidad de demostración", "Asistente administrativo", "01/2022 - 12/2023"],
    ["Organización de ejemplo", "Soporte técnico", "03/2020 - 11/2021"],
  ],
  trackingSearched: false,
};

const stepNames = [
  "Datos personales",
  "Formación académica",
  "Experiencia laboral",
  "Declaración jurada",
  "Confirmación",
];

const declarations = [
  "Declaro que no me encuentro inscrito en el Registro de Deudores Alimentarios Morosos (REDAM).",
  "Declaro que no estoy impedido o impedida de contratar con el Estado.",
  "Declaro que la documentación y la información presentada son verdaderas.",
];

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}
function field({
  id,
  label,
  value = "",
  type = "text",
  required = false,
  hint = "",
  disabled = false,
  autocomplete = "",
  inputmode = "",
}) {
  const describedBy = hint ? ` aria-describedby="${id}-hint"` : "";
  const extra = [
    required ? " required" : "",
    disabled ? " disabled" : "",
    autocomplete ? ` autocomplete="${autocomplete}"` : "",
    inputmode ? ` inputmode="${inputmode}"` : "",
    describedBy,
  ].join("");
  return `
    <div class="field">
      <label for="${id}">${label}${required ? ' <span class="required-mark" aria-hidden="true">*</span>' : ""}</label>
      <input id="${id}" name="${id}" type="${type}" value="${escapeHTML(value)}"${extra}>
      ${hint ? `<p class="field-hint" id="${id}-hint">${hint}</p>` : ""}
    </div>`;
}

function shell(content, active = "home") {
  const nav = [
    ["home", "⌂", "Inicio"],
    ["tracking", "▣", "Consultar registro"],
    ["personal", "＋", "Registrar datos"],
  ];
  return `
    <div class="app-shell">
      <aside class="sidebar">
        <a class="brand" href="#home" data-screen="home" aria-label="SIRLOC, ir al inicio">
          <span class="brand-mark" aria-hidden="true">JNE</span>
          <span><strong>SIRLOC</strong><small>Registro de locadores</small></span>
        </a>
        <nav class="side-nav" aria-label="Navegación principal">
          ${nav.map(([screen, icon, label]) => `
            <a href="#${screen}" data-screen="${screen}" ${screen === active ? 'aria-current="page"' : ""}>
              <span aria-hidden="true">${icon}</span>${label}
            </a>`).join("")}
        </nav>
        <p class="prototype-note"><strong>Prototipo:</strong> las consultas y los datos mostrados son simulados; no se envía información a servicios externos.</p>
      </aside>
      <div class="page">
        <header class="site-header">
          <p>Jurado Nacional de Elecciones</p>
          <div class="user-chip">
            <span class="avatar" aria-hidden="true">LR</span>
            <div><small>Modo de demostración</small><strong>Ciudadano de ejemplo</strong></div>
          </div>
        </header>
        ${content}
      </div>
    </div>`;
}

function intro(eyebrow, title, description) {
  return `<header class="page-intro"><p class="eyebrow">${eyebrow}</p><h1 id="page-title" tabindex="-1">${title}</h1><p>${description}</p></header>`;
}

function homePage() {
  const cancelDescription = state.registrationStatus === "Vigente"
    ? "Solicita la anulación de tu inscripción actual."
    : "La inscripción de demostración ya está anulada.";
  return shell(`
    <main id="main-content">
      ${intro("Bienvenido(a)", "Sistema integrado de registro de locadores", "Administra tu información para participar en convocatorias del Jurado Nacional de Elecciones.")}
      <div class="home-grid">
        <section class="card" aria-labelledby="available-actions">
          <h2 id="available-actions">Acciones disponibles</h2>
          <div class="action-cards">
            <article class="card action-card">
              <h3>Consultar registro</h3>
              <p>Revisa el estado y la información de tu registro.</p>
              <a class="button secondary" href="#tracking" data-screen="tracking">Consultar registro</a>
            </article>
            <article class="card action-card">
              <h3>Registrar datos</h3>
              <p>Completa el recorrido de inscripción de cinco pasos.</p>
              <a class="button" href="#personal" data-screen="personal">Iniciar registro</a>
            </article>
            <article class="card action-card">
              <h3>Cancelar registro</h3>
              <p>${cancelDescription}</p>
              <button class="button secondary" type="button" data-action="cancel-registration"${state.registrationStatus !== "Vigente" ? " disabled" : ""}>Solicitar cancelación</button>
            </article>
          </div>
        </section>
        <aside class="card contact-card" aria-labelledby="contact-title">
          <h2 id="contact-title">Información de contacto</h2>
          <p><strong>¿Necesitas ayuda?</strong><br>El equipo de soporte puede orientarte sobre el uso del sistema.</p>
          <hr>
          <p><strong>Horario de atención</strong><br>Lunes a viernes, de 8:30 a. m. a 5:30 p. m.</p>
        </aside>
      </div>
    </main>`, "home");
}

function registrationHeader(step) {
  return `
    ${intro("Solicitud · Registro", "Actualización de registro", "Completa la información solicitada para continuar con tu inscripción.")}
    <nav aria-label="Progreso del registro">
      <ol class="steps">
        ${stepNames.map((name, index) => `
          <li class="step"${index + 1 === step ? ' aria-current="step"' : ""}>
            <span class="step-number" aria-hidden="true">${index + 1}</span>
            <span class="step-label">${name}</span>
          </li>`).join("")}
      </ol>
    </nav>`;
}

function registrationPage(content, step) {
  return shell(`<main id="main-content"><div class="registration-heading">${registrationHeader(step)}</div>${content}</main>`, "personal");
}

function actions(previous, nextScreen, nextLabel = "Siguiente", disabled = false, submit = false) {
  return `
    <div class="actions">
      <button class="button secondary" type="button" data-screen="${previous}">← Anterior</button>
      <button class="button" type="${submit ? "submit" : "button"}"${submit ? "" : ` data-screen="${nextScreen}"`}${disabled ? " disabled" : ""}>${nextLabel}${submit ? "" : " →"}</button>
    </div>`;
}

function personalPage() {
  const verified = state.verifiedDni.length === 8;
  const details = state.personal;
  return registrationPage(`
    <form class="panel" id="personal-form">
      <div class="panel-heading"><h2>Datos personales</h2><p>Los datos personales son de ejemplo.</p></div>
      <div class="form-grid">
        ${field({ id: "document-type", label: "Tipo de documento", value: "DNI", disabled: true })}
        ${field({ id: "dni", label: "Número de documento", value: state.verifiedDni, required: true, inputmode: "numeric", hint: "Escribe 8 dígitos. En esta demostración, usa 40374767 para mostrar datos de ejemplo." })}
        ${field({ id: "names", label: "Nombres", value: verified ? details.names : "", disabled: true })}
        ${field({ id: "paternal-name", label: "Apellido paterno", value: verified ? details.paternal : "", disabled: true })}
        ${field({ id: "maternal-name", label: "Apellido materno", value: verified ? details.maternal : "", disabled: true })}
        ${field({ id: "email", label: "Correo electrónico", value: verified ? details.email : "", type: "email", disabled: true })}
        ${field({ id: "phone", label: "Celular", value: verified ? details.phone : "", type: "tel", disabled: true })}
        ${field({ id: "address", label: "Dirección", value: verified ? details.address : "", disabled: true })}
        ${field({ id: "department", label: "Departamento", value: verified ? details.department : "", disabled: true })}
        ${field({ id: "province", label: "Provincia", value: verified ? details.province : "", disabled: true })}
        ${field({ id: "district", label: "Distrito", value: verified ? details.district : "", disabled: true})}
      </div>
      <p class="notice${verified ? " success" : ""}" id="dni-status" role="status" aria-live="polite">
        ${verified ? "Datos de demostración cargados correctamente." : "Completa el DNI de ejemplo para habilitar el resto de esta pantalla."}
      </p>
      <section aria-labelledby="documents-title">
        <h2 id="documents-title">Documentos requeridos</h2>
        <p class="help-text">En este prototipo, los documentos se representan como adjuntos de muestra.</p>
        <div class="form-grid">
          ${field({ id: "cv-file", label: "Currículum vitae (PDF)", type: "file" })}
          ${field({ id: "identity-file", label: "Documento de identidad (PDF)", type: "file" })}
        </div>
      </section>
      ${actions("home", "academic", "Continuar a formación", !verified, true)}
    </form>`, 1);
}

function table(headers, rows, caption, hasIndex = true) {
  return `
    <div class="table-wrap">
      <table>
        <caption>${caption}</caption>
        <thead><tr>${headers.map((header) => `<th scope="col">${header}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((row, rowIndex) => hasIndex ? `
              <tr>
                <th scope="row" data-label="${headers[0]}">${rowIndex + 1}</th>
                ${row.map((cell, cellIndex) => `<td data-label="${headers[cellIndex + 1]}">${escapeHTML(cell)}</td>`).join("")}
              </tr>` : `
              <tr><th scope="row" data-label="${headers[0]}">${escapeHTML(row[0])}</th>
                <td data-label="${headers[1]}">${escapeHTML(row[1])}</td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function sectionNavigation(active) {
  const sections = [
    ["academic", "Nivel de estudio"],
    ["complementary", "Formación complementaria"],
  ];
  return `<nav class="section-nav" aria-label="Secciones de formación">
    ${sections.map(([screen, label]) => `<a href="#${screen}" data-screen="${screen}"${screen === active ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
  </nav>`;
}

function academicPage() {
  return registrationPage(`
    <section class="panel">
      <div class="panel-heading"><h2>Formación académica</h2><p>Información ilustrativa para este prototipo.</p></div>
      ${sectionNavigation("academic")}
      <p class="notice"><strong>Importante:</strong> El nivel mínimo de estudios depende de los requisitos de cada convocatoria.</p>
      ${table(["N.º", "Nivel de estudio", "Carrera", "Institución", "Ciudad / país"], [state.study], "Estudios registrados")}
      <div class="toolbar"><button class="button secondary" type="button" data-action="add-study">Agregar estudio</button></div>
      ${actions("personal", "complementary", "Continuar a formación complementaria")}
    </section>`, 2);
}

function complementaryPage() {
  return registrationPage(`
    <section class="panel">
      <div class="panel-heading"><h2>Formación complementaria</h2><p>Registra cursos, talleres y certificaciones.</p></div>
      ${sectionNavigation("complementary")}
      ${table(["N.º", "Tipo", "Nombre de la formación", "Institución", "Horas"], state.courses, "Formación complementaria registrada")}
      <div class="toolbar"><button class="button secondary" type="button" data-action="add-course">Agregar formación</button></div>
      ${actions("academic", "experience", "Continuar a experiencia laboral")}
    </section>`, 2);
}

function experiencePage() {
  return registrationPage(`
    <section class="panel">
      <div class="panel-heading"><h2>Experiencia laboral</h2><p>Registra tu experiencia profesional sustentada.</p></div>
      ${table(["N.º", "Empresa o entidad", "Función o actividad", "Periodo"], state.experience, "Experiencia profesional registrada")}
      <div class="toolbar"><button class="button secondary" type="button" data-action="add-experience">Agregar experiencia</button></div>
      <p class="notice"><strong>Importante:</strong> La información mostrada es de demostración y no se conserva al cerrar esta página.</p>
      ${actions("complementary", "declaration", "Continuar a declaración jurada")}
    </section>`, 3);
}

function declarationPage() {
  const valid = state.verifiedDni.length === 8;
  const allAccepted = state.accepted.size === declarations.length;
  return registrationPage(`
    <form class="panel" id="declaration-form">
      <div class="panel-heading"><h2>Declaración jurada</h2><p>Revisa y acepta cada declaración para continuar.</p></div>
      <div class="form-grid">
        ${field({ id: "declaration-dni", label: "Número de DNI", value: state.verifiedDni, required: true, inputmode: "numeric", hint: "El DNI debe tener 8 dígitos." })}
        <div class="field"><span class="fieldset-label">Validación de requisitos</span><p class="help-text" id="eligibility-status" role="status" aria-live="polite">${valid ? "Validación simulada: el ciudadano de ejemplo puede continuar." : "Ingresa un DNI para consultar la validación simulada."}</p></div>
      </div>
      <fieldset class="check-list">
        <legend>El/la solicitante declara bajo juramento lo siguiente:</legend>
        ${declarations.map((text, index) => `
          <label class="check-row" for="declaration-${index}">
            <input id="declaration-${index}" name="declarations" type="checkbox" value="${index}"${state.accepted.has(index) ? " checked" : ""}${valid ? "" : " disabled"}>
            <span>${text}</span>
          </label>`).join("")}
      </fieldset>
      ${actions("experience", "confirmation", "Revisar ficha", !(valid && allAccepted), true)}
    </form>`, 4);
}

function confirmationPage() {
  const details = state.personal;
  return registrationPage(`
    <section class="panel">
      <div class="panel-heading"><h2>Visualización del documento</h2><p>Revisa la ficha antes de finalizar.</p></div>
      <article class="document-preview" aria-labelledby="document-title">
        <header><p class="eyebrow">Jurado Nacional de Elecciones · SIRLOC</p><h2 id="document-title">Ficha de inscripción</h2><p>Resumen de información registrada en este prototipo.</p></header>
        <section aria-labelledby="summary-personal"><h2 id="summary-personal">1. Datos personales</h2>
          ${table(["Dato", "Información"], [
            ["Documento", `DNI ${state.verifiedDni}`],
            ["Nombres", `${details.names} ${details.paternal} ${details.maternal}`],
            ["Correo", details.email],
          ], "Resumen de datos personales", false)}
        </section>
        <section aria-labelledby="summary-academic"><h2 id="summary-academic">2. Formación académica</h2><p>Título profesional · Ingeniería de sistemas · Universidad de demostración</p></section>
        <section aria-labelledby="summary-experience"><h2 id="summary-experience">3. Experiencia laboral</h2><p>${state.experience.length} registros de demostración.</p></section>
        <section aria-labelledby="summary-declaration"><h2 id="summary-declaration">4. Declaración jurada</h2><p>Declaraciones aceptadas para esta demostración.</p></section>
      </article>
      <div class="button-row">
        <button class="button secondary" type="button" data-action="print">Imprimir o guardar como PDF</button>
      </div>
      <div class="actions"><button class="button secondary" type="button" data-screen="declaration">← Anterior</button><button class="button" type="button" data-action="complete-registration">Finalizar registro</button></div>
    </section>`, 5);
}

function trackingPage() {
  const result = state.trackingSearched
    ? `<section class="card result-card" aria-labelledby="record-result-title">
        <h2 id="record-result-title" tabindex="-1">Resultado de la consulta</h2>
        <dl>
          <dt>Número de registro</dt><dd>REG-2026-0042</dd>
          <dt>Titular</dt><dd>Ciudadano de demostración</dd>
          <dt>Estado</dt><dd><span class="status${state.registrationStatus === "Vigente" ? "" : " cancelled"}">${state.registrationStatus}</span></dd>
          <dt>Última actualización</dt><dd>15 de octubre de 2026</dd>
        </dl>
        <button class="button secondary" type="button" data-screen="record-detail">Ver ficha del registro</button>
      </section>`
    : "";
  return shell(`
    <main id="main-content">
      ${intro("Consulta", "Consultar registro", "Ingresa el número de documento para consultar un registro de demostración.")}
      <form class="panel" id="tracking-form">
        <div class="panel-heading"><h2>Buscar inscripción</h2><p>La búsqueda no consulta servicios externos.</p></div>
        <div class="form-grid">${field({ id: "tracking-dni", label: "Número de DNI", value: state.verifiedDni, required: true, inputmode: "numeric", hint: "Escribe 8 dígitos para mostrar el resultado de ejemplo." })}</div>
        <div class="actions"><a class="button secondary" href="#home" data-screen="home">Volver al inicio</a><button class="button" type="submit">Consultar registro</button></div>
      </form>
      ${result}
    </main>`, "tracking");
}

function recordDetailPage() {
  return registrationPage(`
    <section class="panel">
      <div class="panel-heading"><h2>Visualización del documento</h2><p>Ficha de inscripción de demostración.</p></div>
      <article class="document-preview" aria-labelledby="detail-document-title">
        <header><p class="eyebrow">Jurado Nacional de Elecciones · SIRLOC</p><h2 id="detail-document-title">Ficha del registro REG-2026-0042</h2></header>
        <section><h2>Datos del titular</h2><p>Ciudadano de demostración</p><p>Estado: <span class="status${state.registrationStatus === "Vigente" ? "" : " cancelled"}">${state.registrationStatus}</span></p></section>
        <section><h2>Información profesional</h2><p>Formación y experiencia registradas para fines de demostración.</p></section>
      </article>
      <div class="actions"><button class="button secondary" type="button" data-screen="tracking">← Volver a la consulta</button><button class="button secondary" type="button" data-action="print">Imprimir o guardar como PDF</button></div>
    </section>`, 5);
}

function render({ focus = true } = {}) {
  const pages = {
    home: homePage,
    personal: personalPage,
    academic: academicPage,
    complementary: complementaryPage,
    experience: experiencePage,
    declaration: declarationPage,
    confirmation: confirmationPage,
    tracking: trackingPage,
    "record-detail": recordDetailPage,
  };
  app.innerHTML = (pages[state.screen] || homePage)();
  if (focus) {
    const heading = app.querySelector("#page-title");
    heading?.focus();
  }
}

function navigate(screen) {
  state.screen = screen;
  render();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function notify(message) {
  announcer.textContent = "";
  window.setTimeout(() => {
    announcer.textContent = message;
  }, 20);
}

function showDialog(title, body, onSubmit) {
  dialog.innerHTML = `
    <form class="dialog-content" method="dialog" id="dialog-form">
      <h2 id="dialog-title">${title}</h2>
      ${body}
      <div class="dialog-actions">
        <button class="button secondary" type="button" data-action="close-dialog">Cancelar</button>
        <button class="button" type="submit">Guardar</button>
      </div>
    </form>`;
  dialog.showModal();
  dialog.querySelector("#dialog-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    onSubmit(new FormData(form));
    dialog.close();
    render();
    notify("El registro de demostración se agregó correctamente.");
  }, { once: true });
}

function openCancelDialog() {
  dialog.innerHTML = `
    <div class="dialog-content">
      <h2 id="dialog-title">¿Anular la inscripción?</h2>
      <p>Esta acción cambiará el estado del registro de demostración a “Anulada”. La información seguirá disponible para consulta.</p>
      <div class="dialog-actions">
        <button class="button secondary" type="button" data-action="close-dialog">Volver</button>
        <button class="button danger" type="button" data-action="confirm-cancel">Sí, anular inscripción</button>
      </div>
    </div>`;
  dialog.showModal();
  dialog.querySelector('[data-action="confirm-cancel"]').focus();
}

function openAddDialog(kind) {
  if (kind === "study") {
    showDialog("Agregar nivel de estudio", `
      ${field({ id: "study-level", label: "Nivel de estudio", required: true })}
      ${field({ id: "study-career", label: "Carrera profesional", required: true })}
      ${field({ id: "study-institution", label: "Institución", required: true })}`, (form) => {
      state.study = [
        form.get("study-level"),
        form.get("study-career"),
        form.get("study-institution"),
        "Ciudad de demostración",
      ];
    });
    return;
  }

  if (kind === "course") {
    showDialog("Agregar formación complementaria", `
      ${field({ id: "course-type", label: "Tipo de formación", required: true })}
      ${field({ id: "course-name", label: "Nombre de la formación", required: true })}
      ${field({ id: "course-institution", label: "Institución", required: true })}
      ${field({ id: "course-hours", label: "Total de horas", type: "number", required: true })}`, (form) => {
      state.courses.push([
        form.get("course-type"),
        form.get("course-name"),
        form.get("course-institution"),
        form.get("course-hours"),
      ]);
    });
    return;
  }

  showDialog("Agregar experiencia laboral", `
    ${field({ id: "experience-company", label: "Empresa o entidad", required: true })}
    ${field({ id: "experience-role", label: "Función o actividad", required: true })}
    ${field({ id: "experience-period", label: "Periodo (inicio - fin)", required: true })}`, (form) => {
    state.experience.push([
      form.get("experience-company"),
      form.get("experience-role"),
      form.get("experience-period"),
    ]);
  });
}

app.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target.closest("[data-screen], [data-action]") : null;
  if (!target || target.matches(":disabled")) return;
  if (target.dataset.screen) {
    event.preventDefault();
    navigate(target.dataset.screen);
    return;
  }

  const { action } = target.dataset;
  if (action === "cancel-registration") openCancelDialog();
  if (action === "complete-registration") {
    navigate("home");
    notify("El recorrido de registro de demostración se completó.");
  }
  if (action === "add-study") openAddDialog("study");
  if (action === "add-course") openAddDialog("course");
  if (action === "add-experience") openAddDialog("experience");
  if (action === "print") window.print();
});

app.addEventListener("input", (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  if (input.id === "dni" || input.id === "declaration-dni" || input.id === "tracking-dni") {
    input.value = input.value.replace(/\D/g, "").slice(0, 8);
  }
  if (input.id === "dni") {
    const status = document.querySelector("#dni-status");
    const verified = input.value === validDemoDni;
    state.verifiedDni = verified ? input.value : "";
    if (status) {
      status.classList.toggle("success", verified);
      status.textContent = verified
        ? "Datos de demostración cargados correctamente."
        : input.value.length === 8
          ? "El DNI no coincide con el registro de demostración."
          : "Completa el DNI de ejemplo para habilitar el resto de esta pantalla.";
    }
    app.querySelector("#personal-form [type='submit']").disabled = !verified;
    const personalFields = {
      names: "names",
      "paternal-name": "paternal",
      "maternal-name": "maternal",
      email: "email",
      phone: "phone",
      address: "address",
      department: "department",
      province: "province",
      district: "district",
    };
    for (const [id, key] of Object.entries(personalFields)) {
      const fieldInput = document.getElementById(id);
      if (fieldInput) fieldInput.value = verified ? state.personal[key] : "";
    }
  }
  if (input.id === "declaration-dni") {
    const valid = input.value === validDemoDni;
    const status = document.querySelector("#eligibility-status");
    if (status) {
      status.textContent = valid
        ? "Validación simulada: el ciudadano de ejemplo puede continuar."
        : "Ingresa un DNI para consultar la validación simulada.";
    }
    const fieldset = app.querySelector("#declaration-form fieldset");
    if (fieldset) {
      for (const checkbox of fieldset.querySelectorAll("input")) checkbox.disabled = !valid;
    }
    const submit = app.querySelector("#declaration-form [type='submit']");
    if (submit) submit.disabled = !valid || state.accepted.size !== declarations.length;
  }
});

app.addEventListener("change", (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  if (input.name === "declarations") {
    const index = Number(input.value);
    if (input.checked) state.accepted.add(index);
    else state.accepted.delete(index);
    const submit = app.querySelector("#declaration-form [type='submit']");
    if (submit) submit.disabled = state.accepted.size !== declarations.length || state.verifiedDni.length !== 8;
  }
});

app.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;

  if (form.id === "personal-form") {
    const dni = form.elements.namedItem("dni").value;
    if (dni !== validDemoDni) {
      notify("Ingresa el DNI de demostración válido para continuar.");
      return;
    }
    state.verifiedDni = dni;
    navigate("academic");
  }

  if (form.id === "declaration-form") {
    const dni = form.elements.namedItem("declaration-dni").value;
    if (dni !== validDemoDni || state.accepted.size !== declarations.length) {
      notify("Completa la validación y acepta todas las declaraciones para continuar.");
      return;
    }
    state.verifiedDni = dni;
    navigate("confirmation");
  }

  if (form.id === "tracking-form") {
    const dni = form.elements.namedItem("tracking-dni").value;
    if (dni.length !== 8) {
      form.elements.namedItem("tracking-dni").focus();
      return;
    }
    state.verifiedDni = dni;
    state.trackingSearched = true;
    render();
    document.querySelector("#record-result-title")?.focus();
    notify("Consulta simulada completada.");
  }
});

dialog.addEventListener("click", (event) => {
  const action = event.target instanceof Element ? event.target.closest("[data-action]")?.dataset.action : undefined;
  if (action === "close-dialog") dialog.close();
  if (action === "confirm-cancel") {
    state.registrationStatus = "Anulada";
    dialog.close();
    render();
    notify("La inscripción de demostración ahora figura como anulada.");
  }
  if (event.target === dialog) dialog.close();
});

render({ focus: false });
