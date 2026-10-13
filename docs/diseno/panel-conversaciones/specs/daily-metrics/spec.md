# Spec Delta

Sin spec vigente: `specs/` está vacío en el momento del diseño (2026-10-12). Todo es `ADDED`.

## ADDED Requirements

### Requirement: Contadores diarios antes de la purga
When corre el bucle de retención, el sistema shall recalcular los contadores de hoy y de ayer por tenant y canal antes de borrar conversaciones vencidas.
#### Scenario: Conversación a punto de purgarse
- **WHEN** una conversación creada hace 31 días está por borrarse
- **THEN** su día ya tiene su contador guardado antes de que se borre

### Requirement: Cálculo idempotente
The sistema shall dejar el mismo resultado si el cálculo de un día se ejecuta más de una vez.
#### Scenario: Doble ejecución
- **WHEN** el cálculo del mismo día corre dos veces seguidas
- **THEN** los contadores de ese día no se duplican

### Requirement: Sin datos personales
The sistema shall guardar en los contadores diarios únicamente día, tenant, canal, número de conversaciones y número de listas para llamada.
#### Scenario: Contenido de la tabla
- **WHEN** se inspecciona `metricas_diarias`
- **THEN** no contiene textos de conversación, teléfonos ni identificadores de sesión

### Requirement: Histórico disponible tras la purga
When se pide el resumen de un mes cuyas conversaciones ya se purgaron, el sistema shall devolver sus chats y listos para llamada desde los contadores diarios.
#### Scenario: Mes anterior
- **WHEN** se pide el resumen del mes pasado y sus conversaciones ya no existen
- **THEN** las cifras de chats y listos coinciden con las que había antes de la purga
