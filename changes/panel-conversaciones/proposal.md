# Proposal: panel-conversaciones

## Why

Con el número de WhatsApp de `aiworks` solo para el bot (sin app de WhatsApp Business), Paul no tiene
dónde ver cuántos chats atiende ni cómo responde. Hoy solo hay `/admin/metricas` y un endpoint de
sesiones web, accesibles por SSH, sin texto de WhatsApp y sin histórico más allá de la purga de 30 y
60 días. Para las demos a prospectos, ver las conversaciones reales es además la mejor forma de
afinar el conocimiento del bot.

## What Changes

- Una consola web en `aiworks.lat/consola`, con la marca de AIworks, que muestra el resumen del mes y
  una bandeja de conversaciones (web y WhatsApp) con el diálogo completo.
- Un login de un solo usuario (contraseña + TOTP) validado siempre en la API.
- Un router `/console/api/*` en la API pública, de solo lectura.
- Una tabla `metricas_diarias` para conservar chats nuevos y listos para llamada tras la purga.
- ADR-010 con la decisión y sus riesgos.

Fuera de alcance: responder o intervenir un chat, borrar conversaciones, ver teléfonos completos,
búsqueda de texto dentro de las conversaciones, roles múltiples y vistas por cliente.

## Capabilities

- `admin-console`: nueva — autenticación, resumen mensual, lista y detalle de conversaciones.
- `daily-metrics`: nueva — contadores diarios que sobreviven a la purga.

## Impact

- `productos/asistente`: `app/console/` (nuevo), migración `008`, bucle de retención, `Caddyfile`
  (ruta `/console/*`), `app/config.py` (variables de la consola), `.env.example`, CORS.
- `productos/landing`: ruta `/consola` (noindex) y sus componentes. Sigue exportándose estático.
- Dos dependencias nuevas en el motor: `argon2-cffi` y `pyotp`.
- Operación: el `.env` del servidor gana tres variables; hay que generar el hash y el secreto TOTP
  con un script de preparación.
- Seguridad: nueva superficie pública con datos de clientes; ver ADR-010.
