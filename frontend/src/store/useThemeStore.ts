import { create } from "zustand";

interface ThemeInterface {
  theme: string,
  setTheme: (theme: string) => void
}

export const useThemeStore = create<ThemeInterface>((set) => ({
  theme: localStorage.getItem("chat-theme") || "dark",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme })
  }
}));