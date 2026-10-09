# CLAUDE.md — landing (aiworks.lat)

> Puntero de la raíz del repo `paulG1505/aiworks-landing`. El detalle de arquitectura, stack y
> convenciones de código está en **`frontend/CLAUDE.md`**, que es el que manda para el código.
> Creado el 2026-10-08.

## Dónde está publicada (verificado el 2026-10-08)

- **GitHub Pages**, no Vercel. `aiworks.lat` resuelve a las IP de GitHub Pages
  (185.199.108-111.153), `www` es CNAME de `paulg1505.github.io` y la respuesta HTTP trae
  `server: GitHub.com`. No hay carpeta `.vercel` en el repo.
- Se publica con `.github/workflows/deploy.yml`: cada push a `main` o `master` corre
  `npm ci && npm run build` en `frontend/` y sube `frontend/out`.
- El dominio sale de `frontend/public/CNAME`.

## Consecuencia que hay que recordar

`next.config.ts` usa `output: "export"`: **el sitio es 100 % estático**. No hay rutas de API, ni
servidor, ni variables de entorno secretas en tiempo de ejecución. Todo lo que necesite un secreto
(por ejemplo, llamar a Claude) tiene que vivir en otro servicio; la web solo lo llama desde el
navegador.

## Comandos

```bash
cd frontend
npm ci
npm run dev     # local
npm run build   # genera frontend/out, lo mismo que publica el CI
```

## Chat de la web (change `chatbot-web-e9`)

- Botón y panel en `frontend/shared/components/ui/chat/`; el panel es un chunk aparte que
  solo se descarga al hacer clic. La demo de un prospecto es `/demo#<código>`.
- La única variable pública es `NEXT_PUBLIC_API_URL` (por defecto `http://127.0.0.1:8000` en
  desarrollo y `https://api.aiworks.lat` en el build). Se fija al construir, no al ejecutar.
- Probar sin la API real, con el servidor simulado (Node puro):

```bash
node scripts/mock-chat-api.mjs            # http://127.0.0.1:8000
cd frontend && npm run dev                # en otra terminal
# abrir http://localhost:3000/demo#abc123def456 para la demo
```

  Atajos en el mensaje: `agendar` devuelve la acción de WhatsApp con código, `limite` un 429,
  `falla` un 500, `lento` tarda 25 s (prueba el timeout de 20 s). Un código con `nohay`
  da 404 en la demo. Para un build estático contra otro puerto:
  `NEXT_PUBLIC_API_URL=http://127.0.0.1:8787 npm run build`.

## Reglas

- Rama + PR; nunca commit directo a `master` (regla de la raíz `aiworks/CLAUDE.md`).
- Colores y letras: `negocio/identidad/MARCA.md` en la raíz de AIworks sigue a `frontend/app/globals.css`.
- La página `/privacidad` promete que no hay analítica ni cookies de seguimiento y describe lo
  que guarda el chat (30 días, IP solo como huella diaria). Cualquier función que guarde datos
  del visitante obliga a actualizarla.
