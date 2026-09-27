# Landing Page Project

## 📋 Project Overview
Modern landing page built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4 following Screaming Architecture principles.

## 🏗️ Architecture: Screaming Architecture

This project follows **Screaming Architecture** - the folder structure screams what the application does, not what framework it uses.

### Directory Structure

```
frontend/
├── app/                          # Next.js App Router (infrastructure)
│   ├── (routes)/                 # Route groups
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
│
├── features/                     # Business features (THE CORE)
│   ├── hero/                    # Hero section feature
│   │   ├── components/          # Hero-specific components
│   │   ├── hooks/              # Hero-specific hooks
│   │   └── types.ts            # Hero types
│   │
│   ├── procesos/                # Procesos que se automatizan (3 filas)
│   ├── proceso/                 # Cómo trabajamos (3 fases)
│   ├── porque/                  # Por qué AIworks
│   ├── preguntas/               # FAQ (acordeón accesible)
│   └── cta-final/               # Cierre: WhatsApp + correo
│
├── shared/                       # Shared/reusable code
│   ├── components/              # UI components (Button, Input, Card, etc)
│   │   ├── ui/                 # Base UI components
│   │   └── layout/             # Layout components (Header, Footer)
│   │
│   ├── hooks/                   # Shared hooks (useMediaQuery, useScroll)
│   ├── lib/                     # Utilities and helpers
│   │   ├── utils.ts            # General utilities
│   │   └── validations.ts      # Form validations
│   │
│   ├── types/                   # Shared TypeScript types
│   └── constants/               # App-wide constants
│
├── styles/                      # Global styles
│   └── globals.css             # Tailwind imports & global CSS
│
└── public/                      # Static assets
    ├── images/
    ├── icons/
    └── fonts/
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

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Linting**: ESLint
- **Package Manager**: npm

## 🤖 Skills de diseño

**Corregido el 2026-09-25.** Este archivo declaraba como instaladas cuatro skills
(`react-best-practices`, `web-design-guidelines`, `composition-patterns`,
`react-native-skills`) cuyos symlinks en `.claude/skills/` apuntaban a `../../.agents/skills/`,
un directorio que no existe. Estaban rotas desde enero y no cargaban nada.

### Instalada y vigente

- **`frontend-design`** (oficial de Anthropic, desde `claude-plugins-official`), en
  `.claude/skills/frontend-design/`. Es la que manda para cualquier trabajo visual en este
  proyecto: dirección estética, tipografía y la lista de clichés generativos a evitar.

### Sistema visual

Antes de tocar estilos, lee
`../../../changes/rediseno-landing-octubre/sistema-visual.md`. Contiene los tokens, la
escala tipográfica, el wireframe de cada bloque y —lo importante— **la autocrítica contra los
cinco clichés de diseño generado por IA**, con qué se corrigió y por qué.

Reglas duras que salen de ahí y que aplican a todo código nuevo de UI:

- Cero gradientes, cero glassmorphism, cero `shadow-*`.
- La estructura son **filas con reglas** (`.fila`), no tarjetas. Un grid de tarjetas
  idénticas es el cliché generativo más reconocible.
- Cero etiquetas en VERSALITAS, cero cadenas tipo `A · B · C`, cero `→` pegado al texto de un
  botón.
- Una sola animación en toda la página: el registro operativo del hero. Nada de entradas
  animadas por sección.
- Tipografía: IBM Plex Sans para texto, IBM Plex Mono **solo** donde hay un dato que se
  alinea en columna (horas, números de fase). Nunca como etiqueta decorativa.
- Todo alineado a la izquierda, incluido el hero.

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

## 🎨 Styling Conventions

- Use Tailwind utility classes
- Create custom utilities in `tailwind.config.ts` when needed
- Keep component-specific styles in the component file
- Use CSS variables for theme values

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

**Last Updated**: 2026-09-25
**Version**: 1.1.0
