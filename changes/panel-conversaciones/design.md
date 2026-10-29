# Design: panel-conversaciones

Decisión de arquitectura en `docs/adr/ADR-010-consola-de-conversaciones-con-login-en-la-api-publica.md`.
Aquí va lo que ese ADR no cubre: contrato, datos y la experiencia de la pantalla.

## 0. Puesta al día (2026-10-28, conserje con Paul)

Paul decidió hacer la consola completa ya. **La implementa Katty con `/pg-implement`** (Decisión #34), con
`tasks.md` escrito para ella. Cambios frente al diseño del 2026-10-12, verificados contra el código:

- **Migración `008_consola.sql`, no `004`.** La `004` es `human_takeover`, la `005` es `demo_uso` y la `006` son
  las citas. La `007` (prospección) vive en `feat/agente-prospeccion-parte1`, todavía sin mergear. El migrador
  solo aplica versiones mayores que la actual: **se mergea y despliega en orden 006 → 007 → 008**. Si la 008
  llega antes que la 007, la 007 no se aplica nunca. Si la consola queda lista primero, espera al agente o se
  renumera al mergear.
- **Hora de cada mensaje.** El `historial` guarda `{"role", "content"}` sin hora (`app/db/conversations.py:37`), y
  los mensajes de una persona llevan además `"by": "human"` (`app/channels/whatsapp/conversation.py:112`). Desde
  esta tarea, cada mensaje nuevo guarda también `"ts"` (ISO UTC). El lector muestra la hora cuando existe y, si
  no, solo la fecha de la conversación. Los turnos con `"by": "human"` se etiquetan `PERSONA`, no `ASISTENTE`.
- **Una fila por contacto.** `conversaciones` tiene `UNIQUE (tenant_id, canal, id_externo)`: un mismo teléfono
  es una sola fila con todo su historial, y una conversación `EXPIRED` vuelve a usarse si el contacto escribe
  otra vez. La bandeja lista contactos ordenados por `actualizada`, no sesiones sueltas.
- **La purga** es de 30 días por tenant (`retencion_dias` en `perfil.json`) y corre cada hora en
  `app/usage/retention.py::cleanup`. Los contadores diarios se calculan al inicio de `cleanup`, antes del
  primer `DELETE`.
- **El admin interno sigue igual.** `app/admin/router.py` (puerto 8001, solo loopback) no se toca. La consola
  es un router nuevo, `app/console/`, montado en la app pública (`app/main.py`). La cifra «listo para
  llamada» reutiliza `is_call_ready` del admin, importándola, sin copiarla.
- **CORS.** La app ya tiene `ProfileCors` para `/chat/*`. La consola agrega su propio manejo, solo en
  `/console/*`, con `CONSOLE_ORIGIN` (por defecto `https://aiworks.lat`; en local, `http://localhost:3000`).
  La cookie `__Host-consola` funciona entre `aiworks.lat` y `api.aiworks.lat`, porque son el mismo sitio y
  `SameSite=Strict` lo permite. En local se prueba con Chrome, que acepta cookies `Secure` en `localhost`.
- **La landing no tiene pruebas de componentes.** `npm test` es `node --test` sobre archivos `.ts`. La lógica
  (cliente de API, formato, navegación con teclado, filtros) va en módulos puros con pruebas, y lo visual se
  revisa a mano con una lista de comprobación.
- **Datos para Katty.** Solo base local con conversaciones inventadas. Nunca la base del VPS ni capturas de
  conversaciones reales (`docs/politicas.md`). El hash, el secreto TOTP, el `.env` del servidor, el
  `Caddyfile` y el despliegue son de Paul.

## 1. Contrato de la API (`/console/api`)

| Método y ruta | Auth | Qué hace |
|---|---|---|
| `POST /login` | no | Recibe `usuario`, `clave`, `codigo`. Crea la sesión y fija la cookie. |
| `POST /logout` | sí | Borra la sesión del servidor y la cookie. |
| `GET /yo` | sí | Devuelve `{usuario}`; la landing lo usa para saber si hay sesión. |
| `GET /resumen?mes=AAAA-MM` | sí | Cifras del mes y chats por día, por tenant y canal. |
| `GET /conversaciones` | sí | Lista paginada por cursor. Filtros: `tenant`, `canal`, `listas=1`, `mes`. |
| `GET /conversaciones/{id}` | sí | Diálogo completo, señales, idioma, turnos y fechas. |

Los nombres de campos y rutas son contrato de datos y van en español, como en el resto del motor.
Las respuestas nunca incluyen `id_externo` en claro: devuelven `contacto` enmascarado
(`+593 ••• ••• 586`) o, en web, un identificador corto de sesión.

## 2. Autenticación

- Hash `argon2id` con parámetros por defecto de `argon2-cffi`. Verificación con tiempo constante;
  si el usuario no existe se verifica contra un hash falso para no filtrar por tiempos.
- TOTP de 6 dígitos, paso de 30 s, ventana de ±1 paso. Un código ya usado no se acepta dos veces.
- Sesión: 32 bytes aleatorios; en SQLite solo se guarda su SHA-256. Caduca a las 12 h absolutas y a
  los 30 min sin actividad.
- Cookie `__Host-consola`: `HttpOnly; Secure; SameSite=Strict; Path=/`. Sin `Domain`.
- Bloqueo: 5 intentos fallidos por IP-hash en 15 min, y 20 globales por hora. Respuesta de login
  idéntica ante usuario, clave o código incorrectos.
- `POST` exige `Content-Type: application/json` y cabecera `Origin` igual a `https://aiworks.lat`.
- Registro de accesos: cada login (bueno o malo) y cada lectura de detalle, con IP-hash y hora. Sin
  contenido de conversaciones.
- Apagada por defecto: sin `CONSOLE_USER` y `CONSOLE_PASSWORD_HASH` todas las rutas dan 404.

## 3. Datos

Migración `008_consola.sql` (ver § 0):

```sql
CREATE TABLE consola_sesiones (
  token_hash TEXT PRIMARY KEY,
  creada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ultima_actividad TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expira TIMESTAMP NOT NULL
);
CREATE TABLE consola_accesos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  momento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  evento TEXT NOT NULL CHECK (evento IN ('login_ok','login_fallido','bloqueado','lectura')),
  ip_hash TEXT NOT NULL
);
CREATE TABLE metricas_diarias (
  dia TEXT NOT NULL, tenant_id TEXT NOT NULL, canal TEXT NOT NULL,
  conversaciones INTEGER NOT NULL DEFAULT 0,
  listas_para_llamada INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (dia, tenant_id, canal)
);
```

- `metricas_diarias` se recalcula desde `conversaciones` (por `creada`) para hoy y ayer, **antes** de
  la purga en el bucle de retención. Es idempotente: repetirla no duplica.
- Respuestas y costo salen de `uso`, que no se purga. No se duplican.
- Las sesiones vencidas y los accesos de más de 90 días los borra el mismo bucle de retención.
- El costo no se muestra por conversación: `uso` no guarda a qué conversación pertenece cada
  respuesta. Se muestra por tenant, canal y mes.

## 4. Experiencia (UX y UI)

**Principio.** La marca prohíbe tarjetas, sombras, degradados, íconos de adorno y más de un acento.
El diseño es editorial: tipografía, ritmo, líneas finas y espacio. Lo atractivo sale de la jerarquía
y el detalle, no de la decoración. Solo tema claro (ADR-005).

**Sistema visual.** Tokens de `productos/landing/frontend/app/globals.css`: Papel de fondo, Arena para
la fila seleccionada, Tinta y Tinta media para texto, Regla para las líneas, Petróleo como único
acento. Bricolage Grotesque para títulos, Geist para texto, Geist Mono para cifras, horas y etiquetas.
Alineado a la izquierda, sin centrar nada salvo el login.

**Pantalla principal, una sola vista en tres zonas** (escritorio ≥ 1024 px):

1. **Franja de cifras** (arriba). Cuatro cifras grandes en Geist Mono: *Chats*, *Respuestas*,
   *Costo (USD)* y *Listos para llamada*, con el nombre del mes y un selector de mes a la derecha. Bajo
   las cifras, una regla fina con los chats por día dibujados como marcas verticales de petróleo: es un
   gráfico, no adorno, y se lee como un código de barras sobrio. Al pasar el cursor, la marca muestra
   el día y el número.
2. **Bandeja** (columna izquierda, ~38 %). Filas separadas por reglas finas, sin cajas. Cada fila:
   hora y fecha en mono, contacto enmascarado, etiqueta de tenant y de canal en texto, número de
   turnos y señales alcanzadas (`3/4`). Una fila con «listo para llamada» lleva la palabra en
   petróleo. Filtros arriba de la lista: tenant, canal (Web, WhatsApp) y «solo listos».
3. **Lector** (columna derecha). La conversación como diálogo tipográfico, sin burbujas: cada turno
   lleva una etiqueta mono (`VISITANTE`, `ASISTENTE`) y la hora; los turnos del asistente tienen una
   regla vertical fina de petróleo a la izquierda. Al pie, las señales como una lista de cuatro líneas
   con su estado. La cabecera del lector repite contacto, canal, idioma y turnos.

**Móvil (< 1024 px).** Una sola columna: franja de cifras compacta, luego la bandeja; al elegir una
fila se abre el lector a pantalla completa con un botón «Volver».

**Interacción.** Teclado: `j`/`k` bajan y suben por la bandeja, `Enter` abre, `Esc` cierra el lector
en móvil, `g` luego `r` va al resumen. Foco visible con un contorno de petróleo de 2 px. La fila
seleccionada se marca con fondo Arena y se anuncia con `aria-current`.

**Estados.** Cada zona tiene su carga (esqueleto de líneas grises, sin brillo animado), vacío
(«Aún no hay conversaciones este mes», con el filtro activo mencionado), error con botón «Reintentar»
y sesión caducada (vuelve al login conservando la ruta). El login no distingue entre usuario, clave o
código incorrectos.

**Login.** Una columna centrada y estrecha sobre Papel: título «Consola», tres campos (usuario,
clave, código de 6 dígitos que se autoenfoca y se envía al completarse) y un botón de petróleo. Mensaje
de error único y neutro. Tras 5 fallos muestra el bloqueo con el tiempo restante.

**Accesibilidad.** Contrastes de la marca (tinta/papel 16.2, petróleo/papel 6.2). Todo operable con
teclado, etiquetas reales en los campos, `lang="es"`, cifras con texto accesible
(«48 chats este mes») y respeto a `prefers-reduced-motion`. Sin animaciones salvo un desvanecido de
120 ms al cambiar de conversación.

**Privacidad en pantalla.** Teléfonos siempre enmascarados. La ruta lleva `noindex`, no está en el
sitemap ni se enlaza desde la landing, y las capturas de pantalla no deben salir a la carpeta
compartida (docs/politicas.md).

## 5. Operación

- `scripts/console_setup.py` pide la clave por la terminal, imprime el hash y genera el secreto TOTP
  junto con su URI `otpauth://` para el autenticador. No escribe archivos ni registra la clave.
- El `Caddyfile` añade `/console/*` a las rutas públicas; `/admin/*` sigue devolviendo 404.
- El CORS con credenciales se limita a `/console/*` y al origen `https://aiworks.lat`.
- Una entrada nueva en `docs/caminos/` con el procedimiento de alta y de recuperación del autenticador.
