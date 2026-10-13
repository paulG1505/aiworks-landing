# Tasks: panel-conversaciones

Cada tarea cierra un entregable que se prueba por separado. Sin commits automáticos: al cerrar cada
grupo se proponen commits semánticos.

## 1. Acceso: login seguro y consola apagada por defecto
- [ ] 1.1 Migración `004_consola.sql` (sesiones y accesos), variables `CONSOLE_*` en `config.py` y
      `.env.example`, `require_admin`, `POST /login`, `POST /logout`, `GET /yo`, bloqueo por intentos,
      verificación de Origin, CORS con credenciales solo en `/console/*`, y pruebas de cada escenario
      de la spec `admin-console` (apagada, login, TOTP, bloqueo, caducidad, Origin).
- [ ] 1.2 `scripts/console_setup.py` (hash argon2id y secreto TOTP con su URI), entrada en
      `docs/caminos/` para el alta y la recuperación del autenticador, y regla en el `CLAUDE.md` del
      producto: `recargar` nunca se mueve a la app pública.

## 2. Histórico: contadores diarios que sobreviven a la purga
- [ ] 2.1 Tabla `metricas_diarias`, cálculo idempotente de hoy y ayer en el bucle de retención antes de
      purgar, y pruebas de la spec `daily-metrics` (antes de la purga, idempotencia, sin datos
      personales).

## 3. Datos: resumen, lista y detalle de conversaciones
- [ ] 3.1 `GET /resumen` con cifras por tenant y canal y chats por día, usando `uso` y
      `metricas_diarias`, con pruebas del mes con datos, mes inválido y mes ya purgado.
- [ ] 3.2 `GET /conversaciones` y `GET /conversaciones/{id}`: paginación por cursor, filtros de
      canal, tenant y listos, enmascarado de teléfonos, 404 de purgadas, registro de lecturas y
      pruebas de enmascarado y de solo lectura (405).

## 4. Interfaz: acceso y esqueleto de la consola
- [ ] 4.1 Ruta `/consola` en la landing con `noindex` fuera del sitemap, pantalla de login (usuario,
      clave y código que se autoenfoca), cliente de API con credenciales, guardia de sesión que
      conserva la ruta al volver del 401, y pruebas de componente.

## 5. Interfaz: resumen y bandeja
- [ ] 5.1 Franja de cifras en Geist Mono con selector de mes y regla de chats por día, más los
      estados de carga, vacío y error de esa zona, con pruebas de componente.
- [ ] 5.2 Bandeja con filas separadas por reglas, filtros (tenant, canal, solo listos), selección con
      Arena, navegación `j`/`k`/`Enter`, y sus estados, con pruebas de teclado y de filtros.

## 6. Interfaz: lector de conversación y diseño adaptable
- [ ] 6.1 Lector tipográfico con etiquetas mono, regla de petróleo en turnos del asistente, señales al
      pie, desvanecido de 120 ms con `prefers-reduced-motion`, y vista móvil a una columna con botón
      «Volver», con pruebas del escenario de escritorio y de móvil.
- [ ] 6.2 Revisión de marca y accesibilidad: sin `box-shadow` ni degradados, colores solo de la paleta,
      contrastes y foco visible comprobados, y `lang="es"`.

## 7. Salida a producción
- [ ] 7.1 Ruta `/console/*` en el `Caddyfile` (con `/admin/*` aún en 404), variables en el `.env` del
      servidor, `deploy.sh` y prueba de humo del login, con una entrada fechada en `docs/caminos/`.
