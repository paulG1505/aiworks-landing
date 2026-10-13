# Design: panel-conversaciones

Decisión de arquitectura en `ADR-010.md` (copia de trabajo de
`docs/adr/ADR-010-consola-de-conversaciones-con-login-en-la-api-publica.md` del motor). Aquí va lo
que ese ADR no cubre: contrato, datos, la arquitectura del frontend y la experiencia de la pantalla.

Revisado el 2026-10-13: los cambios respecto a la primera versión y sus motivos están en
`analisis.md`. Este documento es la especificación que sigue quien implemente; si algo no está
aquí, se pregunta antes de inventarlo.

## 0. Qué se construye en cada repo

| Repo | Qué | Tareas |
|---|---|---|
| Motor (`productos/asistente`, privado) | `/console/api/*`, autenticación, SQLite, `metricas_diarias`, Caddy, CORS | 1.x, 2.x, 3.x, 7.x |
| Landing (este repo, público) | Ruta `/consola`, cliente de API, interfaz, servidor simulado, pruebas de componente | 4.1, 5.1, 5.2, 6.1, 6.2 |

El frontend trata la sección 1 como contrato cerrado: el motor la implementa tal cual y el
servidor simulado (sección 9) la reproduce. Cualquier cambio de contrato se hace primero aquí.

## 1. Contrato de la API (`/console/api`)

### 1.1 Convenciones

- **Base:** `${NEXT_PUBLIC_API_URL}/console/api`. En producción `https://api.aiworks.lat/console/api`;
  en desarrollo `http://127.0.0.1:8000/console/api`. Es la misma variable que ya usa el chat.
- **Formato:** JSON UTF-8 en peticiones y respuestas. Nombres de campos y rutas en español, sin
  tildes ni `ñ` (`senales`, no `señales`), en `snake_case`.
- **Fechas y horas:** todo instante va en ISO 8601 UTC con `Z` (`2026-10-12T15:04:09Z`). Los días
  (`AAAA-MM-DD`) y meses (`AAAA-MM`) se calculan en la zona `America/Guayaquil` (UTC−5, sin horario
  de verano), tanto en el motor como en la interfaz. Un chat creado el 2026-10-01T03:00Z cuenta en
  el día 2026-09-30.
- **Identificadores:** el `id` de una conversación es una cadena opaca que cumple
  `^[A-Za-z0-9_-]{1,64}$`. No es ni contiene el teléfono ni el `id_externo`. El frontend no lo
  interpreta; solo lo copia a la URL y lo devuelve.
- **Contacto:** las respuestas nunca incluyen `id_externo` en claro. `contacto` es una cadena ya
  enmascarada: en WhatsApp `+593 ••• ••• 586` (como máximo los 3 últimos dígitos); en web
  `web · a1b2c3` (6 caracteres de un hash de la sesión, no el `sesion_id`).
- **Caché:** toda respuesta de `/console/*` lleva `Cache-Control: no-store`. El cliente pide con
  `cache: "no-store"`.
- **Métodos:** solo `GET` y `POST`. Cualquier otro método sobre una ruta existente responde 405.

### 1.2 Rutas

| Método y ruta | Auth | Petición | Respuesta 2xx |
|---|---|---|---|
| `POST /login` | no | `{usuario, clave, codigo}` | 200 `Sesion` + `Set-Cookie` |
| `POST /logout` | sí* | `{}` | 204 sin cuerpo, borra la cookie |
| `GET /yo` | sí | — | 200 `Sesion` |
| `GET /resumen?mes=AAAA-MM[&tenant=][&canal=]` | sí | — | 200 `Resumen` |
| `GET /conversaciones?mes=AAAA-MM[&tenant=][&canal=][&listas=1][&cursor=][&limite=]` | sí | — | 200 `PaginaConversaciones` |
| `GET /conversaciones/{id}` | sí | — | 200 `DetalleConversacion` |

\* `POST /logout` sin sesión válida responde 204 igual (es idempotente) y vuelve a borrar la cookie.

`GET /yo` es la sonda de sesión del frontend: 200 si hay sesión, 401 si no, 404 si la consola está
apagada.

### 1.3 Formas de respuesta

```jsonc
// Sesion (POST /login, GET /yo)
{
  "usuario": "paul",
  "tenants": [                       // todos los tenants que la sesión puede ver, ordenados por nombre
    { "id": "aiworks", "nombre": "AIworks" },
    { "id": "demo-panaderia", "nombre": "Panadería Sol" }
  ]
}

// Resumen (GET /resumen)
{
  "mes": "2026-10",
  "totales": {
    "conversaciones": 48,            // entero ≥ 0: chats nuevos del mes (por fecha de creación)
    "respuestas": 312,               // entero ≥ 0: respuestas del asistente, de la tabla uso
    "costo_usd": 1.8432,             // número ≥ 0, hasta 4 decimales
    "listas_para_llamada": 5         // entero ≥ 0
  },
  "por_dia": [                       // un elemento por día, del 1 del mes a hoy (o al último día si el mes ya pasó)
    { "dia": "2026-10-01", "conversaciones": 3 },
    { "dia": "2026-10-02", "conversaciones": 0 }
  ]
}

// PaginaConversaciones (GET /conversaciones)
{
  "elementos": [ /* ResumenConversacion, de la más nueva a la más vieja */ ],
  "siguiente": "eyJjIjoiMjAyNi0xMC0xMlQxNTowNDowOVoiLCJpIjoiYWJjIn0"   // cadena opaca, o null al final
}

// ResumenConversacion (cada elemento de la lista)
{
  "id": "c_8f2a19d0",
  "tenant": "aiworks",               // id del tenant; el nombre sale de Sesion.tenants
  "canal": "whatsapp",               // "web" | "whatsapp"
  "contacto": "+593 ••• ••• 586",
  "creada": "2026-10-12T15:04:09Z",
  "ultima_actividad": "2026-10-12T15:19:40Z",
  "turnos": 5,                       // entero ≥ 0: mensajes del visitante
  "senales_alcanzadas": 3,           // entero, 0 ≤ alcanzadas ≤ total
  "senales_total": 4,
  "lista_para_llamada": true
}

// DetalleConversacion (GET /conversaciones/{id}): todos los campos de ResumenConversacion
// salvo senales_alcanzadas y senales_total, más:
{
  "idioma": "es",                    // "es" | "en" | null
  "senales": [                       // siempre senales_total elementos, en orden fijo
    { "clave": "necesidad", "nombre": "Necesidad clara", "alcanzada": true }
  ],
  "mensajes": [                      // orden cronológico ascendente
    { "rol": "visitante", "texto": "Hola, ¿a qué hora abren?", "momento": "2026-10-12T15:04:09Z" },
    { "rol": "asistente", "texto": "Atendemos de 8:00 a 18:00.", "momento": "2026-10-12T15:04:12Z" }
  ]
}
```

Reglas de cada campo:

- `texto` es texto plano. Puede traer saltos de línea. Nunca es HTML ni Markdown para la consola: el
  frontend lo pinta como texto (`white-space: pre-wrap`), sin enlazar URL ni interpretar nada.
- `nombre` de una señal es la etiqueta en español que se muestra tal cual.
- Un campo desconocido en la respuesta se ignora; un campo obligatorio ausente o de otro tipo hace
  que el cliente trate la respuesta como `bad_response` (sección 5).

### 1.4 Parámetros

| Parámetro | Valores | Por defecto | Si es inválido |
|---|---|---|---|
| `mes` | `AAAA-MM`, entre 2020-01 y el mes actual | obligatorio (el frontend siempre lo manda) | 422 `parametro_invalido` |
| `tenant` | un `id` de `Sesion.tenants` | todos | 422 `parametro_invalido` |
| `canal` | `web`, `whatsapp` | ambos | 422 `parametro_invalido` |
| `listas` | `1` | sin filtrar | cualquier otro valor: 422 |
| `cursor` | el `siguiente` de la página anterior, sin tocar | primera página | 422 `cursor_invalido` |
| `limite` | 1–100 | 30 | 422 `parametro_invalido` |

`mes` filtra por la fecha de creación de la conversación en `America/Guayaquil`. `tenant` y `canal`
filtran también el resumen. `listas` solo aplica a la lista.

### 1.5 Paginación

- Orden estable: `creada DESC, id DESC`. Se ordena por creación, no por última actividad, para que
  una conversación que recibe un mensaje mientras se pagina no salte ni se repita.
- `siguiente` es opaco: el cliente no lo decodifica ni lo construye. Se envía con los **mismos**
  filtros con que se obtuvo; si cambia un filtro, la lista empieza de nuevo sin cursor.
- `siguiente` es `null` cuando no quedan más elementos. Una página puede venir vacía solo si es la
  primera (no hay conversaciones con esos filtros).
- Un cursor caducado, manipulado o usado con otros filtros responde 422 `cursor_invalido`; el
  frontend descarta la lista y la pide de nuevo desde el principio una sola vez.

### 1.6 Errores

Todo error de `/console/api` tiene este cuerpo (el que produce `HTTPException(detail={...})` de
FastAPI; el motor añade un manejador para que los 422 de validación usen la misma forma):

```json
{ "detail": { "codigo": "credenciales_invalidas", "mensaje": "Usuario, clave o código incorrectos.", "reintentar_en": 540 } }
```

`reintentar_en` (segundos, entero) solo aparece en 429. El frontend **no muestra** `mensaje`: muestra
su propio texto según el estado y `codigo` (sección 6.6). Si el cuerpo no tiene esta forma, el cliente
decide solo por el código de estado.

| Estado | `codigo` | Cuándo | Qué hace la interfaz |
|---|---|---|---|
| 401 | `credenciales_invalidas` | Login con usuario, clave o código incorrectos, o código ya usado | Mensaje único de login fallido |
| 401 | `sin_sesion` | Ruta protegida sin cookie, con sesión caducada o inexistente | Vuelve al login (sesión caducada) |
| 403 | `origen_no_permitido` | `POST` sin `Content-Type: application/json` o con `Origin` distinto del permitido | Error genérico; no reintenta |
| 404 | `no_encontrada` | `GET /conversaciones/{id}` de una conversación inexistente o purgada | «Esta conversación ya no existe» en el lector |
| 404 | (cualquiera) | Cualquier ruta con la consola apagada | Pantalla «La consola no está activa» |
| 405 | `metodo_no_permitido` | Método distinto de `GET`/`POST` | No ocurre desde la interfaz |
| 422 | `parametro_invalido` · `cursor_invalido` | Parámetro o cuerpo inválido | Ver 1.4 y 1.5 |
| 429 | `bloqueado` | Login tras 5 fallos de la IP en 15 min o 20 globales en 1 h | Cuenta atrás con `reintentar_en` |
| 429 | `demasiadas_peticiones` | Más de 120 lecturas por minuto de una sesión | Error de zona con espera |
| 5xx | (cualquiera) | Fallo del motor o de Caddy | Error de zona con «Reintentar» |

Cada 429 lleva además la cabecera `Retry-After` con el mismo número de segundos, expuesta con
`Access-Control-Expose-Headers: Retry-After`. El cliente lee primero `detail.reintentar_en`, luego la
cabecera y, si no hay ninguno, usa 60 s.

### 1.7 Tiempos

- El cliente aborta toda petición a los **15 s** y la trata como `timeout`.
- Una sesión vive 12 h absolutas y caduca a los 30 min sin peticiones autenticadas. Cada petición
  autenticada correcta renueva `ultima_actividad`. El frontend no recibe ni calcula la caducidad del
  servidor, pero aplica su propio corte de inactividad (sección 4.3).

## 2. Autenticación, cookie y CORS

### 2.1 Credenciales (motor)

- Hash `argon2id` con parámetros por defecto de `argon2-cffi`. Verificación con tiempo constante;
  si el usuario no existe se verifica contra un hash falso para no filtrar por tiempos.
- TOTP de 6 dígitos, paso de 30 s, ventana de ±1 paso. Un código aceptado no se acepta otra vez
  mientras siga dentro de la ventana (se guarda el último paso usado).
- Sesión: 32 bytes aleatorios (`secrets.token_urlsafe(32)`); en SQLite solo se guarda su SHA-256.
  Caduca a las 12 h absolutas y a los 30 min sin actividad.
- Bloqueo: 5 intentos fallidos por IP-hash en 15 min, y 20 globales por hora. Respuesta de login
  idéntica (estado, cuerpo y tiempo aproximado) ante usuario, clave o código incorrectos.
- Registro de accesos: cada login (bueno o malo), cada bloqueo y cada lectura de detalle, con IP-hash
  y hora. Sin contenido de conversaciones.
- Apagada por defecto: sin `CONSOLE_USER` o sin `CONSOLE_PASSWORD_HASH`, todas las rutas
  `/console/api/*` dan 404 y no se crea ninguna sesión.

### 2.2 Cookie

```
Set-Cookie: __Host-consola=<token>; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=43200
```

- La fija `api.aiworks.lat` en la respuesta de `POST /login`. El prefijo `__Host-` obliga a `Secure`,
  `Path=/` y prohíbe `Domain`, así que la cookie es **solo de `api.aiworks.lat`**. Es lo correcto: el
  único que la lee es el motor. `aiworks.lat` (GitHub Pages) nunca la recibe ni la necesita.
- El frontend no lee la cookie (es `HttpOnly`). Sabe si hay sesión solo por `GET /yo`.
- `Max-Age=43200` (12 h) acompaña a la caducidad absoluta; la inactividad la controla el servidor.
  `POST /logout` responde con la misma cookie y `Max-Age=0`.
- **Por qué viaja con `SameSite=Strict`.** `https://aiworks.lat` y `https://api.aiworks.lat` son
  orígenes distintos pero el **mismo sitio**: el sitio es esquema + dominio registrable, y
  `aiworks.lat` es el dominio registrable (`.lat` es el sufijo público). Un `fetch` desde
  `aiworks.lat` a `api.aiworks.lat` es una petición *same-site*, y el navegador envía cookies
  `Strict` y `Lax` en peticiones same-site. Tampoco cuenta como cookie de terceros, así que el
  bloqueo de terceros de Safari, Firefox o Chrome no la afecta.
- **Condición necesaria en el cliente:** `credentials: "include"` en **todas** las peticiones,
  incluida la de login. Sin eso, una petición entre orígenes no envía la cookie y el navegador
  descarta el `Set-Cookie` de la respuesta.
- `www.aiworks.lat` redirige a `aiworks.lat` (GitHub Pages con dominio apex en `CNAME`), así que la
  consola siempre corre en el origen `https://aiworks.lat`.

### 2.3 CORS (solo en `/console/*`)

El motor monta la consola como subaplicación con su propio CORS, para no dar credenciales al resto de
rutas. Respuestas a cualquier petición de `/console/*` cuyo `Origin` sea el permitido:

```
Access-Control-Allow-Origin: https://aiworks.lat        (exacto, nunca *)
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: Retry-After
Vary: Origin
```

Preflight (`OPTIONS`), que el navegador hace antes de cada `POST` con `Content-Type: application/json`:

```
Access-Control-Allow-Origin: https://aiworks.lat
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 600
Vary: Origin
```

Si el `Origin` no es el permitido, la respuesta no lleva cabeceras CORS (el navegador bloquea la
lectura). Los `GET` del frontend no llevan cabeceras propias, así que no hacen preflight.

Origen permitido: `CONSOLE_ALLOWED_ORIGIN`, por defecto `https://aiworks.lat`. En desarrollo,
`http://127.0.0.1:3000`.

### 2.4 CSRF

Tres capas, todas en el motor:

1. `SameSite=Strict` impide que otro **sitio** envíe la cookie.
2. Todo `POST` exige `Content-Type: application/json` (fuerza preflight, que solo pasa el origen
   permitido) y `Origin` exactamente igual a `CONSOLE_ALLOWED_ORIGIN`; si no, 403
   `origen_no_permitido` sin tocar la sesión. Esto cubre lo que `SameSite` no cubre: un subdominio
   del mismo sitio (por ejemplo `www` o uno futuro) sí podría enviar la cookie.
3. Los `GET` no cambian nada del negocio (solo registran la lectura) y su respuesta solo la puede
   leer el origen permitido por CORS.

No hace falta token CSRF ni cabecera propia adicional.

### 2.5 Desarrollo local

- Se abre la landing en **`http://127.0.0.1:3000`**, no en `localhost:3000`, con la API en
  `http://127.0.0.1:8000`. `localhost` y `127.0.0.1` son **sitios distintos**: desde `localhost` una
  cookie `SameSite` de `127.0.0.1` no viaja y el login parece funcionar pero `GET /yo` da 401. El
  puerto no cuenta para el sitio, así que `127.0.0.1:3000` → `127.0.0.1:8000` es same-site.
- En `http` no se usan `Secure` ni el prefijo `__Host-` (los navegadores no los tratan igual sobre
  `http://127.0.0.1`). El servidor simulado fija `consola_dev=<token>; Path=/; HttpOnly;
  SameSite=Lax; Max-Age=43200`. El motor real en local hace lo mismo cuando
  `CONSOLE_INSECURE_DEV_COOKIE=1`; en producción esa variable no existe y arranca con error si
  aparece junto a un origen `https`.
- El nombre de la cookie no le importa al frontend.

## 3. Datos (motor)

Migración `004_consola.sql`:

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

- `metricas_diarias` se recalcula desde `conversaciones` (por `creada`, día en
  `America/Guayaquil`) **antes** de la purga en el bucle de retención, con `INSERT … ON CONFLICT DO
  UPDATE`: repetirla no duplica.
- Se recalculan **todos los días que aún están completos** en `conversaciones` para cada canal, no
  solo hoy y ayer: una conversación creada hace 5 días puede volverse «lista para llamada» hoy, y con
  solo hoy y ayer ese cambio se perdería. Un día está completo mientras ninguna de sus conversaciones
  pudo purgarse: para un canal con retención de *R* días, los días desde `hoy − (R − 2)` hasta hoy.
  Los días más viejos quedan congelados con su último valor y nunca se recalculan (recalcularlos tras
  una purga parcial bajaría las cifras).
- `GET /resumen` toma `conversaciones` y `listas_para_llamada` de `metricas_diarias` para los días
  congelados y de `conversaciones` para los días vivos; `respuestas` y `costo_usd` salen de `uso`, que
  no se purga.
- Las sesiones vencidas y los accesos de más de 90 días los borra el mismo bucle de retención.
- El costo no se muestra por conversación: `uso` no guarda a qué conversación pertenece cada
  respuesta. Se muestra por mes, filtrable por tenant y canal.

## 4. Frontend: arquitectura en este repo

### 4.1 Ruta y metadatos

`frontend/app/consola/page.tsx` es un componente de servidor mínimo. El export estático genera
`out/consola.html`, que GitHub Pages sirve en `/consola` (igual que `/privacidad` y `/demo`).

```tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ConsoleApp, ConsoleBootFallback } from '@/features/consola';

export const metadata: Metadata = {
  title: 'Consola',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default function ConsolePage() {
  return (
    <Suspense fallback={<ConsoleBootFallback />}>
      <ConsoleApp />
    </Suspense>
  );
}
```

- `robots` del hijo **reemplaza** el del layout raíz (la fusión de metadatos de Next no es profunda),
  así que hay que repetir `googleBot`. `alternates` y `openGraph` se anulan para que la página no
  herede el canónico ni la vista previa de la portada.
- `Suspense` es obligatorio: `ConsoleApp` usa `useSearchParams`, y sin un límite de `Suspense` el
  export estático falla.
- **Sitemap:** `app/sitemap.ts` es una lista escrita a mano; `/consola` simplemente no se añade. No se
  toca.
- **robots.txt:** no se añade `Disallow: /consola`. Un `Disallow` impide que el buscador lea el
  `noindex` y la URL podría indexarse sin contenido si alguien la enlaza; además anunciaría la ruta.
- No se añade ningún enlace a `/consola` en la landing.

### 4.2 Sin el encabezado, el pie ni el chat de la landing

El layout raíz pinta `Header`, `Footer` y `ChatLauncher` en todas las rutas. En `/consola` sobran (y
el chat haría peticiones ajenas). Se sigue el precedente de `ChatLauncher`, que ya se oculta en
`/demo` con `usePathname()`:

- `shared/constants/site.ts` exporta `CONSOLE_PATH = '/consola'`.
- `Header`, `Footer` y `ChatLauncher` devuelven `null` cuando `pathname?.startsWith(CONSOLE_PATH)`.
  Los tres ya son componentes de cliente; `usePathname()` también funciona al prerenderizar, así que
  `out/consola.html` sale sin ellos.

Se descartó partir `app/` en dos grupos de rutas con dos layouts raíz: obliga a mover todas las
páginas y cambia cómo se generan el 404 y los metadatos de la raíz, por un beneficio que tres
condiciones de una línea ya dan.

### 4.3 Guardia de sesión (solo en el cliente)

No hay servidor, middleware ni sesión en la landing. La guardia es una máquina de estados en
`useConsoleSession`:

```
checking ──GET /yo 200──▶ authenticated ──401 en cualquier petición──▶ expired
   │  └──401──▶ anonymous ──login 200──▶ authenticated          │
   │  └──404──▶ disabled                     ▲                    │
   └──red/5xx/timeout/429──▶ unavailable ─Reintentar─▶ checking  └──login 200──┘
authenticated ──Salir──▶ signedOut (= anonymous con aviso «Sesión cerrada»)
```

| Estado | Qué se pinta | Datos en memoria |
|---|---|---|
| `checking` | Solo la línea «Comprobando sesión…» (`role="status"`) | Ninguno |
| `anonymous` | Formulario de login | Ninguno |
| `expired` | Login con el aviso «Su sesión caducó. Vuelva a entrar.» | Ninguno |
| `signedOut` | Login con el aviso «Sesión cerrada.» | Ninguno |
| `disabled` | «La consola no está activa.» sin formulario | Ninguno |
| `unavailable` | «No pudimos contactar la API.» y botón «Reintentar» | Ninguno |
| `authenticated` | Consola completa | Sesión, resumen, lista, detalle |

Reglas:

- **Nada sensible antes de confirmar.** El HTML estático de `/consola` solo trae el texto de
  `checking`. Las zonas de datos se montan solo en `authenticated`.
- **Cualquier 401** de una ruta protegida pasa a `expired`. El cliente se envuelve con
  `withUnauthorizedHandler` (sección 5) para que ningún componente tenga que acordarse.
- **Al salir de `authenticated` se desmonta todo el árbol de datos.** Los datos viven en estado de
  React de esos componentes, así que desmontarlos los borra; además se abortan las peticiones en
  curso con su `AbortController`.
- **Se conserva la ruta.** El login se pinta en la misma URL (`/consola?…`), sin redirigir. Al entrar
  de nuevo, la consola lee los mismos parámetros y vuelve a la misma conversación y filtros. La URL
  solo lleva filtros y un id opaco, nada sensible.
- **Salir** (`POST /logout`): pase lo que pase con la petición, el estado pasa a `signedOut` y la URL
  se reemplaza por `/consola` sin parámetros.
- **Corte de inactividad en el cliente:** si pasan 30 min sin ninguna petición autenticada correcta,
  la consola pasa a `expired` sin preguntar al servidor (la sesión ya murió allí). Se comprueba cada
  60 s y en cada `visibilitychange` a visible. Así una pestaña olvidada no deja conversaciones en
  pantalla.

### 4.4 Estado en la URL

La única ruta es `/consola`. Los filtros y la conversación abierta van en la búsqueda:

| Parámetro | Valores | Por defecto | Inválido |
|---|---|---|---|
| `mes` | `AAAA-MM`, dentro de los últimos 12 meses | mes actual en `America/Guayaquil` | se ignora |
| `tenant` | un id de `Sesion.tenants` | todos | se ignora |
| `canal` | `web`, `whatsapp` | ambos | se ignora |
| `listas` | `1` | sin filtrar | se ignora |
| `c` | id que cumple `^[A-Za-z0-9_-]{1,64}$` | ninguna abierta | se ignora |

- Se lee con `useSearchParams()` y se escribe con `router.replace('/consola?…', { scroll: false })`.
  Siempre `replace`, nunca `push`: el historial no se llena de filtros.
- Un parámetro con el valor por defecto no se escribe (la URL limpia es `/consola`).
- Cambiar `mes`, `tenant`, `canal` o `listas` reinicia la lista (sin cursor) y conserva `c`.

### 4.5 Dónde viven los datos

- **No se usa Zustand ni ningún almacenamiento** (`localStorage`, `sessionStorage`, IndexedDB) para
  datos de la consola. Un store global sobrevive a la navegación del cliente y el almacenamiento
  sobrevive al cierre; los datos de conversaciones no deben hacer ninguna de las dos cosas.
- Cada zona guarda sus datos con `useState`/`useReducer` y los pide con `useEffect` + `AbortController`.
  Si los parámetros cambian antes de que llegue la respuesta, la petición anterior se aborta y su
  resultado se descarta (respuesta tardía nunca pisa una más nueva).
- El cliente de API llega a los componentes por un contexto (`ConsoleApiContext`) para que las pruebas
  inyecten uno falso.
- La base de la API se mueve de `shared/components/ui/chat/api.ts` a `shared/lib/apiUrl.ts`
  (`export const API_URL`), y el chat la importa de ahí. Así la consola no depende del chat.

### 4.6 Módulos

```
frontend/
├── app/consola/page.tsx                 # metadatos noindex + <Suspense><ConsoleApp/></Suspense>
├── shared/
│   ├── constants/site.ts                # + CONSOLE_PATH
│   ├── lib/apiUrl.ts                    # API_URL (movido desde chat/api.ts)
│   └── components/{layout/Header,layout/Footer,ui/chat/ChatLauncher}.tsx   # null en /consola
└── features/consola/
    ├── index.ts                         # export { ConsoleApp, ConsoleBootFallback }
    ├── types.ts                         # tipos de dominio (sección 5.1)
    ├── copy.ts                          # todo el texto visible, en español
    ├── api/
    │   ├── client.ts                    # createConsoleApi, withUnauthorizedHandler (sección 5.2)
    │   ├── wire.ts                      # tipos JSON del contrato y su validación
    │   ├── ConsoleApiContext.tsx        # proveedor y useConsoleApi()
    │   └── client.test.ts
    ├── lib/
    │   ├── format.ts                    # meses, días, horas, cifras, costo, contacto seguro
    │   ├── format.test.ts
    │   ├── month.ts                     # currentMonth, lastTwelveMonths, isMonthKey, daysInMonth
    │   └── month.test.ts
    ├── hooks/
    │   ├── useConsoleSession.ts         # máquina de estados de 4.3 + corte de inactividad
    │   ├── useConsoleSession.test.tsx
    │   ├── useConsoleParams.ts          # lectura/escritura de 4.4
    │   ├── useConsoleParams.test.tsx
    │   ├── useInboxKeyboard.ts          # j/k/flechas/Enter/Esc/g r
    │   └── useIsDesktop.ts              # useMediaQuery('(min-width: 1024px)')
    ├── components/
    │   ├── ConsoleApp.tsx               # proveedor de API + guardia + pantallas según estado
    │   ├── ConsoleBootFallback.tsx      # texto de «Comprobando sesión…»
    │   ├── LoginForm.tsx (+ .test.tsx)
    │   ├── ConsoleScreen.tsx            # cabecera de la consola + tres zonas + reparto móvil
    │   ├── ConsoleHeader.tsx            # «Consola», usuario, «Salir»
    │   ├── MonthSummary.tsx (+ .test.tsx)   # franja de cifras y selector de mes
    │   ├── DailyChart.tsx (+ .test.tsx)     # regla de chats por día
    │   ├── InboxFilters.tsx
    │   ├── Inbox.tsx (+ .test.tsx)          # lista, filtros, «Cargar más», teclado
    │   ├── InboxRow.tsx
    │   ├── ConversationReader.tsx (+ .test.tsx)
    │   ├── SignalList.tsx
    │   └── ZoneStatus.tsx               # carga, vacío y error de una zona
    ├── testing/
    │   ├── fixtures.ts                  # datos falsos para pruebas (mismos criterios que el simulado)
    │   └── fakeApi.ts                   # ConsoleApi en memoria con respuestas programables
    └── brand.test.ts                    # revisión estática de marca (tarea 6.2)
```

Reglas de dependencia: `features/consola` usa `shared/`; nada de `shared/` importa de
`features/consola`; ninguna otra feature la importa.

## 5. Cliente de API tipado

Se copia tal cual a `frontend/features/consola/`. Los tipos de dominio están en inglés; los del
contrato (`wire.ts`) en español porque son el JSON.

### 5.1 `types.ts`

```ts
export type Channel = 'web' | 'whatsapp';
/** 'YYYY-MM' in America/Guayaquil. */
export type MonthKey = string;

export interface Tenant {
  id: string;
  name: string;
}

export interface SessionInfo {
  user: string;
  tenants: Tenant[];
}

export interface LoginCredentials {
  user: string;
  password: string;
  /** Exactly 6 digits. */
  code: string;
}

export interface SummaryTotals {
  conversations: number;
  replies: number;
  costUsd: number;
  readyForCall: number;
}

export interface DailyCount {
  /** 'YYYY-MM-DD' in America/Guayaquil. */
  day: string;
  conversations: number;
}

export interface MonthSummary {
  month: MonthKey;
  totals: SummaryTotals;
  days: DailyCount[];
}

export interface SummaryQuery {
  month: MonthKey;
  tenantId?: string;
  channel?: Channel;
}

export interface ConversationSummary {
  id: string;
  tenantId: string;
  channel: Channel;
  contact: string;
  /** ISO 8601 UTC. */
  createdAt: string;
  lastActivityAt: string;
  turns: number;
  signalsReached: number;
  signalsTotal: number;
  readyForCall: boolean;
}

export interface ConversationPage {
  items: ConversationSummary[];
  /** Opaque; null when there are no more pages. */
  nextCursor: string | null;
}

export interface ConversationQuery {
  month: MonthKey;
  tenantId?: string;
  channel?: Channel;
  readyOnly?: boolean;
  cursor?: string;
  limit?: number;
}

export type Speaker = 'visitor' | 'assistant';

export interface Message {
  speaker: Speaker;
  text: string;
  at: string;
}

export interface Signal {
  key: string;
  label: string;
  reached: boolean;
}

export interface ConversationDetail {
  id: string;
  tenantId: string;
  channel: Channel;
  contact: string;
  createdAt: string;
  lastActivityAt: string;
  turns: number;
  readyForCall: boolean;
  language: 'es' | 'en' | null;
  signals: Signal[];
  messages: Message[];
}

export type ConsoleErrorKind =
  | 'unauthorized'     // 401
  | 'forbidden'        // 403
  | 'not_found'        // 404
  | 'invalid_request'  // 400, 405, 422
  | 'rate_limited'     // 429
  | 'server'           // 5xx and any other non-2xx
  | 'timeout'          // no answer within REQUEST_TIMEOUT_MS
  | 'network'          // fetch rejected (offline, DNS, CORS)
  | 'aborted'          // the caller aborted; ignore the result
  | 'bad_response';    // 2xx whose body does not match the contract

export interface ConsoleError {
  kind: ConsoleErrorKind;
  status: number | null;
  /** detail.codigo from the body, when present. */
  code: string | null;
  /** Only for rate_limited: detail.reintentar_en, else Retry-After, else 60. */
  retryAfterSeconds: number | null;
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ConsoleError };
```

### 5.2 `api/client.ts`

```ts
import { API_URL } from '@/shared/lib/apiUrl';
import type {
  ApiResult, ConversationDetail, ConversationPage, ConversationQuery,
  LoginCredentials, MonthSummary, SessionInfo, SummaryQuery,
} from '../types';

export const REQUEST_TIMEOUT_MS = 15_000;
export const DEFAULT_RETRY_AFTER_SECONDS = 60;
export const CONVERSATION_ID = /^[A-Za-z0-9_-]{1,64}$/;

export interface ConsoleApi {
  getSession(signal?: AbortSignal): Promise<ApiResult<SessionInfo>>;
  login(credentials: LoginCredentials, signal?: AbortSignal): Promise<ApiResult<SessionInfo>>;
  logout(signal?: AbortSignal): Promise<ApiResult<null>>;
  getSummary(query: SummaryQuery, signal?: AbortSignal): Promise<ApiResult<MonthSummary>>;
  listConversations(query: ConversationQuery, signal?: AbortSignal): Promise<ApiResult<ConversationPage>>;
  getConversation(id: string, signal?: AbortSignal): Promise<ApiResult<ConversationDetail>>;
}

export interface ConsoleApiOptions {
  /** Defaults to `${API_URL}/console/api`. */
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

export function createConsoleApi(options?: ConsoleApiOptions): ConsoleApi;

/** Calls onUnauthorized on every 401 except the one from login(). */
export function withUnauthorizedHandler(api: ConsoleApi, onUnauthorized: () => void): ConsoleApi;
```

Comportamiento obligatorio de `createConsoleApi` (cada punto tiene su prueba en `client.test.ts`):

1. Toda petición usa `credentials: 'include'` y `cache: 'no-store'`.
2. `GET` sin cabeceras propias (sin preflight). `POST` con `Content-Type: application/json` y cuerpo
   JSON (`{}` en logout). El login envía `{ usuario, clave, codigo }`.
3. Query string: `mes` siempre; `tenant`, `canal` y `cursor` solo si vienen; `listas=1` solo si
   `readyOnly`; `limite` solo si viene. Valores con `URLSearchParams`.
4. `getConversation` rechaza sin llamar a la red un id que no cumple `CONVERSATION_ID`
   (`invalid_request`) y codifica el id con `encodeURIComponent`.
5. Timeout con `AbortController` propio a `timeoutMs`; si además llega `signal` del llamador, abortar
   el uno aborta la petición. Abortado por timeout → `timeout`; por el llamador → `aborted`.
6. `fetch` rechazado sin abortar → `network`.
7. Estado → `kind` según la tabla de `ConsoleErrorKind`. `code` sale de `detail.codigo` si el cuerpo es
   JSON con esa forma; si no, `null`. En 429, `retryAfterSeconds` = `detail.reintentar_en` →
   `Retry-After` (entero) → `DEFAULT_RETRY_AFTER_SECONDS`.
8. 2xx: el cuerpo se valida con las funciones de `wire.ts` (comprobaciones de `typeof`, enumerados y
   enteros ≥ 0) y se convierte a los tipos de dominio. Si no cumple → `bad_response`. `logout` acepta
   204 o 200 sin mirar el cuerpo.
9. Nunca lanza: toda salida es un `ApiResult`.

### 5.3 `api/wire.ts`

```ts
export interface WireSession { usuario: string; tenants: { id: string; nombre: string }[] }

export interface WireSummary {
  mes: string;
  totales: { conversaciones: number; respuestas: number; costo_usd: number; listas_para_llamada: number };
  por_dia: { dia: string; conversaciones: number }[];
}

export interface WireConversationSummary {
  id: string;
  tenant: string;
  canal: 'web' | 'whatsapp';
  contacto: string;
  creada: string;
  ultima_actividad: string;
  turnos: number;
  senales_alcanzadas: number;
  senales_total: number;
  lista_para_llamada: boolean;
}

export interface WirePage { elementos: WireConversationSummary[]; siguiente: string | null }

export interface WireConversationDetail
  extends Omit<WireConversationSummary, 'senales_alcanzadas' | 'senales_total'> {
  idioma: 'es' | 'en' | null;
  senales: { clave: string; nombre: string; alcanzada: boolean }[];
  mensajes: { rol: 'visitante' | 'asistente'; texto: string; momento: string }[];
}

export interface WireError { detail: { codigo: string; mensaje: string; reintentar_en?: number } }

export function parseSession(body: unknown): SessionInfo | null;
export function parseSummary(body: unknown): MonthSummary | null;
export function parsePage(body: unknown): ConversationPage | null;
export function parseDetail(body: unknown): ConversationDetail | null;
export function parseError(body: unknown): { code: string | null; retryAfterSeconds: number | null };
```

Sin librerías de validación nuevas: comprobaciones a mano, como hace `chat/api.ts`.

### 5.4 `lib/format.ts` y `lib/month.ts`

```ts
export const CONSOLE_TIME_ZONE = 'America/Guayaquil';
export const CONSOLE_LOCALE = 'es-EC';

export function formatMonth(month: MonthKey): string;            // '2026-10' → 'octubre 2026'
export function formatDay(day: string): string;                  // '2026-10-12' → '12 oct'
export function formatDateTime(iso: string): string;             // → '12 oct · 10:04' (hora local Guayaquil, 24 h)
export function formatTime(iso: string): string;                 // → '10:04'
export function formatCount(value: number): string;              // 1234 → '1.234'
export function formatCost(value: number): string;               // 1.8432 → '1,84'; 0.004 → '< 0,01'; 0 → '0,00'
export function safeContact(contact: string): string;            // ver abajo

export function currentMonth(now?: Date): MonthKey;              // en America/Guayaquil
export function lastTwelveMonths(now?: Date): MonthKey[];        // el actual primero
export function isMonthKey(value: string): boolean;
export function daysInMonth(month: MonthKey): string[];          // ['2026-10-01', …, '2026-10-31']
```

- Todo formateo usa `Intl` con `CONSOLE_LOCALE` y `timeZone: CONSOLE_TIME_ZONE`, nunca la zona del
  navegador. Las pruebas fijan la hora con `vi.setSystemTime`.
- `safeContact` es una defensa de más: si el contacto, quitando espacios y signos, contiene 7 o más
  dígitos seguidos, devuelve `Contacto oculto` en lugar del texto. El motor ya enmascara; esto evita
  que un error del motor muestre un número completo.

## 6. Experiencia (UX y UI)

**Principio.** La marca prohíbe tarjetas, sombras, degradados, íconos de adorno y más de un acento.
El diseño es editorial: tipografía, ritmo, líneas finas y espacio. Lo atractivo sale de la jerarquía
y el detalle, no de la decoración.

**Tema.** La consola no fija colores: usa solo los tokens de `app/globals.css` (`--papel`, `--arena`,
`--tinta`, `--tinta-media`, `--regla`, `--marca`, `--boton`, `--sobre-boton`), que ya tienen valor en
claro y oscuro. Sigue el tema que el visitante tenga guardado o el del sistema. No muestra selector de
tema (el encabezado de la landing está oculto). Los contrastes están medidos en ambos temas (sección
7).

**Sistema visual.** Papel de fondo, Arena para la fila seleccionada, Tinta y Tinta media para texto,
Regla para las líneas, Petróleo (`--marca`) como único acento. Bricolage Grotesque (`font-display`)
para el título, Geist para texto, Geist Mono (`tabular` / `font-mono`) para cifras, horas y etiquetas.
Alineado a la izquierda, sin centrar nada salvo el login.

### 6.1 Cabecera de la consola

Una línea fina inferior (`--regla`). A la izquierda «Consola» en `font-display`; a la derecha el
usuario en mono pequeño y un botón de texto «Salir» (`.link`). Sin logo.

### 6.2 Escritorio (≥ 1024 px): una vista en tres zonas

La página ocupa el alto de la ventana (`h-dvh`, cabecera y franja fijas arriba); la bandeja y el
lector tienen su propio desplazamiento vertical y son regiones con nombre (`<section aria-label>`,
`tabIndex={0}` en el contenedor que desplaza para que el teclado pueda bajar).

1. **Franja de cifras** (arriba, `<section aria-labelledby>` con título visible «Resumen de
   {mes}»). Cuatro cifras en una `<dl>`: `<dt>` en mono mayúsculas (*CHATS*, *RESPUESTAS*,
   *COSTO (USD)*, *LISTOS PARA LLAMADA*) y `<dd>` en Geist Mono grande. A la derecha, el selector de
   mes: `<select>` nativo con `<label>` «Mes» y los últimos 12 meses (`formatMonth`), el actual
   primero. Las cifras respetan los filtros de tenant y canal (el resumen se pide con ellos); bajo
   la `<dl>` se nombra el filtro activo («AIworks · WhatsApp») o «Todos los tenants y canales».
2. **Regla de chats por día** bajo las cifras: una línea base de 1 px `--regla` y, por cada día del
   mes (28 a 31 posiciones fijas, aunque el día no haya llegado), una marca vertical de 2 px en
   `--marca` cuya altura es proporcional al máximo del mes (máx. 48 px). Un día con 0 no tiene marca.
   Es un gráfico, no adorno. Accesible así:
   - el contenedor es `role="group"`, `aria-label="Chats por día de {mes}"`, `tabIndex={0}`;
   - las flechas izquierda y derecha mueven el día marcado; `Home`/`End` van al primero y al último;
   - el ratón sobre una marca hace lo mismo;
   - una línea de lectura bajo la regla (`<p aria-live="polite">`, mono) dice «12 oct · 4 chats»;
     sin día marcado dice «Día con más chats: 12 oct · 7».
   Sin cuadros flotantes ni tooltips.
3. **Bandeja** (columna izquierda, 38 %). Arriba, los filtros: `<select>` «Tenant» (Todos + los de
   `Sesion.tenants`), `<select>` «Canal» (Todos, Web, WhatsApp) y un `<input type="checkbox">`
   «Solo listos para llamada». Debajo, la lista: `<ul aria-label="Conversaciones">`, cada `<li>` con
   un `<button type="button">` de ancho completo, filas separadas por 1 px `--regla`, sin cajas.
   Cada fila:
   - línea 1, mono pequeño: fecha y hora de creación (`formatDateTime`), nombre del tenant y canal
     (`WEB` / `WHATSAPP`) en texto;
   - línea 2: contacto (`safeContact`) en Geist;
   - a la derecha, mono: `{turnos} turnos` y `{alcanzadas}/{total}` con `aria-label="{alcanzadas} de
     {total} señales"`; si `readyForCall`, la palabra «Listo para llamada» en `--marca`.
   - La fila seleccionada tiene fondo `--arena`, una regla izquierda de 2 px `--marca` (la selección
     no depende solo del color de fondo) y `aria-current="true"`.
   Al final de la lista, si `nextCursor` no es `null`, un botón «Cargar más» (`.action-outline`). No
   hay desplazamiento infinito.
4. **Lector** (columna derecha). Cabecera: contacto en `font-display`, y en mono tenant, canal,
   idioma («ES», «EN» o «—») y `{turnos} turnos`. La conversación es un diálogo tipográfico, sin
   burbujas: `<ol>` de mensajes; cada uno con etiqueta mono `VISITANTE` o `ASISTENTE` y la hora
   (`formatTime`); el texto en Geist con `white-space: pre-wrap` y `overflow-wrap: anywhere`. Los
   mensajes del asistente llevan una regla vertical de 2 px `--marca` a la izquierda. Al pie,
   «Señales» como `<ul>` de líneas: nombre y estado en texto («Alcanzada» en `--marca` /
   «Pendiente» en `--tinta-media`), no solo color. Sin conversación elegida: «Elija una conversación
   de la bandeja.» en `--tinta-media`.
   - Al cambiar de conversación, el cuerpo del lector entra con un desvanecido de opacidad de 120 ms,
     solo dentro de `@media (prefers-reduced-motion: no-preference)`.

### 6.3 Móvil (< 1024 px)

Una sola columna: cabecera, franja de cifras compacta (cifras en dos por dos, regla debajo),
filtros y bandeja. Al elegir una fila (clic o `Enter`), la bandeja y la franja se ocultan y el lector
ocupa la pantalla con un botón «Volver» arriba a la izquierda (`.link`, con texto, sin ícono de
adorno). «Volver» o `Esc` quitan `c` de la URL, vuelven a la bandeja y devuelven el foco a la fila de
esa conversación. El reparto se decide en JS con `useIsDesktop()` (no solo con clases `lg:`), para que
las pruebas puedan comprobarlo con un `matchMedia` falso. Antes de hidratar, `useMediaQuery` da
`false`, pero en ese momento la consola aún está en `checking`, así que no hay salto visible de
datos.

### 6.4 Teclado

Escuchado en el contenedor de la consola; se ignora si el foco está en un `input`, `select` o
`textarea`, o si hay `Ctrl`, `Meta` o `Alt`.

| Tecla | Escritorio | Móvil |
|---|---|---|
| `j` / `↓` (con foco en la bandeja) | Selecciona la fila siguiente, la abre en el lector y mueve el foco a ella | Mueve el foco y la selección a la fila siguiente |
| `k` / `↑` (con foco en la bandeja) | Igual, hacia arriba | Igual, hacia arriba |
| `Enter` / `Espacio` sobre una fila | Abre la fila y mueve el foco al lector | Abre el lector a pantalla completa y mueve el foco a su título |
| `Esc` | Con el foco en el lector, lo devuelve a la fila seleccionada | Cierra el lector (como «Volver») |
| `g` y luego `r` (en menos de 1 s) | Mueve el foco al título «Resumen de {mes}» | Igual |

En la primera y la última fila, `k` y `j` no hacen nada (no dan la vuelta). La fila con foco y la
seleccionada son la misma. En escritorio, la petición del detalle anterior se aborta al pasar a otra
fila, así que bajar rápido con `j` no apila respuestas.

### 6.5 Login

Una columna centrada de 22 rem sobre `--papel`, sin caja: título «Consola» en `font-display` y un
`<form>` con tres campos, cada uno con `<label>` visible:

| Campo | Atributos |
|---|---|
| Usuario | `autoComplete="username"`, `autoFocus`, `required` |
| Clave | `type="password"`, `autoComplete="current-password"`, `required` |
| Código | `inputMode="numeric"`, `autoComplete="one-time-code"`, `pattern="[0-9]{6}"`, `maxLength={6}`, `required` |

- Los campos tienen solo una línea inferior de 1 px `--tinta-media` (contraste 6,5:1 con el papel;
  la `--regla` no llega al 3:1 que piden los bordes de un control). El foco usa el mismo contorno de
  2 px `--marca` que el resto del sitio, que hoy no cubre `input` ni `select` y hay que añadirlo.
- El código descarta lo que no sea dígito. Al llegar a 6 dígitos con usuario y clave no vacíos, el
  formulario se envía solo, una vez. El botón «Entrar» (`.action .action-primary`) envía también.
- Mientras se envía: campos y botón deshabilitados y el botón dice «Entrando…».
- 401: aviso único «Usuario, clave o código incorrectos.» (`role="alert"`), se vacía solo el código y
  el foco vuelve al campo Código. No se dice cuál dato falló.
- 429: «Demasiados intentos. Podrá intentar de nuevo en m:ss.» con cuenta atrás de un segundo desde
  `retryAfterSeconds`. Formulario deshabilitado hasta llegar a 0; entonces el aviso desaparece. El
  aviso se anuncia una vez (`role="alert"` al aparecer), no cada segundo.
- 403, 5xx, red o timeout: «No pudimos iniciar sesión. Intente de nuevo.» (`role="alert"`).
- 200: la sesión pasa a `authenticated` con los datos de la respuesta (no repite `GET /yo`).

### 6.6 Estados de cada zona

Las tres zonas (resumen, bandeja, lector) usan `ZoneStatus`:

| Estado | Qué se ve | Accesibilidad |
|---|---|---|
| Cargando | Esqueleto: 3 a 6 líneas estáticas de color `--regla`, sin brillo ni animación | La zona lleva `aria-busy="true"` y un texto `sr-only` «Cargando…» |
| Vacío | Resumen: «Sin datos en {mes}.» · Bandeja: «Aún no hay conversaciones en {mes}.» y, con filtros, «… con estos filtros: {lista}.» más el botón «Quitar filtros» | Texto normal |
| Error | Texto según el error (abajo) y botón «Reintentar», salvo en 429 que muestra la espera | `role="alert"` |
| Detalle no encontrado | Lector: «Esta conversación ya no existe. Puede haberse borrado por antigüedad.» | `role="alert"` |
| Sesión caducada | Toda la consola se desmonta y aparece el login (4.3) | El aviso del login es `role="alert"` |

Textos de error por `kind`: `timeout` «La API tardó demasiado en responder.»; `network` «No hay
conexión con la API.»; `server` y `bad_response` «La API devolvió un error.»; `rate_limited`
«Demasiadas peticiones. Espere {n} s.» (el botón «Reintentar» aparece al terminar la espera);
`forbidden` y `invalid_request` «No se pudo completar la petición.». Un `invalid_request` con
`cursor_invalido` no se muestra: la bandeja se recarga desde el principio una vez.

«Cargar más» con error muestra el error debajo de la lista, sin borrar las filas ya cargadas.

### 6.7 Privacidad en pantalla

Teléfonos siempre enmascarados (y `safeContact` como red). La ruta lleva `noindex`, no está en el
sitemap ni se enlaza desde la landing, y las capturas de pantalla no deben salir a la carpeta
compartida (`docs/politicas.md`). Nada de la consola se guarda en el navegador.

## 7. Accesibilidad y marca

Contrastes de los pares que usa la consola, calculados con la fórmula de WCAG 2.x sobre los tokens de
`globals.css`:

| Par (texto o control / fondo) | Claro | Oscuro | Mínimo |
|---|---|---|---|
| Tinta / Papel | 16,2 | 15,6 | 4,5 |
| Tinta / Arena (fila seleccionada) | 14,9 | 14,5 | 4,5 |
| Tinta media / Papel | 6,6 | 7,4 | 4,5 |
| Tinta media / Arena | 6,0 | 6,9 | 4,5 |
| Petróleo / Papel | 6,2 | 9,1 | 4,5 |
| Petróleo / Arena («Listo» en la fila seleccionada) | 5,7 | 8,5 | 4,5 |
| Sobre-botón / Botón | 6,7 | 8,5 | 4,5 |
| Línea de campo (Tinta media) / Papel | 6,6 | 7,4 | 3 |
| Contorno de foco (Petróleo) / Papel | 6,2 | 9,1 | 3 |
| Regla / Papel (solo separadores, no controles) | 1,3 | 1,3 | — |

Reglas que revisa la tarea 6.2:

- Sin `box-shadow`, `shadow-*`, `gradient`, `bg-gradient-*` ni `drop-shadow` en `features/consola`.
- Sin colores fijos: ni hex ni `rgb(` en los componentes, ni clases de la paleta por defecto de
  Tailwind (`text-gray-500`, `bg-white`, `border-slate-200`…). Solo tokens (`var(--…)` o las clases
  `text-tinta`, `bg-papel`, `border-regla`, `text-marca`…).
- Sin íconos de adorno: `lucide-react` no se usa en la consola.
- Todo control tiene nombre accesible (etiqueta visible o `aria-label`); foco visible de 2 px
  `--marca` en `a`, `button`, `input`, `select` y `[tabindex]`.
- `lang="es"` ya lo pone el layout raíz.
- Animación única: el desvanecido de 120 ms del lector, solo con `prefers-reduced-motion:
  no-preference`, solo `opacity`.
- Clases nuevas, si hacen falta, en `@layer components` de `globals.css` con prefijo `console-`
  (`console-field`, `console-fade`).

## 8. Pruebas

### 8.1 Herramientas (decisión)

`frontend/package.json` no tiene ninguna herramienta de pruebas. Se añaden como `devDependencies`:

| Paquete | Para qué |
|---|---|
| `vitest` (3.x) | Corredor; usa el mismo esbuild que ya entiende TS/JSX |
| `jsdom` | DOM en Node |
| `@testing-library/react` (16.x, compatible con React 19) | Montar componentes y consultar por rol/etiqueta |
| `@testing-library/user-event` (14.x) | Teclado y clics realistas |
| `@testing-library/jest-dom` (6.x) | `toBeInTheDocument`, `toHaveAttribute`, … |
| `@vitejs/plugin-react` | JSX automático de React en Vitest |

Las versiones exactas las fija `package-lock.json` en el momento de instalar. No se añade MSW: el
cliente acepta `fetchImpl` y los componentes reciben un `ConsoleApi` falso por contexto.

Archivos:

- `frontend/vitest.config.mts`: `environment: 'jsdom'`, `setupFiles: ['./vitest.setup.ts']`,
  `include: ['features/**/*.test.{ts,tsx}', 'shared/**/*.test.{ts,tsx}']`, alias `@` → raíz de
  `frontend/` (como `tsconfig.json`), `plugins: [react()]`.
- `frontend/vitest.setup.ts`: `import '@testing-library/jest-dom/vitest'`, `cleanup()` tras cada
  prueba y un `window.matchMedia` falso controlable (`setViewport('desktop' | 'mobile')`).
- Scripts: `"test": "vitest run"` y `"test:watch": "vitest"`.
- CI: en `.github/workflows/deploy.yml`, un paso `npm test` (en `frontend/`) entre «Install
  dependencies» y «Build». Si una prueba falla, no se publica.
- `next build` hace la comprobación de tipos de todo `**/*.ts(x)`: las pruebas deben compilar con
  `strict`.

### 8.2 Qué se prueba

Cada escenario de `specs/admin-console/spec.md` marcado **[landing]** tiene una prueba con su nombre.
Las comprobaciones sobre el build (`noindex`, sitemap, sin encabezado) van en
`scripts/verify-landing.sh` como un bloque nuevo «Requirement: hidden console», porque solo se ven en
`out/`.

## 9. Servidor simulado (`scripts/mock-console-api.mjs`)

Mismo estilo que `scripts/mock-chat-api.mjs`: Node puro, sin dependencias, un archivo.

- **Arranque:** `node scripts/mock-console-api.mjs [puerto]` (por defecto 8000, o `MOCK_PORT`).
  Escucha en `127.0.0.1`. Ocupa el mismo puerto que el simulado del chat porque el frontend tiene una
  sola `NEXT_PUBLIC_API_URL`; no se usan a la vez. Opciones por variable de entorno:
  `MOCK_IDLE_SECONDS` (inactividad, por defecto 1800), `MOCK_DISABLED=1` (todo 404: consola apagada),
  `MOCK_EMPTY=1` (sin ninguna conversación ni cifra).
- **Rutas:** las seis de la sección 1, con las mismas formas, códigos y cuerpo de error. Todo lo
  demás, 404 `no_encontrada`. Métodos distintos de `GET`/`POST`/`OPTIONS` en rutas existentes, 405.
- **Credenciales falsas:** usuario `demo`, clave `consola-demo`, código `123456`. Cualquier otra
  combinación, 401 `credenciales_invalidas`. El simulado no comprueba reutilización del código.
- **Bloqueo:** 5 fallos desde el arranque (o desde el último bloqueo) dan 429 `bloqueado` con
  `reintentar_en: 60` durante 60 s. Usuario `bloqueado` da 429 al instante con `reintentar_en: 90`.
- **Cookie:** `consola_dev=<uuid>; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200` (sin `Secure` por
  ser `http`). Sesiones en un `Map` en memoria con su última actividad; caducan con
  `MOCK_IDLE_SECONDS`.
- **CORS:** si `Origin` es local (`http://127.0.0.1:<puerto>` o `http://localhost:<puerto>`), lo
  devuelve exacto con `Access-Control-Allow-Credentials: true`,
  `Access-Control-Allow-Methods: GET, POST`, `Access-Control-Allow-Headers: Content-Type`,
  `Access-Control-Expose-Headers: Retry-After`, `Access-Control-Max-Age: 600` y `Vary: Origin`.
  `POST` sin `Content-Type: application/json` o con un `Origin` no local: 403 `origen_no_permitido`.
  Si el host del `Origin` no coincide con el de la petición (`localhost` contra `127.0.0.1`), escribe
  en la consola un aviso: «la cookie no viajará: abra la landing en http://127.0.0.1:3000».
- **Latencia:** 400 ms en cada respuesta.
- **Datos:** generados al arrancar con un generador pseudoaleatorio de semilla fija (mismos datos en
  cada arranque), relativos a la fecha actual en `America/Guayaquil`:
  - Tenants: `aiworks` («AIworks»), `demo-panaderia` («Panadería Sol»), `demo-taller` («Taller
    Ejemplo», sin conversaciones: sirve para el vacío con filtro), `demo-limite` («Tenant de prueba
    429»).
  - Mes actual: 45 conversaciones repartidas entre `aiworks` y `demo-panaderia`, web y WhatsApp, de
    2 a 12 mensajes, unas 6 listas para llamada. Una de ellas con 40 mensajes y un mensaje de 1.500
    caracteres con saltos de línea y una URL (para probar `pre-wrap`, el desplazamiento y que no se
    enlaza).
  - Mes anterior: el resumen trae cifras pero la lista viene vacía (simula un mes ya purgado).
  - Hace dos meses: `GET /resumen` responde 500. Hace tres meses: `GET /resumen` tarda 20 s
    (supera el timeout de 15 s). Meses más viejos: cifras en cero y lista vacía.
  - Contactos de WhatsApp enmascarados de números claramente falsos (`+593 ••• ••• 000` a
    `+593 ••• ••• 099`, salidos de `+593 99 000 00xx`); contactos web `web · ` más 6 caracteres
    hexadecimales. Textos inventados sobre horarios, precios de pan y citas de taller. Ningún nombre de
    persona real ni teléfono real.
  - Conversaciones con id especial al principio del mes actual: `c_caduca` (su detalle responde 401 y
    borra la sesión), `c_falla` (500), `c_lenta` (20 s), `c_purgada` (404 `no_encontrada`) y
    `c_numero` (su `contacto` trae `+593 99 000 0000` completo, para ver que `safeContact` lo oculta).
  - `tenant=demo-limite` en `/conversaciones` o `/resumen`: 429 `demasiadas_peticiones` con
    `reintentar_en: 30`.
  - `limite` por defecto 20 en el simulado, para que «Cargar más» aparezca con los datos del mes
    actual. Cursor: el desplazamiento y un hash de los filtros en base64url; con otros filtros, 422
    `cursor_invalido`.
- **Documentación:** el encabezado del archivo lista rutas, credenciales y atajos, y la sección «Chat
  de la web» del `CLAUDE.md` raíz gana un apartado «Consola» con el mismo resumen:

```bash
node scripts/mock-console-api.mjs        # http://127.0.0.1:8000
cd frontend && npm run dev               # abrir http://127.0.0.1:3000/consola (no localhost)
# entrar con demo / consola-demo / 123456
```

## 10. Operación (motor)

- `scripts/console_setup.py` pide la clave por la terminal, imprime el hash y genera el secreto TOTP
  junto con su URI `otpauth://` para el autenticador. No escribe archivos ni registra la clave.
- El `Caddyfile` añade `/console/*` a las rutas públicas; `/admin/*` sigue devolviendo 404.
- El CORS con credenciales se limita a `/console/*` y al origen `CONSOLE_ALLOWED_ORIGIN`.
- Una entrada nueva en `docs/caminos/` con el procedimiento de alta y de recuperación del autenticador.
