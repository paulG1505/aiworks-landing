# Spec Delta

Sin spec vigente: `specs/` está vacío en el momento del diseño (2026-10-12). Todo es `ADDED`.
Revisada el 2026-10-13 (ver `analisis.md`): toda esta capacidad es del motor **[motor]**; se prueba
con pytest y un reloj inyectable. Los días se cuentan en `America/Guayaquil`.

## ADDED Requirements

### Requirement: Contadores diarios antes de la purga
When corre el bucle de retención, el sistema shall recalcular, antes de borrar conversaciones vencidas, los contadores de todos los días todavía completos de cada canal: para un canal con retención de R días, desde `hoy − (R − 2)` hasta hoy.

#### Scenario: Conversación a punto de purgarse
- **GIVEN** retención web de 30 días, hoy 2026-10-31, y 3 conversaciones web de `aiworks` creadas el 2026-10-02 que el bucle va a borrar en esta pasada
- **WHEN** corre el bucle de retención
- **THEN** antes del primer `DELETE` de esa pasada, `metricas_diarias` tiene `(2026-10-02, aiworks, web)` con `conversaciones = 3`, y después de la pasada la fila sigue igual

#### Scenario: Cambio tardío a lista para llamada
- **GIVEN** una conversación creada el 2026-10-10 que el 2026-10-15 pasa a lista para llamada
- **WHEN** corre el bucle el 2026-10-15
- **THEN** la fila `(2026-10-10, tenant, canal)` tiene `listas_para_llamada` incrementado en 1

#### Scenario: Día ya congelado
- **GIVEN** retención de 30 días, hoy 2026-11-15, y una fila `(2026-10-01, aiworks, web)` con `conversaciones = 3` cuyas conversaciones ya se purgaron
- **WHEN** corre el bucle
- **THEN** la fila sigue con `conversaciones = 3`

### Requirement: Cálculo idempotente
The sistema shall dejar el mismo resultado si el cálculo de un día se ejecuta más de una vez.

#### Scenario: Doble ejecución
- **GIVEN** un día con 4 conversaciones de las que 1 está lista para llamada
- **WHEN** el cálculo corre dos veces seguidas sin cambios en `conversaciones`
- **THEN** la fila tiene `conversaciones = 4` y `listas_para_llamada = 1` tras cada ejecución, y `metricas_diarias` tiene el mismo número de filas

### Requirement: Sin datos personales
The sistema shall guardar en los contadores diarios únicamente día, tenant, canal, número de conversaciones y número de listas para llamada.

#### Scenario: Contenido de la tabla
- **WHEN** se lee el esquema de `metricas_diarias` con `PRAGMA table_info`
- **THEN** sus columnas son exactamente `dia`, `tenant_id`, `canal`, `conversaciones` y `listas_para_llamada`

### Requirement: Histórico disponible tras la purga
When se pide el resumen de un mes cuyas conversaciones ya se purgaron, el sistema shall devolver sus chats y listos para llamada desde los contadores diarios.

#### Scenario: Mes anterior
- **GIVEN** un resumen de septiembre pedido antes de la purga con `conversaciones = 40` y `listas_para_llamada = 4`
- **WHEN** se purgan todas las conversaciones de septiembre y se pide de nuevo `GET /console/api/resumen?mes=2026-09`
- **THEN** `totales.conversaciones = 40`, `totales.listas_para_llamada = 4` y `por_dia` coincide día a día con la primera respuesta
