'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  isMenuOpen: boolean;
  isModalOpen: boolean;
  modalContent: string | null;
  activeSection: string | null;
  toggleMenu: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  openModal: (content: string) => void;
  closeModal: () => void;
  setActiveSection: (section: string | null) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      isMenuOpen: false,
      isModalOpen: false,
      modalContent: null,
      activeSection: null,
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
      openMenu: () => set({ isMenuOpen: true }),
      closeMenu: () => set({ isMenuOpen: false }),
      openModal: (content) => set({ isModalOpen: true, modalContent: content }),
      closeModal: () => set({ isModalOpen: false, modalContent: null }),
      setActiveSection: (section) => set({ activeSection: section }),
    }),
    { name: 'UIStore' }
  )
);

// Note: For optimal re-render prevention, use direct selectors in components:
// const isMenuOpen = useUIStore((state) => state.isMenuOpen);
// const toggleMenu = useUIStore((state) => state.toggleMenu);
//
// This approach ensures:
// 1. Components only re-render when their specific state slice changes
// 2. No object creation on every render (avoids infinite loops)
// 3. Better performance with primitive value subscriptions
