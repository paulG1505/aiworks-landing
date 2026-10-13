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

Fase 2 (frontend, tareas 4.1, 5.1, 5.2, 6.1 y 6.2), implementada el 2026-10-13 en la rama
`docs/panel-conversaciones-diseno`. Resultado final en `frontend/`: `npm run lint` sin avisos,
`npm test` 12 archivos y 110 pruebas en verde, `npm run build` correcto (genera `out/consola.html` y
`out/consola/`), y `scripts/verify-landing.sh` con 41 comprobaciones y 0 fallos.

### Qué se hizo, por tarea

| Tarea | Commits | Contenido |
|---|---|---|
| 4.1 | `00a2f3f` herramientas de prueba y paso `npm test` en el CI · `d90cf1d` `API_URL` a `shared/lib/apiUrl.ts` · `48f76f9` `CONSOLE_PATH`, ocultar encabezado, pie y chat, estilos `console-field` y foco de `input`/`select` · `c146c05` cliente tipado, `wire.ts`, `format.ts`, `month.ts` y sus pruebas · `8ed51ad` guardia de sesión, login, ruta `/consola` y pruebas · `7a66c0f` servidor simulado y apartado «Consola» del `CLAUDE.md` · `9201198` bloque «hidden console» de `verify-landing.sh` | Ruta noindex, cliente con los 9 puntos de design 5.2 (una prueba por punto), máquina de estados de 4.3 con corte de inactividad, login con envío automático y cuenta atrás, URL como estado (`useConsoleParams`). |
| 5.1 | `a1f89a4` `ZoneStatus` y `useApiResource` · `79d2726` `MonthSummary`, `DailyChart` y pruebas | Franja de cifras, selector de mes, regla de chats por día con flechas, `Home`/`End` y línea `aria-live`; estados de carga, vacío, error y 429 con espera. |
| 5.2 | `4d25f18` bandeja, filtros y fila · `b04852f` teclado · `1c983fd` pruebas | Filtros en la URL, «Cargar más» (con error bajo la lista y recarga única ante `cursor_invalido`), vacío con «Quitar filtros», respuesta tardía descartada, `j`/`k`/flechas, `g` `r`. |
| 6.1 | `aeab50c` lector y lista de señales · `acf807a` reparto escritorio/móvil y manejo del foco · `d550684` pruebas | Lector con texto plano `pre-wrap`, desvanecido de 120 ms bajo `no-preference`, «Volver»/`Esc` con foco a la fila, 401 a mitad de sesión y vuelta tras caducar de punta a punta. |
| 6.2 | `bf414a3` JSON-LD por página · `cdb7880` revisión de marca, contraste y nombres accesibles | `brand.test.ts` (escenario «Revisión estática», animación única, clases `console-*`, contraste calculado de los pares de design 7 en ambos temas) y prueba de nombres accesibles con `toHaveAccessibleName`. |

Pruebas: cada escenario **[landing]** de `specs/admin-console/spec.md` tiene una prueba con su nombre
(salvo la deriva indicada abajo). Herramientas: Vitest 3 + jsdom + Testing Library + user-event +
jest-dom + `@vitejs/plugin-react`; `next/navigation` se simula con una versión apoyada en
`window.history` (`frontend/vitest.navigation.ts`) y `matchMedia` con `setViewport()`
(`frontend/vitest.viewport.ts`).

### Cómo probarlo en local

```bash
node scripts/mock-console-api.mjs         # http://127.0.0.1:8000/console/api
cd frontend && npm run dev                # en otra terminal
# abrir http://127.0.0.1:3000/consola (no localhost) y entrar con demo / consola-demo / 123456
```

Atajos del simulado (también en el encabezado del script y en el `CLAUDE.md` raíz): usuario
`bloqueado` (429 al instante), 5 fallos (429 durante 60 s), `MOCK_IDLE_SECONDS=60`, `MOCK_DISABLED=1`,
`MOCK_EMPTY=1`, meses `-1` (cifras, lista vacía), `-2` (500), `-3` (20 s), `tenant=demo-limite` (429),
`c_caduca`, `c_falla`, `c_lenta`, `c_purgada`, `c_numero`. Con `npm test` se corren las pruebas y con
`bash scripts/verify-landing.sh` (tras `npm run build`) las del build.

### Revisión manual (tarea 6.2)

Hecha con Chromium controlado por Playwright contra el simulado y `npm run dev`, solo con teclado
(no es una prueba con lector de pantalla ni con una persona):

- Flujo login → bandeja → lector → resumen → «Salir»: el foco inicial cae en «Usuario», el código
  envía solo al sexto dígito, `j` abre la siguiente fila, `Enter` lleva el foco al título del lector,
  `Esc` lo devuelve a la fila, `g` `r` va a «Resumen de octubre 2026» y «Salir» deja «Sesión cerrada.»
  con la URL limpia. El orden de tabulación recorre cabecera, mes, regla, filtros, lista, «Cargar más»
  y lector, y termina en el cuerpo de la página: sin trampas de foco.
- Contorno de foco de 2 px sólido en cada parada: `rgb(11, 101, 113)` en claro y `rgb(92, 195, 204)`
  en oscuro.
- Capturas en claro y oscuro (1280 px) y en 390 px: sin desbordamiento horizontal, marca respetada
  (sin cajas, sombras ni degradados), «Volver» y `Esc` devuelven el foco a la fila.
- Contraste calculado desde `globals.css` (también lo comprueba `brand.test.ts`), claro / oscuro:
  tinta/papel 16,2 / 15,6; tinta/arena 14,8 / 14,5; tinta media/papel 6,5 / 7,4; tinta media/arena
  6,0 / 6,9; petróleo/papel 6,2 / 9,1; petróleo/arena 5,7 / 8,5; sobre-botón/botón 6,7 / 8,5. Todos
  cumplen el mínimo; solo difieren en una décima de la tabla de design 7 (14,9 y 6,6 allí), que
  conviene corregir.
- Con el simulado: 50 filas del mes en tres cargas (20 + 20 + 10), cifras del mes anterior con lista
  vacía, hace dos meses error con «Reintentar», hace tres meses timeout a los 16 s (15 s + latencia),
  `demo-limite` con espera de 30 s, `demo-taller` con «Quitar filtros», `c_caduca` lleva al login y
  vuelve a la misma conversación, `c_purgada` muestra el aviso, `c_numero` muestra «Contacto oculto».
- No se comprobó `prefers-reduced-motion: reduce` en pantalla; solo de forma estática (la única
  animación vive bajo `no-preference`).

### Desviaciones del diseño y por qué

1. **URL al seleccionar y caducidad (spec «401 a mitad de sesión» y «Vuelta tras caducar»).** El
   spec dice que tras el 401 de `c2` la URL sigue en `…&c=c1` y que al volver se pide `c1`. Eso
   contradice design 4.3/4.4/6.4 (la URL se escribe al seleccionar) y el criterio de 6.1 con el
   simulado (`c_caduca` «al entrar de nuevo, vuelve a `c_caduca`»). Se implementó lo segundo: la URL
   conserva `c2` y al volver se pide `c2`. Las pruebas llevan esos valores. Conviene corregir el
   spec.
2. **JSON-LD movido del layout a cada página.** `out/consola.html` contenía `contacto@aiworks.lat`
   dentro de los datos del `StructuredData` del layout, lo que incumple el escenario [build] «HTML
   estático sin datos ni sitio». Un componente de cliente que se oculte no sirve (el JSON-LD dejaba de
   salir en el HTML). Se renderiza ahora en `/`, `/privacidad` y `/demo` (misma salida que antes) y no
   en `/consola`; efecto lateral: `404.html` ya no lleva el JSON-LD de la organización.
3. **`j`/`k` en móvil solo mueven el foco.** design 6.4 dice «mueve el foco y la selección»; abrir el
   lector ocultaría la lista, así que se eligió la opción conservadora. En escritorio sí abren.
4. **«Volver» en móvil vuelve a pedir la primera página de la bandeja** (la lista se desmonta, como
   exige el spec): se pierde lo acumulado con «Cargar más». El foco vuelve a la fila si está en esa
   primera página.
5. **Cuenta atrás del login:** el texto visible se actualiza cada segundo sin ser región viva y un
   `role="alert"` solo para lectores («Demasiados intentos. Espere antes de intentar de nuevo.»)
   anuncia el bloqueo una vez, para que no se lea cada segundo.
6. **Dependencias de prueba:** `vite` queda fijado en `^7` y `@vitejs/plugin-react` en `^5` porque
   Vitest 3 usa Vite 7 y mezclar versiones rompía la comprobación de tipos de `next build`. Instalar
   subió de versión algunos paquetes de Babel en `package-lock.json` (solo desarrollo). `jsdom` 29
   exige Node 20.19 o superior: el CI usa `node-version: "20"`, que hoy resuelve a una 20.x válida.
7. **Piezas añadidas no listadas:** `hooks/useApiResource.ts` (carga con aborto y descarte de
   respuestas tardías), `testing/render.tsx`, `vitest.navigation.ts`, `vitest.viewport.ts` y un
   estado `message` en `ZoneStatus`.
8. **Textos:** `Intl` en `es-EC` abrevia septiembre como «sept» (design decía «sep»); el lector
   muestra «Conversación» como título mientras carga, para que el foco no se pierda al llegar los
   datos. El simulado pagina de 20 en 20 (design 9) y el motor usa 30 por defecto (design 1.4).
9. **Historial de commits:** `4d25f18` importa `useInboxKeyboard`, que llega en el commit siguiente
   (`b04852f`); el árbol compila desde `b04852f`.

### Qué depende del repo del motor (no está construido aquí)

- Todas las rutas de `design.md` sección 1: `POST /login`, `POST /logout`, `GET /yo`, `/resumen`,
  `/conversaciones` y `/conversaciones/{id}`, con las formas JSON exactas, el sobre de error
  `{detail:{codigo, mensaje, reintentar_en?}}`, 422 para parámetros inválidos y 405 para otros
  métodos. El cliente trata como `bad_response` cualquier campo obligatorio ausente o de otro tipo
  (por ejemplo `senales_alcanzadas > senales_total`) y ignora los campos extra.
- Cookie `__Host-consola` (`HttpOnly; Secure; SameSite=Strict; Path=/`, sin `Domain`) y, en local,
  `CONSOLE_INSECURE_DEV_COOKIE=1`; el cliente manda `credentials: "include"` y `cache: "no-store"` en
  todo, y la landing debe abrirse en `http://127.0.0.1:3000` en desarrollo.
- CORS solo en `/console/*`: origen exacto `CONSOLE_ALLOWED_ORIGIN` (`https://aiworks.lat`),
  `Allow-Credentials: true`, `Expose-Headers: Retry-After`, `Vary: Origin` y preflight con
  `Content-Type`; `POST` con `Content-Type: application/json` y `Origin` exacto (403 si no).
- 404 en todo con la consola apagada (la interfaz lo muestra como «La consola no está activa.»),
  `Cache-Control: no-store`, 429 `bloqueado` con `reintentar_en` y `Retry-After`, 429
  `demasiadas_peticiones`, cursor opaco ligado a los filtros con 422 `cursor_invalido`, orden
  `creada DESC, id DESC`.
- `Sesion.tenants` completo y ordenado por nombre; `contacto` ya enmascarado (el cliente solo es red de
  seguridad); `senales` con nombre visible y `senales_total` constante (pregunta P6 abierta);
  `turnos` = mensajes del visitante; `idioma` `es`/`en`/`null`.
- `metricas_diarias` y la ventana de recálculo antes de la purga (tareas 2.1, pregunta P4) para que
  `/resumen` siga dando cifras de meses con la lista ya purgada; `uso` para respuestas y costo.
- Caddy (`/console/*`, con `/admin/*` en 404), variables `CONSOLE_*` del `.env` y despliegue (7.1).

### Qué falta

- Tareas del motor 1.1 a 3.2 y 7.1; sin ellas no se puede probar contra la API real. Cuando exista,
  repetir la revisión manual con cookies reales (`Secure`/`SameSite=Strict` entre `aiworks.lat` y
  `api.aiworks.lat`) y en Safari y Firefox.
- Prueba con un lector de pantalla y con una persona; revisión de `prefers-reduced-motion: reduce` en
  pantalla.
- Preguntas abiertas P1 a P7 sin respuesta (orden, tema, límites, purga, `/privacidad`, señales,
  costo). La consola no guarda datos nuevos del visitante, así que no se tocó `/privacidad`.
- Corregir el spec y la tabla de contraste según las desviaciones 1 y de la revisión.
