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
