# Propuesta: wa-minors

## Qué es

El PR #10 de `wa-redireccion` (las rutas `/wa`, `/wa/ig`, `/wa/fb` y `/wa/volante`) ya está en producción. Su revisión dejó tres pendientes menores, que no cambian lo que ve el visitante:

1. `npx tsc --noEmit` falla por dos líneas del test de `waChannels`.
2. Falta un test que pruebe que `/wa/__proto__` y `/wa/constructor` no abren WhatsApp.
3. `frontend/CLAUDE.md` no menciona las rutas `/wa`.

## Por qué

- Un `tsc` que falla en `master` esconde errores nuevos: nadie nota uno más.
- El test de `__proto__` protege una decisión de seguridad (`Object.hasOwn` en lugar de `in`) que hoy nada vigila.
- La próxima persona que toque la landing necesita encontrar `/wa` en la guía del proyecto.

## Quién y cómo

Es el primer trabajo de Katty como desarrolladora (Decisión #34). Flujo:

1. Clona el repo, se cambia a la rama `feat/katty-wa-minors` (este diseño ya está en ella).
2. Implementa las 3 tareas de `tasks.md` con `/pg-implement`.
3. Prueba en su máquina, corre `/pg-review` y abre el PR con `/pg-pr`.
4. Solo Paul hace merge.

## Fuera de alcance

- Cambiar los mensajes de los canales, agregar canales nuevos o tocar el diseño de la página.
- Cualquier cambio en `waChannels.ts`, `WaRedirect.tsx` o las páginas de `app/wa/`.
- Subir dependencias o tocar `package.json`.
