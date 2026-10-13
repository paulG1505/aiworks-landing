# Análisis del diseño: panel-conversaciones

Revisión del 2026-10-13 sobre la primera versión del diseño (commit `df11c1b`). Objetivo: que la parte
de la landing (tareas 4.1, 5.1, 5.2, 6.1 y 6.2) se pueda implementar sin adivinar, y que el contrato
con el motor quede cerrado. El motor (`/console/api/*`, autenticación, SQLite) vive en otro repo y no
se construye aquí; aun así se corrigieron en los documentos los puntos del motor que afectan al
frontend o que eran ambiguos.

Se leyó: `proposal.md`, `design.md`, `tasks.md`, `ADR-010.md`, `MARCA.md`, las dos specs, los
`CLAUDE.md` de la raíz y de `frontend/`, `next.config.ts`, `package.json`, `tsconfig.json`,
`app/layout.tsx`, `app/sitemap.ts`, `public/robots.txt`, `app/demo/page.tsx`, `app/globals.css`,
`shared/` (en especial `ui/chat/api.ts`, `ChatLauncher.tsx`, `lib/theme.ts`, `hooks/useMediaQuery.ts`),
`features/demo` y `features/legal`, `scripts/mock-chat-api.mjs`, `scripts/verify-landing.sh` y
`.github/workflows/deploy.yml`.

## 1. Veredicto

La arquitectura de ADR-010 es coherente con el export estático: toda la seguridad está en la API y la
landing solo pinta. La cookie `__Host-consola` con `SameSite=Strict` **sí funciona** entre
`aiworks.lat` y `api.aiworks.lat` (mismo sitio), siempre que el cliente use
`credentials: "include"`. Lo que faltaba era precisión: el contrato no tenía formas JSON ni códigos de
error, faltaban datos que la interfaz necesita (la lista de tenants), había huecos de accesibilidad y
de privacidad en el cliente, y el layout raíz habría metido el encabezado, el pie y el chat de la
landing dentro de la consola.

## 2. Hallazgos

Gravedad: **A** bloquea o rompe algo; **M** obliga a adivinar o deja un riesgo; **B** mejora menor.

### Contrato de la API

| # | Grav. | Hallazgo | Corrección |
|---|---|---|---|
| H1 | A | Las respuestas no tenían forma: ni campos, ni tipos, ni el sobre de error. | design 1.3 y 1.6: formas JSON completas y sobre `{"detail":{"codigo","mensaje","reintentar_en?"}}`, que es lo que FastAPI produce con `HTTPException(detail=dict)`. |
| H2 | A | El filtro «tenant» no tenía de dónde sacar la lista de tenants. | `GET /yo` devuelve `tenants: [{id, nombre}]`. Encaja con el papel de `/yo` («quién soy y qué puedo ver») y con las vistas por tenant futuras. |
| H3 | M | «Cifras por tenant y canal» no decía si la respuesta trae un desglose o se filtra. | `/resumen` acepta `tenant` y `canal` y devuelve totales y `por_dia` ya filtrados. La interfaz no suma nada. |
| H4 | M | «Paginada por cursor» sin semántica; «más recientes primero» ambiguo (¿creación o actividad?). | design 1.5: orden `creada DESC, id DESC` (estable), cursor opaco ligado a los filtros, `null` al final, 422 `cursor_invalido`. |
| H5 | M | No se decía en qué zona horaria se cuentan días y meses. | Instantes en UTC con `Z`; días y meses en `America/Guayaquil`, en el motor y en la interfaz (formato con `timeZone` explícito). |
| H6 | M | La cuenta atrás del bloqueo dependía de `Retry-After`, que un `fetch` entre orígenes **no puede leer** si no se expone (no es cabecera segura de CORS). | `reintentar_en` en el cuerpo y `Access-Control-Expose-Headers: Retry-After`. |
| H7 | M | Sin códigos de error por caso (401 de login frente a 401 de sesión, 403, 404 de consola apagada frente a conversación purgada, 422, 429, 5xx). | Tabla en design 1.6 con qué hace la interfaz en cada uno. |
| H8 | B | `POST /logout` sin sesión, `limite` por defecto, límite de lecturas, `Cache-Control`: sin definir. | Logout idempotente 204; `limite` 30 (máx. 100); 120 lecturas/min por sesión → 429 `demasiadas_peticiones`; `no-store` en todo `/console/*`. |
| H9 | B | El contacto web «identificador corto de sesión» no estaba definido y podía ser el `sesion_id`. | `web · ` + 6 caracteres de un hash, nunca el `sesion_id`. Los ids de conversación son opacos y no contienen el teléfono (van en la URL). |
| H10 | B | El encargo mencionaba `GET /console/api/session`; el diseño dice `GET /yo`. | Se mantiene `/yo` (el contrato manda) como sonda de sesión. |

### Cookie, CORS y CSRF

| # | Grav. | Hallazgo | Corrección |
|---|---|---|---|
| H11 | M | ADR-010 afirmaba que la cookie viaja «por ser del mismo sitio» sin decir la condición del cliente. | design 2.2: mismo sitio = esquema + dominio registrable (`aiworks.lat`, `.lat` es sufijo público); same-site envía cookies `Strict`; no es cookie de terceros. **Condición:** `credentials: "include"` en todas las peticiones, también en el login, o el navegador ni envía la cookie ni guarda el `Set-Cookie`. |
| H12 | B | ¿Es coherente `__Host-` si prohíbe `Domain`? | Sí: la cookie queda solo en `api.aiworks.lat`, que es el único que la lee. La landing no necesita leer nada; sabe de la sesión por `GET /yo`. Sin cambios. |
| H13 | M | Las cabeceras CORS concretas (preflight, `Vary`, `Max-Age`) no estaban escritas. | design 2.3, con la subaplicación para no dar credenciales al resto de la API. |
| H14 | M | `SameSite` no protege de otro **subdominio** del mismo sitio (p. ej. un `www` o un subdominio futuro tomado). | Se mantiene y se explica la verificación de `Origin` exacto + `Content-Type: application/json` (fuerza preflight) en todo `POST`. No hace falta token CSRF. |
| H15 | A | Desarrollo local: `localhost:3000` → `127.0.0.1:8000` son **sitios distintos**, así que la cookie no viajaría y el login parecería roto; `Secure` y `__Host-` no se comportan igual sobre `http://127.0.0.1` en todos los navegadores. | design 2.5: abrir siempre `http://127.0.0.1:3000`; en `http` la cookie es `consola_dev` sin `Secure` ni prefijo, `SameSite=Lax`. El simulado avisa si detecta `localhost` contra `127.0.0.1`. |

### Export estático, ruta y guardia

| # | Grav. | Hallazgo | Corrección |
|---|---|---|---|
| H16 | A | `app/layout.tsx` pinta `Header`, `Footer` y `ChatLauncher` en todas las rutas: la consola habría salido con la navegación de la landing y el botón del chat. | design 4.2: los tres devuelven `null` en `/consola` con `usePathname()`, igual que `ChatLauncher` ya hace en `/demo`. Se descartó partir `app/` en dos layouts raíz (mueve todas las páginas y cambia el 404). |
| H17 | A | «Conserva la ruta al volver del 401» no tenía mecanismo posible sin servidor ni rutas dinámicas. | Una sola ruta `/consola`; filtros y conversación en la búsqueda (`?mes&tenant&canal&listas&c`). El login se pinta en la misma URL, sin redirigir, así que al entrar se vuelve al mismo sitio. `useSearchParams` exige `<Suspense>` en el export estático. |
| H18 | M | No estaba escrita la guardia. | design 4.3: máquina de estados (`checking`, `anonymous`, `expired`, `signedOut`, `disabled`, `unavailable`, `authenticated`); nada se pide ni se pinta antes de `GET /yo` 200; cualquier 401 → `expired` vía `withUnauthorizedHandler`; al salir se desmonta y se abortan peticiones. |
| H19 | M | `noindex`: los `robots` del hijo **reemplazan** los del layout raíz (no se fusionan en profundidad), y el hijo hereda el canónico de la portada y su Open Graph. | design 4.1: `robots` completo con `googleBot`, `alternates.canonical: null`, `openGraph: null`, `twitter: null`. |
| H20 | B | ¿Sitemap y robots? `app/sitemap.ts` es una lista a mano; `public/robots.txt` es estático. | El sitemap no se toca. **No** se añade `Disallow: /consola` en `robots.txt`: impediría leer el `noindex` y anunciaría la ruta. Se comprueba en el build. |
| H21 | M | La convención del repo usa Zustand para estado; un store global (o `localStorage`) dejaría conversaciones en memoria o en disco. | design 4.5: estado local de React, sin store ni almacenamiento. Corte de inactividad en el cliente a los 30 min para que una pestaña olvidada no deje datos a la vista. |
| H22 | B | La base `API_URL` vive en `shared/components/ui/chat/api.ts`: la consola dependería del chat. | Se mueve a `shared/lib/apiUrl.ts`. |

### Interfaz, marca y accesibilidad

| # | Grav. | Hallazgo | Corrección |
|---|---|---|---|
| H23 | M | «Solo tema claro (ADR-005)» contradice la landing actual, que tiene tema oscuro y cuyos componentes deben funcionar en ambos (`frontend/CLAUDE.md`). | La consola usa solo tokens y sigue el tema guardado o del sistema. Contrastes medidos en ambos (design 7). Pregunta abierta P2. |
| H24 | M | La regla de chats por día solo daba información «al pasar el cursor»: inaccesible con teclado y con pantalla táctil. | Grupo enfocable con flechas, `Home`/`End`, y una línea de lectura `aria-live`; sin tooltips. |
| H25 | M | Bordes de campo con `--regla` (1,3:1) no llegan al 3:1 que pide WCAG 1.4.11; el foco visible global (`:where(a, button, [tabindex])`) no cubre `input` ni `select`. | Línea inferior `--tinta-media` (6,6:1) y foco de 2 px `--marca` para `input` y `select`. |
| H26 | M | La fila seleccionada solo se distinguía por fondo Arena (casi igual a Papel). | Además, regla izquierda de 2 px `--marca` y `aria-current`. Las señales dicen su estado en texto, no solo con color. |
| H27 | M | Teclado ambiguo: si `j` ya abre la conversación, ¿qué hace `Enter`? ¿Y en móvil? ¿Y con el foco en un selector? | Tabla en design 6.4 por escritorio y móvil; flechas como alias; se ignora en campos y con modificadores; sin vuelta en los bordes. |
| H28 | M | «Código que se autoenfoca» no decía cuándo; el envío automático no tenía reglas ante error o reenvío. | design 6.5: foco inicial en Usuario; envío automático una vez al llegar a 6 dígitos; en 401 se vacía solo el código; cuenta atrás en 429 anunciada una vez. |
| H29 | M | Los textos de conversaciones vienen de visitantes: riesgo de inyección si se pintan como HTML o se enlazan URL. | Texto plano con `pre-wrap`, sin enlazar; escenario de prueba con `<b>` y una URL. |
| H30 | B | Estados de carga, vacío y error descritos en general, sin textos ni roles. | design 6.6: textos por estado y por tipo de error, `aria-busy`, `role="alert"`, «Quitar filtros», error de «Cargar más» sin perder filas. |
| H31 | B | Teléfono completo por error del motor = fuga en pantalla. | `safeContact` en el cliente: 7 o más dígitos seguidos → «Contacto oculto». |

### Datos (motor)

| # | Grav. | Hallazgo | Corrección |
|---|---|---|---|
| H32 | M | Recalcular `metricas_diarias` solo para hoy y ayer pierde los cambios tardíos (una conversación de hace 5 días que hoy pasa a «lista para llamada»). Recalcular un día parcialmente purgado bajaría las cifras. | design 3: se recalculan todos los días aún completos de cada canal (`hoy − (R − 2)` a hoy); los más viejos quedan congelados. Pregunta P4 para confirmar el criterio de purga. |

### Pruebas y especificación

| # | Grav. | Hallazgo | Corrección |
|---|---|---|---|
| H33 | A | `frontend/package.json` no tiene ninguna herramienta de pruebas, pero las tareas piden «pruebas de componente». | Decisión D8. |
| H34 | M | Escenarios no medibles: «el mismo tiempo de respuesta aproximado», «creada hace 31 días» sin fecha de referencia, «las cuatro cifras» sin valores, y casi nada de la interfaz (guardia, 401 a mitad, móvil, teclado concreto). | Specs reescritas en Given/When/Then con datos y marcadas **[motor]**, **[landing]** o **[build]**. |
| H35 | B | `noindex`, sitemap y ausencia del encabezado solo se ven en el HTML generado. | Bloque nuevo en `scripts/verify-landing.sh`. |

## 3. Decisiones

| # | Decisión | Por qué |
|---|---|---|
| D1 | Contrato cerrado en design 1 (formas, errores, paginación, tiempos), campos en español sin tildes. | El motor y la interfaz se hacen por separado; sin formas exactas cada lado adivina. Sin `ñ` en claves para evitar problemas de codificación y de acceso con punto. |
| D2 | Cookie `__Host-consola` solo de `api.aiworks.lat`, `SameSite=Strict`, `Max-Age=43200`; el cliente siempre con `credentials: "include"` y `cache: "no-store"`. | Es coherente y es lo más estricto que funciona; la landing no necesita la cookie. |
| D3 | CSRF: `SameSite=Strict` + `Origin` exacto + `Content-Type: application/json` en todo `POST`. Sin token. | Cubre otro sitio y otro subdominio; un token no añade nada con una sola acción (`logout`) y el login ya pide TOTP. |
| D4 | Guardia de cliente con `GET /yo` y login en la misma URL. | Única forma con export estático; la URL no lleva datos sensibles. Es experiencia, no seguridad (ADR-010 punto 9). |
| D5 | `Header`, `Footer` y `ChatLauncher` se ocultan en `/consola` con `usePathname()`. | Precedente en el repo, tres líneas, no mueve rutas. |
| D6 | Datos solo en estado local de React; nada en Zustand ni en almacenamiento; corte de inactividad de 30 min en el cliente. | Los datos de conversaciones no deben sobrevivir a la vista. |
| D7 | Tema: solo tokens, sigue el del sitio. | Cumple la regla de `frontend/CLAUDE.md` sin código propio de tema. |
| D8 | Pruebas con **Vitest + jsdom + @testing-library/react + user-event + jest-dom** (y `@vitejs/plugin-react`), sin MSW; `npm test` en el CI antes del build. | Es lo estándar para React 19 sin Jest ni Babel; el cliente acepta `fetchImpl` y los componentes reciben un `ConsoleApi` falso por contexto, así que no hace falta interceptar la red. |
| D9 | Servidor simulado `scripts/mock-console-api.mjs` en el puerto 8000, Node puro, datos falsos con semilla fija y atajos para cada estado. | Mismo patrón que el del chat; un solo `NEXT_PUBLIC_API_URL`. |
| D10 | Orden de la bandeja por fecha de creación. | Paginación estable; además el filtro de mes es por creación. Pregunta P1. |
| D11 | Timeout del cliente de 15 s. | Las lecturas son consultas simples; 15 s deja margen sin dejar la pantalla colgada (el chat usa 20 s porque espera al modelo). |
| D12 | Sin `Disallow` en `robots.txt`; `noindex` en metadatos. | Ver H20. |

## 4. Cambios en los documentos

### `design.md`

Reescrito y ampliado: 0 (qué va en cada repo), 1 (contrato completo), 2 (credenciales, cookie, CORS,
CSRF, desarrollo local), 3 (datos, con la ventana de recálculo), 4 (arquitectura del frontend: ruta y
metadatos, ocultar el encabezado, guardia, estado en la URL, dónde viven los datos, módulos), 5
(cliente tipado: `types.ts`, `client.ts`, `wire.ts`, `format.ts`/`month.ts`), 6 (experiencia con
medidas, teclado, login y estados), 7 (accesibilidad, marca y tabla de contrastes en claro y
oscuro), 8 (herramientas y estrategia de pruebas), 9 (servidor simulado), 10 (operación del motor,
sin cambios de fondo).

### `specs/admin-console/spec.md` y `specs/daily-metrics/spec.md`

Todos los escenarios en Given/When/Then con datos concretos y repo responsable. Nuevos requisitos:
«Guardia de la interfaz» y «CORS con credenciales solo para la consola». Nuevos escenarios: interfaz
con consola apagada, login desde la interfaz, código no numérico, fin del bloqueo, cuenta atrás,
renovación y caducidad absoluta, 401 a mitad de sesión, vuelta tras caducar, corte de inactividad,
API inalcanzable, HTML estático sin encabezado, preflight, borde de día en Guayaquil, paginación
completa y estable, cursor con otros filtros, respuesta tardía, texto que parece HTML, red de
seguridad del contacto, móvil y volver, bordes del teclado, revisión estática de marca, nombres
accesibles, metadatos y enlaces en el build; en `daily-metrics`, cambio tardío y día congelado.

### `tasks.md`

4.1, 5.1, 5.2, 6.1 y 6.2 con archivos a crear, criterios de aceptación contra el simulado y pruebas.
4.1 incluye ahora las herramientas de prueba, el simulado, `apiUrl.ts`, ocultar el encabezado y el
bloque de `verify-landing.sh`. Las tareas del motor (1.1, 2.1, 3.1, 3.2) recogen los ajustes del
contrato.

### `ADR-010.md` (Proposed)

1. Fecha de revisión añadida.
2. Punto 4: nombre y atributos completos de la cookie (`__Host-consola`, `Path=/`, sin `Domain`),
   que solo la fija y lee `api.aiworks.lat`, y que la landing sabe de la sesión por `GET /yo`.
3. Punto 6: por qué la cookie viaja (orígenes distintos, mismo sitio), la condición
   `credentials: "include"`, cabeceras CORS exactas y la verificación de `Origin` y `Content-Type`
   contra CSRF desde otro subdominio.
4. Punto 9 nuevo: la guardia de la interfaz es solo experiencia; `noindex`, fuera del sitemap y sin
   encabezado, pie ni chat de la landing.
5. Consecuencia negativa nueva: cualquier script que corra en `aiworks.lat` puede usar la sesión
   (XSS o script de terceros; GitHub Pages no permite CSP por cabecera), con sus mitigaciones.

No se tocó ningún ADR aceptado. `proposal.md` y `MARCA.md` no cambian.

## 5. Riesgos que quedan

- **XSS en la landing = acceso a la consola** mientras haya sesión abierta (ADR-010). La landing no
  tiene scripts de terceros hoy; añadir uno (analítica, widgets) debe revisarse contra esto.
- **Quien pueda hacer push a `master` puede publicar JS que lea la consola.** El repo es público y el
  despliegue es automático.
- **Un solo factor de posesión**: perder el autenticador obliga a recuperar por SSH (ADR-010).
- **La retención depende de cómo purga el motor** (P4): si purga por última actividad y no por
  creación, la ventana de días completos hay que recalcularla.

## 6. Preguntas abiertas para Paul

- **P1. Orden de la bandeja.** Propuesto: por fecha de creación (la más nueva arriba), que pagina sin
  saltos. ¿Prefieres por última actividad (lo último que se movió arriba)? Exige un cursor más
  complejo y puede repetir filas al paginar.
- **P2. Tema.** La consola sigue el tema del sitio (claro u oscuro según lo que tengas guardado o tu
  sistema). ¿La quieres siempre en claro, como decía el diseño original?
- **P3. Límites.** 30 conversaciones por página, 120 lecturas por minuto por sesión, timeout de 15 s y
  corte por inactividad en el navegador a los 30 min. ¿Te sirven?
- **P4. Purga.** ¿El motor borra conversaciones por fecha de creación o por última actividad? La
  ventana de recálculo de `metricas_diarias` asume creación.
- **P5. Privacidad.** `/privacidad` ya dice que guardamos el chat 30 días «para mejorar las
  respuestas». La consola no guarda datos nuevos de visitantes (solo contadores sin datos personales
  y el registro de tus accesos), así que no obliga a cambiarla; ¿quieres añadir igual que una persona
  de AIworks lee las conversaciones?
- **P6. Señales y turnos.** ¿Cuáles son las cuatro señales y su nombre visible? ¿«Turnos» es el número
  de mensajes del visitante (lo propuesto) o de intercambios?
- **P7. Costo.** Se muestra con 2 decimales (y «< 0,01» si es menor). ¿Lo quieres con más precisión?

## 7. Resumen de implementación

Pendiente: se completará al terminar la fase 2 (implementación de las tareas 4.1, 5.1, 5.2, 6.1 y
6.2), con lo construido, las desviaciones respecto a este diseño y el resultado de la revisión manual
de teclado y contraste.
