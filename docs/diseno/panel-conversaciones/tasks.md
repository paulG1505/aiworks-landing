# Tasks: panel-conversaciones

Cada tarea cierra un entregable que se prueba por separado. Sin commits automáticos: al cerrar cada
grupo se proponen commits semánticos.

## 1. Acceso: login seguro y consola apagada por defecto
- [ ] 1.1 Migración `004_consola.sql` (sesiones y accesos), variables `CONSOLE_*` en `config.py` y
      `.env.example`, `require_admin`, `POST /login`, `POST /logout`, `GET /yo`, bloqueo por intentos,
      verificación de Origin, CORS con credenciales solo en `/console/*` (subaplicación con
      `Expose-Headers: Retry-After`), sobre de error único y `Cache-Control: no-store` (design 1.6 y
      2), y pruebas de cada escenario **[motor]** de la spec `admin-console` (apagada, login, TOTP,
      bloqueo, caducidad, Origin, CORS).
- [ ] 1.2 `scripts/console_setup.py` (hash argon2id y secreto TOTP con su URI), entrada en
      `docs/caminos/` para el alta y la recuperación del autenticador, y regla en el `CLAUDE.md` del
      producto: `recargar` nunca se mueve a la app pública.

## 2. Histórico: contadores diarios que sobreviven a la purga
- [ ] 2.1 Tabla `metricas_diarias`, cálculo idempotente de los días aún completos de cada canal (design
      3) en el bucle de retención antes de purgar, y pruebas de la spec `daily-metrics` (antes de la
      purga, cambio tardío, día congelado, idempotencia, sin datos personales).

## 3. Datos: resumen, lista y detalle de conversaciones
- [ ] 3.1 `GET /resumen` con totales y chats por día, filtrables por `tenant` y `canal`, usando `uso` y
      `metricas_diarias`, con pruebas del mes con datos, borde de día en Guayaquil, mes inválido y
      mes ya purgado.
- [ ] 3.2 `GET /conversaciones` y `GET /conversaciones/{id}`: paginación por cursor, filtros de
      canal, tenant y listos, cursor opaco ligado a los filtros (design 1.5), enmascarado de
      teléfonos, 404 de purgadas, registro de lecturas y pruebas de paginación, enmascarado y solo
      lectura (405).

## 4. Interfaz: acceso y esqueleto de la consola

> Grupos 4 a 6: solo en este repo (`frontend/` y `scripts/`). Especificación completa en `design.md`
> secciones 4 a 9. Identificadores y nombres de archivo en inglés; texto visible en español y
> centralizado en `features/consola/copy.ts`. Cada tarea termina con `npm run lint`, `npm test` y
> `npm run build` en verde, y `scripts/verify-landing.sh` sin fallos.

- [x] 4.1 Ruta, cliente, guardia, login, servidor simulado y herramientas de prueba.
  - **Crear:**
    - `frontend/vitest.config.mts`, `frontend/vitest.setup.ts` y los scripts `test` / `test:watch`
      (design 8.1); paso `npm test` en `.github/workflows/deploy.yml` antes de «Build».
    - `frontend/shared/lib/apiUrl.ts` (mover `API_URL`; `chat/api.ts` lo importa de ahí sin cambiar
      su comportamiento).
    - `CONSOLE_PATH` en `frontend/shared/constants/site.ts`; `Header`, `Footer` y `ChatLauncher`
      devuelven `null` en `/consola` (design 4.2).
    - `frontend/app/consola/page.tsx` (design 4.1, tal cual).
    - En `frontend/features/consola/`: `index.ts`, `types.ts`, `copy.ts`, `api/client.ts`,
      `api/wire.ts`, `api/ConsoleApiContext.tsx`, `lib/format.ts`, `lib/month.ts`,
      `hooks/useConsoleSession.ts`, `hooks/useConsoleParams.ts`, `components/ConsoleApp.tsx`,
      `components/ConsoleBootFallback.tsx`, `components/LoginForm.tsx`,
      `components/ConsoleHeader.tsx`, `components/ConsoleScreen.tsx` (por ahora con las tres zonas
      vacías), `testing/fixtures.ts`, `testing/fakeApi.ts`.
    - `scripts/mock-console-api.mjs` (design 9) y el apartado «Consola» en el `CLAUDE.md` raíz.
    - Bloque «Requirement: hidden console» en `scripts/verify-landing.sh` (escenarios **[build]** de
      la spec: `noindex`, sin canónico ni `og:title`, fuera del sitemap, sin enlaces, sin encabezado,
      pie ni chat en `consola.html`).
    - Estilos `console-field` (línea inferior `--tinta-media`) y foco visible de `input` y `select`
      en `globals.css` (design 6.5).
  - **Aceptación:**
    - Con `node scripts/mock-console-api.mjs` y `npm run dev`, en `http://127.0.0.1:3000/consola`: se
      entra con `demo` / `consola-demo` / `123456` sin pulsar «Entrar»; con otro código sale el aviso
      único; con usuario `bloqueado` sale la cuenta atrás; «Salir» vuelve al login y limpia la URL;
      con `MOCK_IDLE_SECONDS=60` la siguiente acción tras un minuto vuelve al login conservando la
      URL; con `MOCK_DISABLED=1` se ve «La consola no está activa.».
    - En `/`, `/privacidad` y `/demo` nada cambia (encabezado, pie y chat siguen).
    - `out/consola.html` existe y pasa el bloque nuevo de `verify-landing.sh`.
  - **Pruebas:** `api/client.test.ts` (los 9 puntos de design 5.2, uno por prueba),
    `lib/format.test.ts` y `lib/month.test.ts` (incluido el borde de día en Guayaquil y
    `safeContact`), `hooks/useConsoleSession.test.tsx` y `components/LoginForm.test.tsx` (todos los
    escenarios **[landing]** de «Consola apagada», «Login», «Bloqueo», «Caducidad de la sesión» y
    «Guardia de la interfaz»), `hooks/useConsoleParams.test.tsx` (lectura, valores inválidos
    ignorados, `replace` sin valores por defecto).

## 5. Interfaz: resumen y bandeja

- [ ] 5.1 Franja de cifras, selector de mes y regla de chats por día (design 6.2 puntos 1 y 2).
  - **Crear:** `components/MonthSummary.tsx`, `components/DailyChart.tsx`,
    `components/ZoneStatus.tsx`; montarlos en `ConsoleScreen`.
  - **Aceptación:** con el simulado, el mes actual muestra cifras y marcas; el mes anterior muestra
    cifras; hace dos meses muestra el error con «Reintentar»; hace tres meses muestra el timeout a los
    15 s; con `tenant=demo-limite` muestra la espera de 30 s; las cifras cambian al filtrar por
    tenant o canal. Sin tooltips ni cuadros flotantes.
  - **Pruebas:** `MonthSummary.test.tsx` y `DailyChart.test.tsx` con los escenarios **[landing]** de
    «Resumen mensual» (cifras, cambio de mes, regla, estados).

- [ ] 5.2 Bandeja con filtros, selección, «Cargar más» y teclado (design 6.2 punto 3 y 6.4).
  - **Crear:** `components/InboxFilters.tsx`, `components/Inbox.tsx`, `components/InboxRow.tsx`,
    `hooks/useInboxKeyboard.ts`; montarlos en `ConsoleScreen`.
  - **Aceptación:** con el simulado, 50 filas del mes (45 + las 5 especiales) en tres cargas (20 + 20 + 10); filtros
    reflejados en la URL; `demo-taller` da el vacío con «Quitar filtros»; el mes anterior da lista
    vacía; la fila `c_numero` muestra «Contacto oculto»; la fila seleccionada tiene Arena, regla de
    petróleo y `aria-current`; `j`/`k`/flechas no actúan dentro de los selectores.
  - **Pruebas:** `Inbox.test.tsx` con los escenarios **[landing]** de «Lista de conversaciones»,
    «Teléfonos enmascarados» y «Navegación por teclado».

## 6. Interfaz: lector de conversación y diseño adaptable

- [ ] 6.1 Lector y reparto escritorio/móvil (design 6.2 punto 4, 6.3 y 6.4).
  - **Crear:** `components/ConversationReader.tsx`, `components/SignalList.tsx`,
    `hooks/useIsDesktop.ts`, la clase `console-fade` en `globals.css`; el reparto en
    `ConsoleScreen`.
  - **Aceptación:** con el simulado, en 1280 px se ven las tres zonas; en 390 px el lector ocupa la
    pantalla y «Volver» / `Esc` devuelven el foco a la fila; la conversación de 40 mensajes desplaza
    solo el lector; el mensaje largo respeta saltos de línea y su URL no es un enlace; `c_purgada`
    muestra «Esta conversación ya no existe…»; `c_caduca` lleva al login y, al entrar de nuevo,
    vuelve a `c_caduca`; con `prefers-reduced-motion: reduce` no hay desvanecido.
  - **Pruebas:** `ConversationReader.test.tsx` y una prueba de `ConsoleScreen` con los escenarios
    **[landing]** de «Detalle de una conversación» e «Interfaz de la consola» (escritorio, móvil y
    volver), más «401 a mitad de sesión» y «Vuelta tras caducar» de punta a punta con `fakeApi`.

- [ ] 6.2 Revisión de marca y accesibilidad (design 7).
  - **Crear:** `features/consola/brand.test.ts` (escenario «Revisión estática») y una prueba de
    «Nombres accesibles» sobre la consola montada con datos.
  - **Aceptación:** las pruebas pasan; revisión manual con teclado solo (login → bandeja → lector →
    resumen → «Salir») sin trampas de foco y con el contorno de 2 px visible en cada paso; los pares
    de color usados están en la tabla de contraste de design 7 (si se usa otro par, se calcula y se
    añade a la tabla); comprobado en tema claro y oscuro. El resultado de la revisión manual se anota
    en «Resumen de implementación» de `analisis.md`.

## 7. Salida a producción
- [ ] 7.1 Ruta `/console/*` en el `Caddyfile` (con `/admin/*` aún en 404), variables en el `.env` del
      servidor, `deploy.sh` y prueba de humo del login, con una entrada fechada en `docs/caminos/`.
