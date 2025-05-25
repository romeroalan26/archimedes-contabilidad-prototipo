import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      toggleTheme: () => {
        const newMode = !get().isDarkMode;
        set({ isDarkMode: newMode });

        // Aplicar o remover la clase 'dark' del documento
        if (newMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
      setTheme: (isDark: boolean) => {
        set({ isDarkMode: isDark });

        // Aplicar o remover la clase 'dark' del documento
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        // Aplicar el tema guardado al cargar la página
        if (state?.isDarkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
    }
  )
);
