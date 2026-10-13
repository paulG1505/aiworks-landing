'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  isMenuOpen: boolean;
  isModalOpen: boolean;
  modalContent: string | null;
  activeSection: string | null;
  isChatOpen: boolean;
  chatOpener: HTMLElement | null;
  openChat: () => void;
  closeChat: () => void;
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
      isChatOpen: false,
      chatOpener: null,
      openChat: () =>
        set({
          isChatOpen: true,
          chatOpener:
            typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null,
        }),
      closeChat: () => set({ isChatOpen: false }),
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

