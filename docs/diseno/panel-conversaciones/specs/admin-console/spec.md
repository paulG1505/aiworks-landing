# Spec Delta

Sin spec vigente: `specs/` está vacío en el momento del diseño (2026-10-12). Todo es `ADDED`.
Revisada el 2026-10-13 (ver `analisis.md`): cada escenario es comprobable con un dato concreto y
lleva la marca del repo que lo prueba.

- **[motor]**: prueba automática en `productos/asistente` (pytest).
- **[landing]**: prueba de componente en este repo (Vitest), con el nombre del escenario como nombre
  de la prueba, salvo que diga **[build]**: entonces es un bloque de `scripts/verify-landing.sh`
  sobre `frontend/out`.

Las formas JSON, códigos y textos citados son los de `design.md`, secciones 1 y 6.

## ADDED Requirements

### Requirement: Consola apagada por defecto
Where `CONSOLE_USER` o `CONSOLE_PASSWORD_HASH` no están definidos, el sistema shall responder 404 en todas las rutas `/console/api`.

#### Scenario: Sin configuración [motor]
- **GIVEN** un servidor sin `CONSOLE_USER` ni `CONSOLE_PASSWORD_HASH`
- **WHEN** se pide `GET /console/api/yo` y `POST /console/api/login` con credenciales cualesquiera
- **THEN** ambas respuestas son 404 y `consola_sesiones` sigue con 0 filas

#### Scenario: La interfaz con la consola apagada [landing]
- **GIVEN** un `ConsoleApi` falso cuyo `getSession` devuelve `not_found`
- **WHEN** se monta `ConsoleApp`
- **THEN** se ve el texto «La consola no está activa.» y no hay ningún campo de formulario

### Requirement: Login con contraseña y TOTP
When llega `POST /console/api/login` con usuario, clave y código válidos, el sistema shall crear una sesión y fijarla en una cookie `__Host-consola` con `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/` y sin `Domain`.

#### Scenario: Credenciales correctas [motor]
- **GIVEN** la consola configurada con usuario `paul`, un hash de clave conocido y un secreto TOTP conocido
- **WHEN** se envía `{"usuario":"paul","clave":<la clave>,"codigo":<TOTP del paso actual>}` con `Origin: https://aiworks.lat`
- **THEN** la respuesta es 200 con cuerpo `{"usuario":"paul","tenants":[…]}`, la cabecera `Set-Cookie` empieza por `__Host-consola=`, contiene `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/`, `Max-Age=43200` y no contiene `Domain`, y `consola_sesiones` tiene 1 fila cuyo `token_hash` es el SHA-256 del valor de la cookie

#### Scenario: Un dato incorrecto [motor]
- **GIVEN** la misma configuración
- **WHEN** se hacen tres logins: usuario inexistente, clave incorrecta y código incorrecto (cada uno con los otros dos datos correctos)
- **THEN** los tres responden 401 con el mismo cuerpo exacto (`detail.codigo` = `credenciales_invalidas`), ninguno trae `Set-Cookie`, y la mediana de 20 repeticiones de cada caso no difiere más de un 20 % entre casos

#### Scenario: Login correcto desde la interfaz [landing]
- **GIVEN** `ConsoleApp` montado con un `getSession` falso que devuelve `unauthorized` y un `login` falso que devuelve `{user:'demo', tenants:[…]}`
- **WHEN** se escribe `demo` en «Usuario», `consola-demo` en «Clave» y `123456` en «Código»
- **THEN** `login` se llama exactamente una vez con `{user:'demo', password:'consola-demo', code:'123456'}` sin pulsar «Entrar», `getSession` no se vuelve a llamar, y se ve el título «Resumen de {mes actual}»

#### Scenario: Login fallido en la interfaz [landing]
- **GIVEN** un `login` falso que devuelve `unauthorized`
- **WHEN** se envía el formulario con un código de 6 dígitos
- **THEN** aparece un elemento `role="alert"` con «Usuario, clave o código incorrectos.», el campo «Código» queda vacío y con el foco, y «Usuario» y «Clave» conservan su valor

#### Scenario: Código con caracteres no numéricos [landing]
- **WHEN** se escribe `12a3 4` en «Código»
- **THEN** el campo contiene `1234` y el formulario no se envía

### Requirement: Un código TOTP no se reutiliza
If un código TOTP ya fue aceptado dentro de su ventana de validez, el sistema shall rechazarlo.

#### Scenario: Reintento con el mismo código [motor]
- **GIVEN** un login correcto con el código `C` en el paso de tiempo `t`
- **WHEN** se hace otro login con usuario, clave y el mismo `C` dentro de los 90 s siguientes
- **THEN** el segundo responde 401 `credenciales_invalidas` y `consola_sesiones` sigue con 1 fila

### Requirement: Bloqueo por intentos fallidos
If una misma IP acumula 5 intentos fallidos en 15 minutos, o hay 20 fallidos globales en 1 hora, el sistema shall responder 429 a los siguientes logins hasta que termine la ventana.

#### Scenario: Sexto intento [motor]
- **GIVEN** una IP con 5 logins fallidos en los últimos 15 min
- **WHEN** esa IP envía un login con credenciales correctas
- **THEN** la respuesta es 429, `detail.codigo` = `bloqueado`, `detail.reintentar_en` es un entero entre 1 y 900, la cabecera `Retry-After` tiene el mismo valor, no hay `Set-Cookie` y se registra un evento `bloqueado`

#### Scenario: Fin de la ventana [motor]
- **GIVEN** la IP bloqueada del escenario anterior
- **WHEN** el reloj avanza `reintentar_en` segundos y se envía un login correcto
- **THEN** la respuesta es 200

#### Scenario: Cuenta atrás en la interfaz [landing]
- **GIVEN** un `login` falso que devuelve `rate_limited` con `retryAfterSeconds: 90` y relojes falsos de Vitest
- **WHEN** se envía el formulario
- **THEN** se ve «Demasiados intentos. Podrá intentar de nuevo en 1:30.», los tres campos y «Entrar» están deshabilitados; tras avanzar 30 s se lee «1:00»; tras avanzar 60 s más el aviso desaparece y los campos se habilitan

### Requirement: Caducidad de la sesión
While una sesión supera 12 horas desde su creación o 30 minutos sin actividad, el sistema shall rechazar sus peticiones con 401.

#### Scenario: Sesión inactiva [motor]
- **GIVEN** una sesión cuya última petición fue hace 31 min
- **WHEN** se llama a `GET /console/api/yo` con su cookie
- **THEN** la respuesta es 401 `sin_sesion` y su fila ya no está en `consola_sesiones`

#### Scenario: Sesión activa que se renueva [motor]
- **GIVEN** una sesión creada hace 2 h con una petición cada 20 min
- **WHEN** se llama a `GET /console/api/yo`
- **THEN** la respuesta es 200 y `ultima_actividad` es la hora de esta petición

#### Scenario: Caducidad absoluta [motor]
- **GIVEN** una sesión creada hace 12 h 1 min con actividad hace 1 min
- **WHEN** se llama a `GET /console/api/yo`
- **THEN** la respuesta es 401 `sin_sesion`

#### Scenario: 401 a mitad de sesión [landing]
- **GIVEN** la consola en `authenticated` mostrando la conversación `c1` con la URL `/consola?canal=whatsapp&c=c1`, y un `getConversation` falso que devuelve `unauthorized` para `c2`
- **WHEN** se selecciona la fila de `c2`
- **THEN** aparece el login con el aviso «Su sesión caducó. Vuelva a entrar.», en el documento no queda ningún texto de mensajes ni ningún contacto, y la URL sigue siendo `/consola?canal=whatsapp&c=c1`

#### Scenario: Vuelta tras caducar [landing]
- **GIVEN** el estado final del escenario anterior y un `login` falso correcto
- **WHEN** se entra de nuevo
- **THEN** el filtro «Canal» vale «WhatsApp», `listConversations` se llama con `channel: 'whatsapp'` y `getConversation` con `c1`

#### Scenario: Corte de inactividad en el cliente [landing]
- **GIVEN** la consola en `authenticated` con relojes falsos y la última petición correcta en `t`
- **WHEN** el reloj llega a `t + 30 min + 60 s` sin peticiones
- **THEN** se ve el login con «Su sesión caducó. Vuelva a entrar.» y el `ConsoleApi` falso no recibió ninguna llamada nueva

### Requirement: Validación en cada petición
When llega una petición a una ruta protegida, el sistema shall validar la sesión contra la base de datos antes de leer cualquier dato.

#### Scenario: Sin cookie [motor]
- **GIVEN** un espía sobre la consulta de la tabla `conversaciones`
- **WHEN** se pide `GET /console/api/conversaciones?mes=2026-10` sin cookie
- **THEN** la respuesta es 401 `sin_sesion` y el espía registra 0 llamadas

### Requirement: Guardia de la interfaz
While la interfaz no ha confirmado la sesión con `GET /console/api/yo`, la interfaz shall no pedir ni mostrar datos de conversaciones.

#### Scenario: Comprobando sesión [landing]
- **GIVEN** un `getSession` falso que no responde hasta que la prueba lo resuelve
- **WHEN** se monta `ConsoleApp`
- **THEN** se ve «Comprobando sesión…», no hay formulario ni zonas, y `getSummary`, `listConversations` y `getConversation` tienen 0 llamadas

#### Scenario: Sin sesión [landing]
- **WHEN** `getSession` devuelve `unauthorized`
- **THEN** se ve el formulario con los campos «Usuario», «Clave» y «Código», y el foco está en «Usuario»

#### Scenario: API inalcanzable [landing]
- **GIVEN** `getSession` devuelve `network` la primera vez y una sesión la segunda
- **WHEN** se monta `ConsoleApp` y se pulsa «Reintentar»
- **THEN** primero se ve «No pudimos contactar la API.» y después la consola

#### Scenario: HTML estático sin datos ni sitio [build]
- **WHEN** se inspecciona `frontend/out/consola.html`
- **THEN** contiene «Comprobando sesión», no contiene «Pregúntenos» (chat), ni `contacto@aiworks.lat` (pie), ni el texto de navegación del encabezado de la landing

### Requirement: Origen de las peticiones que cambian estado
If una petición `POST` no trae `Content-Type: application/json` o su `Origin` no es exactamente el origen permitido, el sistema shall rechazarla con 403.

#### Scenario: Origen ajeno [motor]
- **GIVEN** una sesión activa
- **WHEN** se envía `POST /console/api/logout` con su cookie y `Origin: https://www.aiworks.lat`
- **THEN** la respuesta es 403 `origen_no_permitido` y la sesión sigue en `consola_sesiones`

#### Scenario: Sin JSON [motor]
- **WHEN** se envía `POST /console/api/login` con `Origin: https://aiworks.lat` y `Content-Type: application/x-www-form-urlencoded`
- **THEN** la respuesta es 403 `origen_no_permitido` y no se registra intento de login

### Requirement: CORS con credenciales solo para la consola
The sistema shall responder en `/console/*` con `Access-Control-Allow-Origin` igual al origen permitido, `Access-Control-Allow-Credentials: true`, `Access-Control-Expose-Headers: Retry-After` y `Vary: Origin`, y sin cabeceras CORS para cualquier otro origen.

#### Scenario: Preflight del login [motor]
- **WHEN** se envía `OPTIONS /console/api/login` con `Origin: https://aiworks.lat`, `Access-Control-Request-Method: POST` y `Access-Control-Request-Headers: content-type`
- **THEN** la respuesta es 2xx con `Access-Control-Allow-Origin: https://aiworks.lat`, `Access-Control-Allow-Credentials: true`, `Access-Control-Allow-Methods` que incluye `POST` y `Access-Control-Allow-Headers` que incluye `Content-Type`

#### Scenario: Otro origen [motor]
- **WHEN** se pide `GET /console/api/yo` con `Origin: https://evil.example`
- **THEN** la respuesta no lleva `Access-Control-Allow-Origin`

#### Scenario: El resto de la API no da credenciales [motor]
- **WHEN** se pide `GET /chat/aiworks/info` con `Origin: https://aiworks.lat`
- **THEN** la respuesta no lleva `Access-Control-Allow-Credentials`

#### Scenario: El cliente envía credenciales [landing]
- **GIVEN** `createConsoleApi` con un `fetchImpl` espía
- **WHEN** se llaman las seis funciones
- **THEN** las seis llamadas a `fetch` llevan `credentials: 'include'` y `cache: 'no-store'`; solo `login` y `logout` llevan `Content-Type: application/json`

### Requirement: Resumen mensual
When se pide `GET /console/api/resumen?mes=AAAA-MM` con sesión válida, el sistema shall devolver `totales` (conversaciones, respuestas, costo_usd, listas_para_llamada) y `por_dia`, filtrados por `tenant` y `canal` si vienen.

#### Scenario: Mes con datos [motor]
- **GIVEN** en octubre de 2026: 3 conversaciones el día 1 y 2 el día 3 (hora de Guayaquil), una de ellas lista para llamada, y 12 filas de `uso` con costo total 0,0421
- **WHEN** se pide `mes=2026-10` el 2026-10-05
- **THEN** `totales` = `{conversaciones:5, respuestas:12, costo_usd:0.0421, listas_para_llamada:1}` y `por_dia` tiene 5 elementos (1 al 5) con `[3,0,2,0,0]`

#### Scenario: Borde de día en Guayaquil [motor]
- **GIVEN** una conversación creada el `2026-10-01T03:00:00Z`
- **WHEN** se piden `mes=2026-09` y `mes=2026-10`
- **THEN** cuenta en septiembre (día 30) y no en octubre

#### Scenario: Mes con formato inválido [motor]
- **WHEN** se pide `mes=2026-13`, `mes=26-10` o sin `mes`
- **THEN** las tres respuestas son 422 con `detail.codigo` = `parametro_invalido`

#### Scenario: Cifras en la interfaz [landing]
- **GIVEN** un `getSummary` falso con `{conversations:48, replies:1234, costUsd:1.8432, readyForCall:5}`
- **WHEN** se monta `MonthSummary` para `2026-10`
- **THEN** la `<dl>` contiene los pares CHATS–48, RESPUESTAS–1.234, COSTO (USD)–1,84 y LISTOS PARA LLAMADA–5, y el título es «Resumen de octubre 2026»

#### Scenario: Cambio de mes [landing]
- **WHEN** se elige «septiembre 2026» en el selector «Mes»
- **THEN** `getSummary` y `listConversations` se llaman con `month: '2026-09'` y la URL contiene `mes=2026-09`

#### Scenario: Regla de chats por día [landing]
- **GIVEN** un resumen de octubre de 2026 con `[3,0,7]` en los días 1 a 3
- **WHEN** se monta `DailyChart`
- **THEN** hay 31 posiciones, 2 marcas visibles y la línea de lectura dice «Día con más chats: 3 oct · 7»
- **WHEN** se le da el foco, se pulsa `Home` y luego `→` dos veces
- **THEN** la línea de lectura dice «3 oct · 7 chats»

#### Scenario: Estados del resumen [landing]
- **WHEN** `getSummary` está pendiente, luego devuelve todo en cero, luego `server`
- **THEN** se ve respectivamente la zona con `aria-busy="true"`, «Sin datos en octubre 2026.» y un `role="alert"` con «La API devolvió un error.» y el botón «Reintentar», que vuelve a llamar a `getSummary`

### Requirement: Lista de conversaciones
When se pide `GET /console/api/conversaciones`, el sistema shall devolver las conversaciones del mes ordenadas por `creada DESC, id DESC`, paginadas con un cursor opaco que es `null` en la última página.

#### Scenario: Paginación completa [motor]
- **GIVEN** 45 conversaciones en el mes
- **WHEN** se pide con `limite=20` y se sigue `siguiente` hasta que sea `null`
- **THEN** se reciben 3 páginas de 20, 20 y 5 elementos, sin repetidos, en orden `creada` descendente, y la tercera trae `siguiente: null`

#### Scenario: Estabilidad durante la paginación [motor]
- **GIVEN** la primera página ya leída
- **WHEN** una conversación de la segunda página recibe un mensaje nuevo y se pide la segunda página
- **THEN** esa conversación aparece una sola vez en el total

#### Scenario: Cursor con otros filtros [motor]
- **WHEN** se usa el `siguiente` de una lista sin filtros en una petición con `canal=web`
- **THEN** la respuesta es 422 `cursor_invalido`

#### Scenario: Filtro por canal [motor]
- **WHEN** se pide `canal=whatsapp`
- **THEN** todas las filas tienen `canal: "whatsapp"` y su número es el de conversaciones de WhatsApp del mes

#### Scenario: Filtro de listos [motor]
- **WHEN** se pide `listas=1`
- **THEN** todas las filas tienen `lista_para_llamada: true`

#### Scenario: Filtros en la interfaz [landing]
- **GIVEN** la bandeja montada sin filtros
- **WHEN** se elige «WhatsApp» en «Canal» y se marca «Solo listos para llamada»
- **THEN** la última llamada a `listConversations` lleva `{channel:'whatsapp', readyOnly:true}` sin `cursor`, y la URL contiene `canal=whatsapp` y `listas=1`

#### Scenario: Cargar más [landing]
- **GIVEN** una primera página de 20 filas con `nextCursor: 'abc'` y una segunda de 5 con `nextCursor: null`
- **WHEN** se pulsa «Cargar más»
- **THEN** `listConversations` se llama con `cursor: 'abc'` y los mismos filtros, hay 25 filas y el botón «Cargar más» ya no existe

#### Scenario: Vacío con filtros [landing]
- **GIVEN** `listConversations` devuelve `{items:[], nextCursor:null}` con el filtro «Taller Ejemplo»
- **THEN** se ve «Aún no hay conversaciones en octubre 2026 con estos filtros: Taller Ejemplo.» y el botón «Quitar filtros», que deja los filtros en «Todos» y quita `tenant` de la URL

#### Scenario: Respuesta tardía [landing]
- **GIVEN** una petición de lista pendiente para `canal=web`
- **WHEN** se cambia a `canal=whatsapp` y luego llega la respuesta de `web`
- **THEN** la señal de la primera petición quedó abortada y la bandeja muestra solo filas de la segunda

### Requirement: Detalle de una conversación
When se pide `GET /console/api/conversaciones/{id}`, el sistema shall devolver los mensajes en orden cronológico con rol, texto y momento, las señales, el idioma y el número de turnos.

#### Scenario: Conversación existente [motor]
- **GIVEN** una conversación con 4 mensajes
- **THEN** `mensajes` tiene 4 elementos con `momento` ascendente y `senales` tiene `senales_total` elementos

#### Scenario: Conversación ya purgada [motor]
- **WHEN** el id corresponde a una conversación borrada por retención
- **THEN** la respuesta es 404 `no_encontrada`

#### Scenario: Lector en escritorio [landing]
- **GIVEN** un viewport de escritorio (`matchMedia('(min-width: 1024px)')` verdadero) y una conversación con un mensaje del visitante y uno del asistente
- **WHEN** se abre
- **THEN** la bandeja y el lector están en el documento a la vez; el lector tiene un `<ol>` de 2 elementos con las etiquetas «VISITANTE» y «ASISTENTE», y el del asistente tiene la clase de la regla de petróleo

#### Scenario: Texto que parece HTML [landing]
- **GIVEN** un mensaje con texto `<b>hola</b> https://ejemplo.test`
- **THEN** el lector muestra ese texto literal, no hay elemento `<b>` ni `<a>` dentro del mensaje

#### Scenario: Detalle no encontrado [landing]
- **WHEN** `getConversation` devuelve `not_found`
- **THEN** el lector muestra un `role="alert"` con «Esta conversación ya no existe. Puede haberse borrado por antigüedad.» y la bandeja sigue visible

### Requirement: Teléfonos enmascarados
The sistema shall devolver todo contacto de WhatsApp enmascarado, mostrando como máximo los últimos 3 dígitos.

#### Scenario: Contacto de WhatsApp [motor]
- **GIVEN** una conversación de WhatsApp con `id_externo` `593990000586`
- **WHEN** aparece en la lista y en el detalle
- **THEN** `contacto` es `+593 ••• ••• 586` en ambos, y ninguna respuesta de `/console/api` contiene la cadena `990000586`

#### Scenario: Red de seguridad en la interfaz [landing]
- **WHEN** una fila trae `contact: '+593 99 000 0000'`
- **THEN** la fila y el lector muestran «Contacto oculto» y no la cadena `000 0000`

### Requirement: Registro de accesos
When ocurre un login, un bloqueo o la lectura de un detalle, el sistema shall registrar el evento con la hora y el hash de la IP, sin contenido de conversaciones.

#### Scenario: Lectura de detalle [motor]
- **WHEN** se abre una conversación cuyo texto contiene `palabra-testigo`
- **THEN** `consola_accesos` gana una fila `lectura` con `ip_hash` no vacío y ninguna columna de la tabla contiene `palabra-testigo`

### Requirement: Solo lectura
The sistema shall exponer en `/console/api` únicamente rutas que no modifican conversaciones, tenants ni conocimiento, salvo `login` y `logout`.

#### Scenario: Método de escritura sobre conversaciones [motor]
- **WHEN** se envía `DELETE /console/api/conversaciones/{id}` con sesión válida
- **THEN** la respuesta es 405 y la conversación sigue existiendo

### Requirement: Interfaz de la consola
When un usuario con sesión abre `aiworks.lat/consola`, la interfaz shall mostrar la franja de cifras, la bandeja y el lector a la vez en pantallas de 1024 px o más, y una sola columna con lector a pantalla completa por debajo.

#### Scenario: Escritorio [landing]
- **GIVEN** viewport de escritorio y una sesión
- **THEN** están a la vez el título «Resumen de {mes}», la lista «Conversaciones» y el lector (con «Elija una conversación de la bandeja.» si no hay `c`)

#### Scenario: Móvil [landing]
- **GIVEN** viewport móvil (`matchMedia('(min-width: 1024px)')` falso) y una bandeja con la fila `c2`
- **WHEN** se pulsa la fila `c2`
- **THEN** la lista «Conversaciones» y la franja de cifras ya no están en el documento, el lector sí, y hay un botón «Volver»

#### Scenario: Volver en móvil [landing]
- **GIVEN** el estado final del escenario anterior
- **WHEN** se pulsa «Volver» (o `Esc`)
- **THEN** la lista vuelve a estar, la URL ya no tiene `c` y el foco está en el botón de la fila `c2`

### Requirement: Navegación por teclado
While el foco está en la bandeja, la interfaz shall permitir moverse entre conversaciones con `j`/`k` (o `↓`/`↑`) y abrir la seleccionada con `Enter`.

#### Scenario: Siguiente conversación en escritorio [landing]
- **GIVEN** viewport de escritorio, filas `c1`, `c2`, `c3` y el foco en `c1` seleccionada
- **WHEN** se pulsa `j`
- **THEN** el botón de `c2` tiene el foco y `aria-current="true"`, el de `c1` no tiene `aria-current`, `getConversation` se llama con `c2` y la URL contiene `c=c2`

#### Scenario: Bordes de la lista [landing]
- **WHEN** se pulsa `k` en `c1` o `j` en `c3`
- **THEN** la selección no cambia

#### Scenario: Teclas dentro de un campo [landing]
- **GIVEN** el foco en el selector «Canal»
- **WHEN** se pulsa `j`
- **THEN** la selección de la bandeja no cambia

#### Scenario: Ir al resumen [landing]
- **WHEN** con el foco en la bandeja se pulsa `g` y luego `r`
- **THEN** el foco está en el título «Resumen de {mes}»

### Requirement: Cumplimiento de la marca
The interfaz shall usar solo los tokens de color de `app/globals.css` y las letras de la marca, sin tarjetas, sombras ni degradados.

#### Scenario: Revisión estática [landing]
- **WHEN** `brand.test.ts` lee todos los `.ts`/`.tsx` de `features/consola` (salvo pruebas y `testing/`)
- **THEN** ninguno contiene `shadow`, `gradient`, `#` seguido de 3 a 8 dígitos hexadecimales, `rgb(`, `hsl(`, `lucide-react` ni clases de la paleta por defecto de Tailwind (`(text|bg|border|ring|fill|stroke|outline|decoration)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)`)

#### Scenario: Nombres accesibles [landing]
- **WHEN** se monta la consola completa con datos
- **THEN** todos los `button`, `input`, `select` y elementos con `tabindex` tienen nombre accesible no vacío (`getByRole` con `name` los encuentra)

### Requirement: Indexación
The interfaz shall declarar `noindex` y no aparecer en el sitemap ni en enlaces de la landing.

#### Scenario: Metadatos [build]
- **WHEN** se inspecciona `frontend/out/consola.html`
- **THEN** contiene `<meta name="robots"` con `noindex`, no contiene `rel="canonical"` ni `og:title`

#### Scenario: Sitemap [build]
- **WHEN** se inspecciona `frontend/out/sitemap.xml`
- **THEN** no contiene `/consola`

#### Scenario: Sin enlaces [build]
- **WHEN** se inspeccionan `frontend/out/index.html`, `privacidad.html` y `demo.html`
- **THEN** ninguno contiene `href="/consola"`
