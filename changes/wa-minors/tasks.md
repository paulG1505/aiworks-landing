# Tasks: wa-minors

Estas tareas son para aprender el flujo completo: implementar, probar, revisar y abrir el PR. Son chicas a propósito.

## Antes de empezar

```bash
git clone https://github.com/paulG1505/landing.git
cd landing
git checkout feat/katty-wa-minors
cd frontend && npm install
```

Comprueba cómo está todo **antes** de cambiar nada (así sabes qué ya estaba mal):

| Comando (desde `frontend/`) | Resultado esperado hoy |
|---|---|
| `npm test` | 83 pruebas, todas pasan |
| `npm run lint` | sin errores |
| `npx tsc --noEmit` | **2 errores**, ambos en `shared/lib/waChannels.test.ts` (líneas 11 y 18): `Argument of type 'string \| null' is not assignable to parameter of type 'string \| URL'` |

Si tu resultado es distinto, para y avísale a Paul antes de seguir.

## Reglas para las tres tareas

- Trabaja solo en la rama `feat/katty-wa-minors`. Nunca hagas `git push` a `master` ni merge: solo Paul mergea.
- **El código va en inglés** (nombres, comentarios, nombres de los tests). **El texto que ve el usuario va en español** (aquí no cambia ninguno). Los documentos como `CLAUDE.md` siguen en español.
- Comentarios solo si explican un «por qué» que el código no dice. Ninguno es necesario en estas tareas.
- Un commit por tarea, con el formato `tipo(alcance): resumen` (por ejemplo `test(wa): ...`). Antes de cada commit, `/pg-implement` te lo propone y tú esperas el visto bueno de Paul.
- **No toques**: `shared/lib/waChannels.ts`, `shared/components/ui/WaRedirect.tsx`, `app/wa/`, `package.json`, `package-lock.json` ni ninguna otra cosa que no esté en la lista de la tarea. Si crees que hace falta, anótalo y pregúntale a Paul.

## [x] 1. Arreglar el tipo en `waChannels.test.ts` para que pase `tsc`

- **Archivo:** `frontend/shared/lib/waChannels.test.ts` (solo este).
- **El problema:** `channelLink(...)` devuelve `string | null`, y `new URL(...)` no acepta `null`. El test lo hace en dos lugares: el que recorre los canales (línea 11) y el que prueba sin canal (línea 18).
- **Qué cambiar:** antes de crear la `URL`, guarda el resultado en una variable y asegura que no es `null` con `assert.ok`. `assert.ok` le dice a TypeScript que, de ahí en adelante, la variable ya es `string`. En el primer test queda así (haz lo mismo en el segundo):

  ```ts
  for (const slug of channelSlugs()) {
    const link = channelLink(slug);
    assert.ok(link);
    const url = new URL(link);
    // ...el resto del test igual
  }
  ```

- **No cambies** lo que el test comprueba, solo cómo prepara la `URL`. Tampoco pongas `// @ts-ignore` ni `as any`: eso esconde el error en vez de arreglarlo.
- **Prueba (desde `frontend/`):**
  1. `npx tsc --noEmit` → sin errores.
  2. `npm test` → las 83 pruebas siguen pasando.
  3. `npm run lint` → sin errores.
- **Terminado cuando:** `npx tsc --noEmit` no imprime nada y `npm test` sigue en 83 pruebas verdes. En `git diff` solo aparece `waChannels.test.ts`.

## [x] 2. Agregar el test de `__proto__` y `constructor`

- **Archivo:** `frontend/shared/lib/waChannels.test.ts` (el mismo de la tarea 1; agrega el test **al final**).
- **Por qué existe:** `channelLink` decide si un canal existe con `Object.hasOwn(WA_CHANNELS, slug)`. Si alguien lo «simplificara» a `slug in WA_CHANNELS`, nombres heredados como `__proto__` o `constructor` contarían como canales válidos y la ruta `/wa/constructor` abriría un enlace roto en lugar de dar 404. Este test vigila eso.
- **Qué agregar:**

  ```ts
  test('channelLink returns null for names inherited from Object.prototype', () => {
    for (const slug of ['__proto__', 'constructor', 'toString', 'hasOwnProperty']) {
      assert.equal(channelLink(slug), null);
    }
  });
  ```

- **Importante: este test pasa de una vez**, porque el código de hoy ya es correcto. Un test que nunca falló no demuestra que sirve, así que haz esta comprobación (es parte del aprendizaje):
  1. Con el test escrito, abre `shared/lib/waChannels.ts` y cambia **temporalmente** `Object.hasOwn(WA_CHANNELS, slug)` por `slug in WA_CHANNELS`.
  2. Corre `npm test`: tu test nuevo **debe fallar**. Si no falla, el test está mal escrito.
  3. **Deshaz el cambio** en `waChannels.ts` (`git checkout -- shared/lib/waChannels.ts`) y vuelve a correr `npm test`.
- **Prueba (desde `frontend/`):** `npm test`, `npx tsc --noEmit`, `npm run lint`.
- **Terminado cuando:** viste fallar el test con el cambio temporal, lo deshiciste, y ahora `npm test` pasa con 84 pruebas (83 + la nueva), `tsc` y `lint` sin errores. En `git diff` **no** aparece `waChannels.ts`.

## [x] 3. Documentar `/wa` en `frontend/CLAUDE.md`

- **Archivo:** `frontend/CLAUDE.md` (solo este). Es un documento, va en español.
- **Qué cambiar:** en el árbol «Directory Structure» (la caja de código del principio) agrega estas tres cosas, con el mismo estilo y alineación de las líneas vecinas:
  1. En `app/`: una línea para `wa/page.tsx` y `wa/[channel]/page.tsx` con la descripción «Redirecciones fijas a WhatsApp por canal (`/wa/ig`, `/wa/fb`, `/wa/volante`)».
  2. En `shared/components/ui/`: agrega `WaRedirect` a la lista.
  3. En `shared/lib/`: agrega `waChannels.ts` a la lista.
- Luego, debajo del árbol, agrega una sección corta **«Rutas /wa»** (5 a 8 líneas) que diga: para qué sirven (enlaces cortos para Instagram, Facebook y volantes, cada uno con su mensaje inicial), que los canales y mensajes viven en `WA_CHANNELS` de `shared/lib/waChannels.ts`, que las páginas son `noindex` y no están en el sitemap, y que un canal que no existe da 404. Para escribirla, lee `waChannels.ts`, `app/wa/page.tsx`, `app/wa/[channel]/page.tsx` y `app/sitemap.ts`; no inventes nada que no veas ahí.
- **Prueba (desde la raíz del repo):** `grep -n "waChannels\|WaRedirect\|/wa" frontend/CLAUDE.md` debe devolver al menos 4 líneas. Desde `frontend/`, `npm test` y `npm run lint` siguen en verde (un `.md` no los rompe; es para confirmar que no tocaste nada más).
- **Terminado cuando:** el `grep` devuelve las líneas, lo que escribiste coincide con el código (revísalo con Paul si dudas) y en `git diff` solo aparece `frontend/CLAUDE.md`.

## Cierre

1. Con las 3 tareas hechas, corre desde `frontend/`: `npm test`, `npx tsc --noEmit` y `npm run lint`. Los tres limpios.
2. `/pg-review` sobre el diff. Corrige lo que marque.
3. `/pg-pr` para abrir el PR contra `master`. En la descripción: qué cambió en cada tarea y el resultado de los tres comandos.
4. Avísale a Paul. **No hagas merge.**
