# Despliegue en GitHub Pages (aiworks.lat)

Guía para publicar la landing en GitHub Pages con el dominio personalizado **aiworks.lat**.

## Requisitos previos

- Cuenta en GitHub
- Repositorio creado (ej: `landing-page` o `aiworks-landing`)
- Dominio **aiworks.lat** configurado en tu proveedor de dominios

---

## Paso 1: Subir el código a GitHub

```bash
# Si aún no tienes el repo inicializado
cd landing-page
git init
git add .
git commit -m "Initial commit: AIworks landing page"

# Crear repo en GitHub y conectar
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

---

## Paso 2: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. **Settings** → **Pages**
3. En **Build and deployment**:
   - **Source**: GitHub Actions
4. Guarda los cambios

---

## Paso 3: Configurar el dominio aiworks.lat

### En GitHub

1. **Settings** → **Pages**
2. En **Custom domain**, escribe: `aiworks.lat`
3. Marca **Enforce HTTPS** cuando esté disponible

### En tu proveedor de dominios

Configura los registros DNS según el tipo de dominio:

**Opción A: Dominio raíz (aiworks.lat)**

| Tipo | Nombre | Valor |
|------|--------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

**Opción B: Subdominio www (www.aiworks.lat)**

| Tipo | Nombre | Valor |
|------|--------|-------|
| CNAME | www | TU_USUARIO.github.io |

> **Nota**: La propagación DNS puede tardar hasta 24–48 horas.

---

## Paso 4: Desplegar

Cada vez que hagas push a `main` o `master`, GitHub Actions:

1. Instala dependencias
2. Ejecuta `npm run build` en `frontend`
3. Sube el contenido de `frontend/out` a GitHub Pages

```bash
git add .
git commit -m "Deploy: actualización de la landing"
git push origin main
```

Revisa el progreso en la pestaña **Actions** del repositorio.

---

## Verificación local

Antes de subir, puedes probar el build:

```bash
cd frontend
npm install
npm run build
```

El resultado estará en `frontend/out/`. Para probar localmente:

```bash
npx serve frontend/out
```

---

## Resumen de archivos configurados

| Archivo | Propósito |
|---------|-----------|
| `frontend/next.config.ts` | `output: "export"` para generar HTML estático |
| `frontend/public/CNAME` | Dominio personalizado para GitHub Pages |
| `.github/workflows/deploy.yml` | Workflow de despliegue automático |
| `frontend/shared/constants/site.ts` | URL base `https://aiworks.lat` |
