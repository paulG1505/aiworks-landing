# MARCA — AIworks

> **Fuente de verdad visual.** Presentaciones, propuestas, contratos, PDFs y piezas usan esto.
> Los valores salen de `productos/landing/frontend/app/globals.css` (rama `master`, sistema
> visual v2, publicado el 2026-09-29). **Si la web cambia, se actualiza este archivo primero**
> y luego la copia de iCloud (`3 - Marca/MARCA.md`). Lo edita Paul; Katty lo lee.

## Colores

Modo claro: es el principal, el de todo documento y presentación.

| Nombre | Código | Para qué |
|---|---|---|
| Papel | `#F7F6F3` | Fondo de página |
| Arena | `#EEECE6` | Fondo de bloques secundarios |
| Tinta | `#1B1916` | Texto principal |
| Tinta media | `#5C5850` | Texto secundario |
| Regla | `#DDD9D0` | Líneas finas y bordes |
| **Petróleo** | `#0B6571` | **El único acento** |

Bloques oscuros (portada, cierre):

| Nombre | Código | Para qué |
|---|---|---|
| Noche | `#171513` | Fondo oscuro |
| Hueso | `#EEE9E0` | Texto sobre Noche |
| Petróleo claro | `#5CC3CC` | Acento sobre Noche |

Contraste medido en la web: tinta/papel 16.2 · tinta media/papel 6.6 · petróleo/papel 6.2 ·
hueso/noche 15.1 · petróleo claro/noche 8.8. No bajar de ahí.

## Letras (gratis en Google Fonts)

| Uso | Letra | Peso |
|---|---|---|
| Títulos | Bricolage Grotesque | 600 |
| Texto normal y botones | Geist | 400 y 500 |
| Etiquetas, horas, números y códigos | Geist Mono | 500, mayúsculas con espacio abierto |

Si un programa no tiene una de estas letras, **no se sustituye sin avisar a Paul**.

## Reglas de uso

- **El petróleo va en poco:** la palabra clave de un título, una línea, un enlace, un botón. Nunca
  como fondo de párrafos. Si va en todo, deja de servir.
- Sin degradados, sin sombras, sin íconos de adorno, sin colores pastel y sin más colores que los
  de las tablas. Todo alineado a la izquierda, con mucho espacio en blanco.
- Listas con líneas finas, **sin tarjetas ni cajas** para cada ítem.
- Única excepción de color ajeno: el verde de WhatsApp en su botón flotante de la web.

## Datos fijos

- **Nombre:** `AIworks` (A y I mayúsculas, `works` en minúsculas). Nunca `AIWorks` ni `AIWORKS` en prosa.
- **Sitio:** `aiworks.lat` · **Correo:** `contacto@aiworks.lat` · **WhatsApp:** `+593 97 892 3586`
- **Logo:** no existe todavía (lo hace InnovArtis). Mientras tanto va solo el nombre escrito en
  Bricolage Grotesque. Sin el nombre del fundador ni dirección.

## Qué no cubre

- **El modo oscuro de la web** (petróleo claro sobre fondos oscuros) es solo del sitio; no se usa en documentos.
- `landing.pen` y el brief v4 de InnovArtis siguen la dirección **oscura anterior** (ver
  `docs/adr/ADR-005-tema-claro-para-la-landing.md`). Para lo nuevo manda este archivo.

## Para quien genere documentos (incluido Claude)

Antes de crear una presentación, propuesta, contrato o PDF de AIworks, leer este archivo y usar
estos colores y letras. Versión enviable: `AIworks-paleta-y-tipografia.pdf` en `../socios/innovartis/`.
