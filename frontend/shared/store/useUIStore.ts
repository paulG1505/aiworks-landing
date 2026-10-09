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
