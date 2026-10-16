# Caminos — landing

> Trampas y decisiones fechadas. Lo viejo no se reescribe; se añade al final con su fecha.

## 2026-10-09 — El código pasó a inglés: cómo traducir referencias antiguas

La política es: todo el código en inglés (identificadores, archivos, carpetas, tipos, claves de
i18n, clases CSS, comentarios) y en español solo el texto visible y la documentación. Un documento,
commit o `caminos.md` anterior a esta fecha usa los nombres viejos; esta tabla los traduce.

Siguen en español a propósito, por contrato externo: rutas y anclas públicas (`/privacidad`,
`#servicios`, `#procesos`, `#proceso`, `#porque`, `#preguntas`, `#contacto`, `#ejemplos`), campos
JSON de la API del chat (`sesion_id`, `mensaje`, `idioma`, `respuesta`, `accion`,
`nombre_negocio`…), claves de `localStorage`/`sessionStorage` (`aiworks-tema`, `aiworks-language`…)
y los tokens de color de `globals.css` (`--papel`, `--tinta`, `--marca`…). El tipo `Theme` es ahora
`light`/`dark`, pero lo que se guarda en `localStorage` sigue siendo `claro`/`oscuro` (`STORED_VALUE` en
`shared/lib/theme.ts`), para no perder la preferencia de los visitantes.

### Carpetas de `frontend/features/`

| Antes | Ahora |
|---|---|
| `servicios/` | `services/` |
| `procesos/` | `processes/` |
| `proceso/` | `how-we-work/` |
| `porque/` | `why/` |
| `preguntas/` | `faq/` |
| `cta-final/` | `final-cta/` |

### Componentes

| Antes | Ahora |
|---|---|
| `Servicios`, `Procesos`, `ProcesoFila` | `Services`, `Processes`, `ProcessRow` |
| `Proceso`, `Fase`, `CintaTecnologias` | `HowWeWork`, `Phase`, `TechnologyTicker` |
| `Porque`, `CarruselEjemplos` | `Why`, `ExamplesCarousel` |
| `Preguntas`, `Pregunta` | `Faq`, `FaqItem` |
| `CTAFinal` | `FinalCta` |
| `Privacidad` | `PrivacyPolicy` |
| `RegistroOperativo` | `OperationsLog` |
| `DemoAsistente` | `DemoAssistant` |
| `EncabezadoSeccion` | `SectionHeading` |
| `BarraProgreso` | `ScrollProgressBar` |
| `SelectorTema` | `ThemeToggle` |
| `ProveedorMovimiento` | `MotionProvider` |
| `ScrollAlAncla` | `ScrollToAnchor` |
| `Conversacion`, `PanelChat` | `Conversation`, `ChatPanel` |
| `LogoWhatsApp` | `WhatsAppLogo` |

### Hooks, librerías y archivos

| Antes | Ahora |
|---|---|
| `useRevelado` | `useReveal` |
| `useProgresoFases` | `usePhaseProgress` |
| `shared/lib/tema.ts` | `shared/lib/theme.ts` |
| `data/tecnologias.ts` | `data/technologies.ts` |
| `chat/textos.ts` | `chat/copy.ts` |
| `enlaceWhatsApp`, `avisoPestanaNueva` | `whatsappLink`, `newTabNotice` |
| `scripts/verificar-landing.sh` | `scripts/verify-landing.sh` |

### CSS y atributos

| Antes | Ahora |
|---|---|
| `.revelar`, `.linea-mascara`, `.seccion` | `.reveal`, `.line-mask`, `.section` |
| `.accion`, `.accion-primaria` | `.action`, `.action-primary` |
| `.titular`, `.titular-3`, `.oscuro` | `.heading`, `.heading-3`, `.dark-band` |
| `data-tema` | `data-theme` |

Esta tabla recoge los nombres confirmados; ante una duda, `git log --follow <archivo>` da el
historial del renombrado.

## 2026-10-15 — Página de demo, chat rediseñado y botón flotante (demos-personalizadas)

Decisión de diseño: ADR-011 (`docs/adr/ADR-011-demos-personalizadas-con-enlace-legible-limites-y-script.md` en la raíz de AIworks), estado **Proposed**.

- El hash de `/demo` es `#<slug>` (`^[a-z0-9]+(-[a-z0-9]+)*$`, 6 a 48 caracteres; `shared/lib/demoSlug.ts`, con ejemplos
  compartidos con el repo `asistente`); el tenant es `demo-<slug>`. Sin hash se ve la galería de las 4 demos de sector.
  Un hash mal formado o un id desconocido dan «Esta demo ya no está disponible»; el enlace viejo de 12 caracteres ya no
  abre nada a propósito. Solo los slugs `sector-*` viven en este repo público (`features/demo/data/sectorDemos.ts`):
  **nunca** slugs de clientes.
- La API marca los textos fijos de demo con `estado` (`demo_limite_sesion`, `demo_limite_ip`, `demo_presupuesto` →
  límite; `demo_descansando`; `demo_vencida`). `chat/endedReply.ts` decide por `estado` y solo si falta cae a la
  heurística anterior (acción WhatsApp sin código o 429 + regex del texto).
- ⚠ 2026-10-15 — **`#assistant-cta` es el botón del hero**, no el CTA final: el botón flotante y su nube se ocultan
  mientras el hero está en pantalla, y los temporizadores de la nube (4 s; 6 s de auto-ocultado en celular) cuentan desde
  que el botón es visible. El botón nace oculto hasta que el observador reporta (si no, parpadea ~150 ms al cargar).
- ⚠ 2026-10-15 — **`sessionStorage` puede lanzar al leer la propiedad**: todo acceso va en try/catch (`launcherState.ts`).
- ⚠ 2026-10-15 — **macOS no distingue mayúsculas en nombres de archivo**: `LauncherCloud.tsx` y `launcherCloud.ts` chocan
  (TS1149); la lógica pura está en `launcherState.ts`.
- Pruebas sin runner: `cd frontend && npm test` (`node --test` nativo, Node 26; los `.ts` se importan con extensión por
  `allowImportingTsExtensions`; los módulos puros no pueden usar el alias `@/`). Para probar sin backend:
  `node scripts/mock-chat-api.mjs` (slugs de prueba en su cabecera; `*-sinestado-*` prueba el respaldo).
- ⚠ 2026-10-15 — **`verify-landing.sh` puede fallar por azar** («no MX occurrence»): el `buildId` aleatorio de Next puede
  contener «MX». Se arregla reconstruyendo; mejor sería acotar la regla a `addressCountry`/`es_MX`.
- En la demo, el estado de límite/descansando/vencida muestra una sola acción «Agendar»: la barra fija inferior se oculta
  (`shouldShowBookingBar`). El modo oscuro del chat usa los tokens del sitio (`#121110`), no el Noche `#171513` de MARCA.md.
- Medición de peso y capturas sin instalar nada global: suma el gzip de los `<script src>` de `out/index.html` contra un
  build de `git archive master`; Chrome headless por CDP o Playwright en un directorio temporal. El botón costó +1.831
  bytes gzip (límite 2 KB). El e2e completo (Docker + navegador) está en `changes/demos-personalizadas/e2e/` de la raíz.
- 2026-10-15 — El spec pedía ocultar el botón flotante con el CTA final; se implementó con el CTA del hero (`#assistant-cta`). Pendiente de que Paul lo confirme.
- 2026-10-15 — Un 429 sin `estado` conocido (límite genérico por IP) ya no termina la demo: se muestra como error reintentable. Solo los `demo_*` conocidos cierran la conversación (`chat/chatOutcome.ts`).
