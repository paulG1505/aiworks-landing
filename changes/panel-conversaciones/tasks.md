# Tasks: panel-conversaciones

> Reescrito el 2026-10-28 para que lo implemente Katty con `/pg-implement` (Decisión #34). El diseño es
> `design.md`, empezando por su **§ 0. Puesta al día**; las reglas exactas están en `specs/`. Lo marcado
> **(Paul)** no lo haces tú.

## Cómo se trabaja

- **Dos repos y dos ramas con el mismo nombre, `feat/panel-conversaciones`:** el grupo A va en `asistente` (lo
  de atrás, Python) y el grupo B en `landing` (la pantalla, Next.js). Primero el A completo y después el B.
- **Cuatro PR, uno por bloque:** A1–A6 (acceso), A7–A9 (datos), B1–B2 (entrada a la consola) y B3–B6
  (pantalla). Cada PR lleva el resumen de `/pg-review` y lo mergea solo Paul.
- **Un commit por tarea**, `tipo(alcance): resumen` (por ejemplo `feat(console): add login`). `/pg-implement`
  te lo propone y esperas el visto bueno de Paul.
- **Código en inglés** (nombres, comentarios, nombres de pruebas). **Lo que se ve en pantalla y los nombres de
  campos de la API van en español** (`usuario`, `clave`, `codigo`, `conversaciones`), como en el resto del
  motor. Comentarios solo para un «por qué» que no se ve en el código.
- **Primero la prueba, después el código.** En cada tarea escribe la prueba, mírala fallar, escribe el código
  y mírala pasar.
- **Solo datos inventados.** Trabajas con la base local y conversaciones de prueba. Nunca te conectas al VPS ni
  usas una conversación real, ni para probar.
- **No toques** `app/admin/`, `app/channels/` (salvo la línea de la tarea A2), `tenants/`, `scripts/deploy.sh`,
  `Caddyfile` ni `docker-compose*.yml`. Si crees que hace falta, anótalo y pregúntale a Paul.

**Antes de empezar, en `asistente`:**
```bash
git fetch && git switch feat/panel-conversaciones
.venv/bin/python -m pytest -q        # anota cuántas pasan: todas deben pasar
.venv/bin/ruff check .               # sin errores
```
Si algo ya falla antes de tocar nada, para y avísale a Paul.

---

## Grupo A · `asistente` (lo de atrás)

### A1. Tablas nuevas: migración `008_consola.sql`
- **Archivos:** `app/db/migrations/008_consola.sql` (nuevo) y `tests/test_db_migrations.py`.
- **Qué hacer:** las tres tablas del design § 3 (`consola_sesiones`, `consola_accesos` y `metricas_diarias`),
  copiadas tal cual. Agrega una prueba que migre una base vacía y compruebe que las tres tablas existen y que
  `metricas_diarias` no tiene columnas de teléfono, texto ni sesión.
- **Ojo:** la 007 todavía no está en `main` (design § 0). No la crees ni la renumeres: el orden lo resuelve
  Paul al mergear.
- **Prueba:** `.venv/bin/python -m pytest tests/test_db_migrations.py -q`.
- **Terminado cuando:** la prueba nueva pasa y el resto sigue en verde.

### A2. Hora de cada mensaje
- **Archivos:** `app/db/conversations.py` (línea 37, `history.append`), `app/channels/whatsapp/conversation.py`
  (línea 112, solo esa línea) y `tests/test_conversations.py`.
- **Qué hacer:** que cada mensaje nuevo guarde `"ts"` con la hora en UTC (ISO 8601), además de `role` y
  `content`. El mensaje de una persona conserva su `"by": "human"`.
- **Cuidado:** `app/core/model.py:109` arma lo que se le manda a Claude solo con `role` y `content`. Así debe
  seguir: escribe una prueba que lo confirme (el `ts` no se le manda al modelo).
- **Prueba:** `.venv/bin/python -m pytest tests/test_conversations.py tests/test_core.py -q`.
- **Terminado cuando:** los mensajes nuevos traen `ts`, el modelo sigue recibiendo solo `role` y `content` y
  todas las pruebas pasan.

### A3. Configuración y dependencias
- **Archivos:** `app/config.py`, `.env.example`, `requirements.txt` y `tests/test_startup.py`.
- **Qué hacer:**
  - En `config.py`, cuatro variables con los alias `CONSOLE_USER`, `CONSOLE_PASSWORD_HASH`,
    `CONSOLE_TOTP_SECRET` y `CONSOLE_ORIGIN` (este con valor por defecto `https://aiworks.lat`). Las tres
    primeras quedan vacías por defecto.
  - En `.env.example`, las cuatro con valor vacío y un comentario que diga que las genera
    `scripts/console_setup.py`. **Nunca pongas un valor real.**
  - En `requirements.txt`, `argon2-cffi` y `pyotp` con versión fija (mira cómo están las demás líneas).
- **Prueba:** `.venv/bin/pip install -r requirements.txt` y luego `.venv/bin/python -m pytest -q`.
- **Terminado cuando:** las pruebas pasan, en `git diff` no hay ningún valor secreto y
  `python -c "import argon2, pyotp"` no da error.

### A4. Script de preparación `scripts/console_setup.py`
- **Archivos:** `scripts/console_setup.py` (nuevo) y `tests/test_console_setup.py` (nuevo).
- **Qué hacer:** el script pide la clave con `getpass` (sin mostrarla), imprime el hash argon2id y genera un
  secreto TOTP con su URI `otpauth://` (emisor `AIworks`, cuenta = el usuario) para escanearlo con el
  autenticador. No escribe archivos ni guarda la clave en ningún lado.
- **Prueba:** una prueba que llame a las funciones del script (no a `getpass`) y compruebe que el hash verifica
  la clave y que la URI contiene el secreto. `.venv/bin/python -m pytest tests/test_console_setup.py -q`.
- **Terminado cuando:** la prueba pasa. **(Paul)** corre el script de verdad: tú nunca.

### A5. El corazón del login: `app/console/auth.py`
Es la tarea más delicada: **Paul la revisa línea por línea.** Cada escenario de la spec lleva su prueba.
- **Archivos:** `app/console/__init__.py`, `app/console/auth.py` y `tests/test_console_auth.py` (nuevos).
- **Qué hacer (design § 2):**
  1. `verify_password`: argon2id. Si el usuario no existe, se verifica igual contra un hash falso, para que el
     tiempo de respuesta no delate si el usuario existe.
  2. `verify_totp`: 6 dígitos, paso de 30 s, ventana de ±1 paso, y **un código ya usado se rechaza**. Guarda en
     memoria el último paso aceptado.
  3. Sesiones: token de 32 bytes con `secrets.token_urlsafe`. En la base solo se guarda su SHA-256. Caducan a
     las 12 h absolutas y a los 30 min sin actividad; si una sesión está vencida, se borra al detectarlo.
  4. Bloqueo: 5 fallos por IP en 15 min dan 429 con el tiempo restante, y hay además un tope global de 20
     fallos por hora. La IP se guarda como hash, nunca en claro.
  5. Registro en `consola_accesos`: `login_ok`, `login_fallido`, `bloqueado` y `lectura`, con la hora y el
     hash de la IP. Nunca texto de conversaciones.
- **Pruebas mínimas (una por escenario):** clave correcta e incorrecta; usuario inexistente; código
  correcto, vencido y reutilizado; sesión vigente, vencida por 12 h y vencida por 30 min de inactividad
  (usa una hora simulada, no `sleep`); 5 fallos y luego un acierto da 429; el token en claro no aparece en
  la base.
- **Prueba:** `.venv/bin/python -m pytest tests/test_console_auth.py -q`.
- **Terminado cuando:** todos los escenarios tienen su prueba y pasan, y `ruff` sale limpio.

### A6. Las rutas de acceso: `app/console/router.py`
- **Archivos:** `app/console/router.py` (nuevo), `app/main.py` (montar el router) y
  `tests/test_console_router.py` (nuevo).
- **Qué hacer (design § 1 y § 2):**
  - `POST /console/api/login`, `POST /console/api/logout` y `GET /console/api/yo`.
  - Una dependencia `require_admin` que valide la sesión contra la base **antes** de leer cualquier dato.
  - La cookie `__Host-consola` con `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/` y sin `Domain`.
  - Los `POST` exigen `Content-Type: application/json` y un `Origin` igual a `CONSOLE_ORIGIN`; si no, 403.
  - CORS con credenciales **solo** en `/console/*` y solo para `CONSOLE_ORIGIN`. `ProfileCors` no se toca.
  - Si faltan `CONSOLE_USER` o `CONSOLE_PASSWORD_HASH`, **todas** las rutas de la consola responden 404.
  - La respuesta de un login fallido es la misma si falla el usuario, la clave o el código.
- **Pruebas mínimas:** consola apagada (404); login correcto (200 y cookie con sus atributos); logout desde
  otro origen (403, la sesión sigue); sin cookie (401); `DELETE /console/api/conversaciones/1` (405); el
  `/chat/*` de siempre sigue funcionando igual. Usa el `TestClient` como en `tests/test_web_chat.py`.
- **Prueba:** `.venv/bin/python -m pytest -q` y `.venv/bin/ruff check . --fix`.
- **Terminado cuando:** todo pasa. **Cierre del bloque A1–A6:** `/pg-review`, corrige blocker y major y abre
  el PR con `/pg-pr`. En la descripción pon la lista de escenarios de seguridad con el nombre de su prueba.

### A7. Contadores diarios antes de la purga
- **Archivos:** `app/usage/retention.py` y `tests/test_retention.py`.
- **Qué hacer:** al inicio de `cleanup`, **antes del primer `DELETE`**, recalcular en `metricas_diarias` hoy y
  ayer por tenant y canal: conversaciones creadas y cuántas cumplen `is_call_ready` (impórtala de
  `app.admin.router`; no la copies). Usa `INSERT ... ON CONFLICT DO UPDATE`, para que correrlo dos veces no
  duplique nada.
- **Pruebas (spec `daily-metrics`):** una conversación de hace 31 días tiene su contador guardado antes de
  borrarse; doble ejecución; la tabla solo tiene día, tenant, canal y números.
- **Prueba:** `.venv/bin/python -m pytest tests/test_retention.py -q`.
- **Terminado cuando:** las pruebas nuevas y las de siempre pasan.

### A8. Resumen del mes: `GET /console/api/resumen?mes=AAAA-MM`
- **Archivos:** `app/console/queries.py` (nuevo), `app/console/router.py` y `tests/test_console_data.py` (nuevo).
- **Qué hacer:** chats, respuestas, costo en USD y listos para llamada por tenant y canal, más los chats por
  día. Respuestas y costo salen de `uso`. Chats y listos salen de `conversaciones` y, para los días ya
  purgados, de `metricas_diarias`. Mira cómo lo calcula `/admin/metricas` en `app/admin/router.py`, pero
  escríbelo en `queries.py` sin cambiar el admin.
- **Pruebas:** mes con datos; mes inválido (422); mes ya purgado (las cifras salen de `metricas_diarias`).
- **Terminado cuando:** las 3 pruebas pasan.

### A9. Lista y detalle de conversaciones
- **Archivos:** `app/console/queries.py`, `app/console/router.py` y `tests/test_console_data.py`.
- **Qué hacer (design § 1 y § 0):**
  - `GET /console/api/conversaciones`: más recientes primero (por `actualizada`), paginadas con cursor, con
    filtros `tenant`, `canal`, `listas=1` y `mes`.
  - `GET /console/api/conversaciones/{id}`: los turnos en orden, con `rol` (`visitante`, `asistente` o
    `persona` si traía `"by": "human"`), `texto` y `hora` (solo si existe `ts`), más señales, idioma, turnos y
    fechas.
  - El contacto de WhatsApp sale siempre enmascarado (`+593 ••• ••• 586`, como máximo los últimos 3 dígitos).
    El de web sale como un identificador corto. **Ninguna respuesta incluye `id_externo` completo.**
  - Una conversación purgada da 404. Cada lectura de detalle deja un evento `lectura` en `consola_accesos`.
- **Pruebas:** filtro por canal; filtro de listos; cursor (la segunda página no repite filas); enmascarado en
  la lista y en el detalle (busca el número completo en todo el JSON: no debe estar); un turno de persona sale
  como `persona`; 404 de una purgada; la lectura queda registrada sin texto.
- **Terminado cuando:** todo pasa. **Cierre del bloque A7–A9:** `/pg-review` y `/pg-pr`.

### A10. **(Paul)** Salida a producción de lo de atrás
- Correr `scripts/console_setup.py`, escanear el código QR con el autenticador y poner las cuatro variables en
  el `.env` del VPS (`docker compose up -d`, porque un `restart` no basta).
- En el `Caddyfile`, agregar `/console/*` a `@pub`. `/admin/*` sigue en 404.
- Mergear respetando el orden 006 → 007 → 008 (design § 0), `deploy.sh --vps` y probar el login con
  `curl` (el `GET /console/api/yo` sin cookie da 401). Dejar una entrada fechada en `docs/caminos/`.

---

## Grupo B · `landing` (la pantalla)

**Antes de empezar, en `landing/frontend`:** `git switch feat/panel-conversaciones`, `npm install`,
`npm test`, `npm run lint` y `npx tsc --noEmit`, todo en verde. Para ver la pantalla: el asistente en local
con `CONSOLE_ORIGIN=http://localhost:3000` y tu usuario de prueba, y la landing con `npm run dev`. Usa Chrome.

### B1. Cliente de la API y lógica sin pantalla
- **Archivos:** `shared/lib/console/api.ts`, `shared/lib/console/format.ts` y `shared/lib/console/nav.ts`, cada
  uno con su `.test.ts`.
- **Qué hacer:**
  - `api.ts`: llamadas a `/console/api/*` con `credentials: 'include'` y la URL base de
    `shared/components/ui/chat/api.ts` (`API_URL`); un 401 lanza un error propio, `SessionExpired`.
  - `format.ts`: fecha y hora en español de Ecuador, cifras con separadores y el costo con 2 decimales.
  - `nav.ts`: una función pura que, dada la lista y la tecla (`j`, `k`, `Enter`, `Esc`), devuelve la nueva
    selección.
- **Prueba:** `npm test`, `npm run lint` y `npx tsc --noEmit`.
- **Terminado cuando:** cada función tiene su prueba y todo pasa.

### B2. La ruta `/consola` y el login
- **Archivos:** `app/consola/page.tsx`, `features/console/` (componentes) y `app/sitemap.ts` (solo para
  comprobarlo, sin cambiarlo).
- **Qué hacer:** página con el mismo `robots` que `app/wa/page.tsx` (`index: false`), fuera del sitemap y sin ningún enlace desde la
  landing. El login es una columna centrada con el título «Consola» y tres campos (usuario, clave y código).
  El código se autoenfoca y se envía solo al completar los 6 dígitos. Si falla, muestra un único mensaje
  neutro, y tras el bloqueo, el tiempo restante. Si una petición da 401, vuelve al login y recuerda dónde
  estabas.
- **Prueba:** una prueba que confirme que `sitemap.ts` no contiene `/consola`, más `npm test`, `npm run lint`
  y `npx tsc --noEmit`. A mano: entras con tu usuario de prueba y ves «Consola».
- **Terminado cuando:** entras y sales con tu usuario de prueba. **Cierre del bloque B1–B2:** `/pg-review` y
  `/pg-pr`.

### B3. Franja de cifras del mes
- **Qué hacer (design § 4, zona 1):** cuatro cifras grandes en Geist Mono (Chats, Respuestas, Costo (USD) y
  Listos para llamada), un selector de mes y la regla de chats por día como marcas verticales de petróleo,
  con el día y el número al pasar el cursor. Tiene sus estados de carga, vacío y error, con «Reintentar».
- **Terminado cuando:** con tus datos de prueba se ven las cuatro cifras, cambiar de mes las actualiza y los
  tres estados se pueden provocar (vacío: un mes sin datos; error: el asistente apagado).

### B4. Bandeja de conversaciones
- **Qué hacer (zona 2):** filas separadas por líneas finas, sin cajas. Cada fila lleva hora, contacto
  enmascarado, tenant, canal, turnos y señales (`3/4`). Los listos para llamada llevan la palabra en
  petróleo. Hay filtros de tenant, canal y «solo listos», y la fila seleccionada va con fondo Arena y
  `aria-current`. `j`, `k` y `Enter` usan `nav.ts` de la B1.
- **Terminado cuando:** los filtros cambian la lista, `j`/`k` se mueven y `Enter` abre la conversación.

### B5. Lector y vista móvil
- **Qué hacer (zona 3):** diálogo sin burbujas. Cada turno lleva una etiqueta mono (`VISITANTE`, `ASISTENTE` o
  `PERSONA`) y la hora si existe. Los turnos del asistente llevan una línea fina de petróleo a la izquierda.
  Al pie van las 4 señales con su estado, y al cambiar de conversación hay un desvanecido de 120 ms, que se
  apaga con `prefers-reduced-motion`. En pantallas de menos de 1024 px va una sola columna: el lector a
  pantalla completa con un botón «Volver» (y `Esc`).
- **Terminado cuando:** funciona a 1280 px (las tres zonas a la vez) y a 390 px (bandeja, luego lector con
  «Volver»). Revísalo con el modo responsive de Chrome.

### B6. Revisión de marca y accesibilidad
- **Qué hacer:** recorre esta lista y anota el resultado en el PR:
  - Sin `box-shadow` ni `gradient`: `grep -rn "shadow\|gradient" features/console` sale vacío.
  - Solo colores de la paleta (tokens de `app/globals.css`) y las letras de `negocio/identidad/MARCA.md`.
  - Foco visible (contorno petróleo de 2 px), todo usable con teclado, campos con etiqueta, `lang="es"` y
    cifras con texto accesible («48 chats este mes»).
  - Ninguna captura de pantalla con conversaciones sale a iCloud ni a Notion (`docs/politicas.md`).
- **Terminado cuando:** todos los puntos están marcados en la descripción del PR. **Cierre del bloque B3–B6:**
  `/pg-review` y `/pg-pr`.

### B7. **(Paul)** Publicación
- Mergear la landing (se publica en GitHub Pages) y entrar a `aiworks.lat/consola` con el autenticador real.

**Terminado (todo el cambio) cuando:** Paul entra a `aiworks.lat/consola` con su código y ve el resumen del
mes y una conversación real completa, con el teléfono enmascarado.
