# Spec Delta

Sin spec vigente: `specs/` está vacío en el momento del diseño (2026-10-12). Todo es `ADDED`.

## ADDED Requirements

### Requirement: Consola apagada por defecto
Where `CONSOLE_USER` o `CONSOLE_PASSWORD_HASH` no están definidos, el sistema shall responder 404 en todas las rutas `/console/api`.
#### Scenario: Sin configuración
- **WHEN** se pide `GET /console/api/yo` en un servidor sin esas variables
- **THEN** la respuesta es 404 y no se crea ninguna sesión

### Requirement: Login con contraseña y TOTP
When llega `POST /console/api/login` con usuario, clave y código válidos, el sistema shall crear una sesión y fijarla en una cookie `HttpOnly`, `Secure` y `SameSite=Strict`.
#### Scenario: Credenciales correctas
- **WHEN** se envían usuario, clave y un código TOTP vigente
- **THEN** la respuesta es 200 y trae la cookie de sesión

#### Scenario: Un dato incorrecto
- **WHEN** el usuario, la clave o el código son incorrectos
- **THEN** la respuesta es 401 con el mismo mensaje y el mismo tiempo de respuesta aproximado en los tres casos

### Requirement: Un código TOTP no se reutiliza
If un código TOTP ya fue aceptado en el paso de tiempo actual, el sistema shall rechazarlo.
#### Scenario: Reintento con el mismo código
- **WHEN** se hace login dos veces seguidas con el mismo código
- **THEN** el segundo intento responde 401

### Requirement: Bloqueo por intentos fallidos
If una misma IP acumula 5 intentos fallidos en 15 minutos, el sistema shall responder 429 a sus siguientes logins hasta que termine la ventana.
#### Scenario: Sexto intento
- **WHEN** una IP falla 5 veces y lo intenta de nuevo con credenciales correctas
- **THEN** la respuesta es 429 con el tiempo restante

### Requirement: Caducidad de la sesión
While una sesión supera 12 horas desde su creación o 30 minutos sin actividad, el sistema shall rechazar sus peticiones con 401.
#### Scenario: Sesión inactiva
- **WHEN** pasan 31 minutos sin peticiones y luego se llama a `GET /console/api/yo`
- **THEN** la respuesta es 401 y la sesión se elimina del servidor

### Requirement: Validación en cada petición
When llega una petición a una ruta protegida, el sistema shall validar la sesión contra la base de datos antes de leer cualquier dato.
#### Scenario: Sin cookie
- **WHEN** se pide `GET /console/api/conversaciones` sin cookie
- **THEN** la respuesta es 401 y no se consulta la tabla de conversaciones

### Requirement: Origen de las peticiones que cambian estado
If una petición `POST` no trae `Content-Type: application/json` o su `Origin` no es `https://aiworks.lat`, el sistema shall rechazarla con 403.
#### Scenario: Origen ajeno
- **WHEN** se envía `POST /console/api/logout` desde otro origen
- **THEN** la respuesta es 403 y la sesión sigue activa

### Requirement: Resumen mensual
When se pide `GET /console/api/resumen?mes=AAAA-MM` con sesión válida, el sistema shall devolver chats, respuestas, costo y listos para llamada por tenant y canal, más los chats por día.
#### Scenario: Mes con datos
- **WHEN** hay conversaciones y registros de uso en el mes pedido
- **THEN** la respuesta incluye las cuatro cifras y una lista de días con su número de chats

#### Scenario: Mes con formato inválido
- **WHEN** el parámetro `mes` no cumple `AAAA-MM`
- **THEN** la respuesta es 422

### Requirement: Lista de conversaciones
When se pide `GET /console/api/conversaciones`, el sistema shall devolver las conversaciones más recientes primero, paginadas por cursor, de web y WhatsApp.
#### Scenario: Filtro por canal
- **WHEN** se pide `canal=whatsapp`
- **THEN** todas las filas devueltas son de WhatsApp

#### Scenario: Filtro de listos
- **WHEN** se pide `listas=1`
- **THEN** todas las filas devueltas cumplen la regla de listo para llamada

### Requirement: Detalle de una conversación
When se pide `GET /console/api/conversaciones/{id}`, el sistema shall devolver el diálogo completo con rol, texto y hora de cada turno (la hora solo si el mensaje la guardó; ver design § 0), las señales, el idioma y el número de turnos.
#### Scenario: Conversación existente
- **WHEN** el id corresponde a una conversación vigente
- **THEN** la respuesta trae los turnos en orden cronológico

#### Scenario: Conversación ya purgada
- **WHEN** el id corresponde a una conversación borrada por retención
- **THEN** la respuesta es 404

### Requirement: Teléfonos enmascarados
The sistema shall devolver todo contacto de WhatsApp enmascarado, mostrando como máximo los últimos 3 dígitos.
#### Scenario: Contacto de WhatsApp
- **WHEN** una conversación de WhatsApp aparece en la lista o en el detalle
- **THEN** el campo `contacto` no contiene el número completo y ninguna ruta lo devuelve completo

### Requirement: Registro de accesos
When ocurre un login, un bloqueo o la lectura de un detalle, el sistema shall registrar el evento con la hora y el hash de la IP, sin contenido de conversaciones.
#### Scenario: Lectura de detalle
- **WHEN** se abre una conversación
- **THEN** se añade un evento `lectura` sin texto del chat

### Requirement: Solo lectura
The sistema shall exponer en `/console/api` únicamente rutas que no modifican conversaciones, tenants ni conocimiento, salvo `login` y `logout`.
#### Scenario: Método de escritura sobre conversaciones
- **WHEN** se envía `DELETE /console/api/conversaciones/{id}`
- **THEN** la respuesta es 405

### Requirement: Interfaz de la consola
When un usuario con sesión abre `aiworks.lat/consola`, la interfaz shall mostrar la franja de cifras del mes, la bandeja de conversaciones y el lector en una sola vista en pantallas de 1024 px o más.
#### Scenario: Escritorio
- **WHEN** se abre la consola en una pantalla de 1280 px de ancho
- **THEN** se ven las cifras, la bandeja y el lector a la vez

#### Scenario: Móvil
- **WHEN** se abre la consola en una pantalla de 390 px de ancho y se elige una conversación
- **THEN** el lector ocupa la pantalla y hay un botón para volver a la bandeja

### Requirement: Estados de la interfaz
When una zona está cargando, vacía, con error o con la sesión caducada, la interfaz shall mostrar el estado correspondiente en lugar de una zona en blanco.
#### Scenario: Sesión caducada
- **WHEN** una petición responde 401
- **THEN** la interfaz vuelve al login y conserva la ruta para regresar a ella

### Requirement: Navegación por teclado
While el foco está en la bandeja, la interfaz shall permitir moverse entre conversaciones con `j` y `k` y abrir la seleccionada con `Enter`.
#### Scenario: Siguiente conversación
- **WHEN** se pulsa `j` con una conversación seleccionada
- **THEN** se selecciona la siguiente y el lector muestra su diálogo

### Requirement: Cumplimiento de la marca
The interfaz shall usar solo los colores y letras de `negocio/identidad/MARCA.md`, sin tarjetas, sombras ni degradados.
#### Scenario: Revisión visual
- **WHEN** se inspeccionan los estilos de la consola
- **THEN** los colores usados pertenecen a la paleta de la marca y no hay `box-shadow` ni `gradient`

### Requirement: Indexación
The interfaz shall declarar `noindex` y no aparecer en el sitemap ni en enlaces de la landing.
#### Scenario: Sitemap
- **WHEN** se genera el sitemap de la landing
- **THEN** no contiene la ruta `/consola`
