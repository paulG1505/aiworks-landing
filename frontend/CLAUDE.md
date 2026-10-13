# Landing Page Project

## 📋 Project Overview
Landing de AIworks (consultora de software con IA, Quito) construida con Next.js 16, React 19, TypeScript, Tailwind CSS 4 y Motion, siguiendo Screaming Architecture.

## 🏗️ Architecture: Screaming Architecture

This project follows **Screaming Architecture** - the folder structure screams what the application does, not what framework it uses.

### Directory Structure

```
frontend/
├── app/                          # Next.js App Router (infraestructura)
│   ├── layout.tsx               # Layout raíz: fuentes, script de tema, header/footer
│   ├── page.tsx                 # Inicio (secciones con next/dynamic)
│   ├── privacidad/page.tsx      # Política de privacidad (LOPDP)
│   ├── globals.css              # Tokens, tema claro/oscuro, clases del sistema, movimiento
│   ├── icon.svg / favicon.ico / apple-icon.png
│   ├── manifest.ts · sitemap.ts
│
├── features/                     # Bloques de negocio (EL NÚCLEO)
│   ├── hero/                    # Titular de categoría + terminal del registro operativo
│   ├── services/                # 01 Qué construimos (4 líneas de servicio)
│   ├── processes/               # 02 Procesos que se automatizan (3 filas)
│   ├── how-we-work/             # 03 Cómo trabajamos (3 fases + cinta de 15 tecnologías)
│   ├── why/                     # 04 Por qué AIworks + carrusel de ejemplos
│   ├── faq/                     # 05 FAQ (acordeón accesible)
│   ├── final-cta/               # 06 Cierre: WhatsApp + correo
│   ├── demo/                    # Página /demo#<código>
│   └── legal/                   # Página de privacidad
│
├── shared/
│   ├── components/
│   │   ├── ui/                 # Container, SectionHeading, WhatsAppLogo, chat/ (ChatLauncher, ChatPanel, Conversation)
│   │   ├── layout/             # Header, Footer, LanguageSelector, ThemeToggle, ScrollProgressBar
│   │   ├── providers/          # StoreRehydrate, MotionProvider, ScrollToAnchor
│   │   └── seo/                # StructuredData (JSON-LD)
│   ├── hooks/                   # useReveal, useIntersectionObserver, useMediaQuery…
│   ├── lib/                     # i18n (es/en), theme.ts, whatsapp.ts, utils.ts
│   ├── store/                   # Zustand: idioma, UI
│   ├── types/ · constants/
│
└── public/                      # CNAME, og-image, íconos del manifest, robots.txt
```

## 🎯 Key Principles

### 1. **Feature-Based Organization**
- Each feature is self-contained in its own folder
- Features contain their own components, hooks, and types
- Easy to locate and modify business logic

### 2. **Screaming Intent**
- Folder names describe business capabilities, not technical layers
- `features/pricing/` tells you more than `components/PricingCard/`
- New developers immediately understand what the app does

### 3. **Dependency Rules**
- Features can use `shared/` code
- `shared/` code cannot depend on features
- Features should not depend on each other (use shared for that)

### 4. **Colocation**
- Keep related code close together
- Component, styles, tests, and types live near each other
- Reduces cognitive load when working on a feature

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router), export estático (`output: "export"`) a GitHub Pages
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + tokens propios en `app/globals.css`
- **Animación**: Motion (`motion/react`), cargado con `LazyMotion` + `domAnimation`
- **State Management**: Zustand
- **Linting**: ESLint
- **Package Manager**: npm

> `next.config.ts` desactiva `turbopackFileSystemCacheForDev`: la caché de Turbopack en disco
> sirvió dos veces un `globals.css` viejo en `next dev`. Si algo de CSS "no se aplica" en
> local, borra `.next/` y vuelve a arrancar antes de buscar el error en el código.

## 🤖 Skills de diseño

### Instalada y vigente

- **`frontend-design`** (oficial de Anthropic, desde `claude-plugins-official`), en
  `.claude/skills/frontend-design/`: dirección estética, tipografía y clichés a evitar.
- **UI/UX Pro Max** (`npm install -g ui-ux-pro-max-cli`, luego `uipro init --ai claude`).
  Su base de datos se consulta con
  `python3 "$(npm root -g)/ui-ux-pro-max-cli/assets/scripts/search.py" "<consulta>" --domain ux`
  (dominios: `ux`, `landing`, `typography`, `color`, `react`, `web`…; `--stack nextjs`).
  Úsala para pautas de UX, accesibilidad y movimiento. Sus recomendaciones de paleta y
  tipografía son genéricas: las decisiones de marca de abajo mandan.

### Sistema visual (v2, sep 2026)

Los tokens y su contraste calculado están comentados al inicio de `app/globals.css`.

- **Tipografía**: Bricolage Grotesque 600 para titulares (`font-display`), Geist para cuerpo y
  UI, Geist Mono para eyebrows, etiquetas y la terminal. La palabra clave de cada titular se
  marca **solo con color** (Bricolage no tiene cursiva real; nada de cursiva sintética).
- **Color**: neutro claro (`--papel` #F7F6F3, `--arena` #EEECE6) y un único acento,
  **petróleo** (`--marca` #0B6571 en claro, #5CC3CC en oscuro). El petróleo va en la palabra
  clave, enlaces, foco, íconos de servicio, barra de progreso y botón principal
  (`--boton`). Única excepción de color: el verde de WhatsApp en su botón flotante.
- **Tema**: claro/oscuro con `<html data-theme>`. Lo resuelve un script en el `<head>` antes
  del primer pintado; el botón del header lo fija (`shared/lib/theme.ts`). Todo color de un
  componente sale de un token que tiene valor en ambos temas; nada de hex fijos que solo
  funcionen en uno.
- **Contraste**: todo texto ≥ 4,5:1 en ambos temas. Si agregas un par nuevo, calcúlalo y
  anótalo junto al token.
- **Estructura**: bloques con eyebrow numerado + titular en dos líneas (`SectionHeading`),
  filas con filete para listas; las tarjetas se reservan para el carrusel de ejemplos.
- **Afirmaciones**: cero cifras inventadas, cero sellos, cero superlativos. Todo ejemplo va
  rotulado como tal. `scripts/verify-landing.sh` lo comprueba sobre el build.

### Movimiento

- Revelados al hacer scroll y la entrada del hero: **CSS** (`.reveal`, `.line-mask`,
  `useReveal`). Su estado oculto vive bajo `html.js` y
  `prefers-reduced-motion: no-preference`, así el contenido se ve sin JS.
- **Motion** solo donde aporta algo que CSS no resuelve bien: salidas animadas
  (`AnimatePresence`: menú móvil, burbuja de WhatsApp, ícono de tema), resortes ligados al
  scroll (línea de fases, barra de progreso) y gestos (`whileHover`/`whileTap` del botón de
  WhatsApp). Usa los componentes `m.*`, no `motion.*` (`LazyMotion` va en modo `strict`).
- `MotionConfig reducedMotion="user"` aplica el movimiento reducido a todo Motion; en CSS,
  cada animación nueva va dentro de `@media (prefers-reduced-motion: no-preference)`.
- Solo `transform` y `opacity`. Desplazamientos de hover < 2 px. Todo movimiento que dure
  más de 5 s debe poder pausarse (la cinta de tecnologías tiene su botón).

## 📝 Development Guidelines

### Creating a New Feature

1. Create feature folder: `features/my-feature/`
2. Add components: `features/my-feature/components/`
3. Add hooks if needed: `features/my-feature/hooks/`
4. Define types: `features/my-feature/types.ts`
5. Export main component: `features/my-feature/index.ts`

### Example Feature Structure:
```
features/
└── hero/
    ├── components/
    │   ├── HeroTitle.tsx
    │   ├── HeroSubtitle.tsx
    │   └── HeroCTA.tsx
    ├── hooks/
    │   └── useHeroAnimation.ts
    ├── types.ts
    └── index.ts  (exports Hero component)
```

### Shared Components

Create reusable UI components in `shared/components/ui/`:
- Button, Input, Card, Modal, etc.
- These should be generic and feature-agnostic
- Use composition patterns for flexibility

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📦 Scripts

- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `lint` - Run ESLint

## Convenciones de código

- **Todo el código en inglés**: identificadores, nombres de archivos y carpetas, tipos, claves de
  i18n, clases CSS de componentes, comentarios. En español solo el texto visible (valores de
  i18n, `aria-label`, copy) y la documentación.
- **Comentarios mínimos**: el código se lee solo. Solo un "por qué" no obvio, en una línea.
  Nada de comentarios narrativos, banners ni referencias a diseños o decisiones fechadas.
- Se mantienen en español por contrato externo: rutas públicas y anclas (`/privacidad`,
  `#servicios`, `#ejemplos`…), campos JSON de la API (`sesion_id`, `mensaje`…), tokens de
  `globals.css` (`--papel`, `--tinta`, `--marca`…) y claves de `localStorage`.

## 🎨 Styling Conventions

- Utilidades de Tailwind para layout; tokens de `globals.css` para color y tipografía.
- Las clases del sistema (`.action`, `.eyebrow`, `.heading`…) viven en `@layer components`
  para que una utilidad pueda sobrescribirlas.
- No hay `tailwind.config.ts`: Tailwind 4 se configura con `@theme` en `globals.css`.

## 🔄 State Management with Zustand

This project uses **Zustand** for global state management - a lightweight, scalable solution perfect for modern React applications.

### Why Zustand?
- Minimal boilerplate compared to Redux
- TypeScript-first with excellent type inference
- No providers needed - works directly with hooks
- Small bundle size (~1kb gzipped)
- Built-in devtools support

### Store Structure

Create stores in `shared/store/` for global state or within features for feature-specific state:

```
shared/
└── store/
    ├── useUIStore.ts         # UI state (modals, sidebar, etc.)
    ├── useUserStore.ts       # User data and auth
    └── useFormStore.ts       # Form state if needed

features/
└── contact/
    └── store/
        └── useContactStore.ts  # Contact form specific state
```

### Creating a Store

**Example: UI Store**
```typescript
// shared/store/useUIStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  isMenuOpen: boolean;
  isModalOpen: boolean;
  modalContent: string | null;
  toggleMenu: () => void;
  openModal: (content: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      isMenuOpen: false,
      isModalOpen: false,
      modalContent: null,
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
      openModal: (content) => set({ isModalOpen: true, modalContent: content }),
      closeModal: () => set({ isModalOpen: false, modalContent: null }),
    }),
    { name: 'UIStore' }
  )
);
```

### Using Stores in Components

```typescript
// In any component
import { useUIStore } from '@/shared/store/useUIStore';

export function Header() {
  const { isMenuOpen, toggleMenu } = useUIStore();

  return (
    <button onClick={toggleMenu}>
      {isMenuOpen ? 'Close' : 'Open'} Menu
    </button>
  );
}
```

### Best Practices

1. **Keep stores focused**: One store per domain (UI, User, Form, etc.)
2. **Colocate feature stores**: Feature-specific state lives in the feature folder
3. **Use selectors for optimization**: `const isMenuOpen = useUIStore(state => state.isMenuOpen)`
4. **Actions in the store**: Keep all state mutations as store methods
5. **TypeScript everything**: Always type your store interfaces
6. **Use devtools in development**: Wrap stores with `devtools()` middleware

### Zustand + Server Components

With Next.js App Router, remember:
- Zustand works in **Client Components** only (use `'use client'` directive)
- For server-side data, use Server Components and pass props
- Use Zustand for client-side interactive state only

## 🧪 Testing Strategy (Future)

- Unit tests: Feature-specific logic and hooks
- Integration tests: Feature flows
- E2E tests: Critical user journeys

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [Screaming Architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html)
- [Vercel Skills](https://skills.sh)

## 🤝 Contributing

When adding new features:
1. Follow the feature-based structure
2. Keep features independent
3. Use shared components for reusable UI
4. Document complex logic
5. Use TypeScript strictly

## ⚠️ Important Instructions for AI Assistants

### Documentation Files
- **DO NOT** create summary documentation files (like OPTIMIZATIONS.md, SUMMARY.md, CHANGES.md, etc.) unless explicitly requested by the user
- Only create .md files when the user specifically asks for documentation
- Focus on code changes and verbal summaries instead of generating additional documentation files

---

**Last Updated**: 2026-09-28
**Version**: 2.0.0
