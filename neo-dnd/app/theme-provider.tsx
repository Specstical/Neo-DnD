"use client";

import { useEffect } from "react";

const THEME_STORAGE_KEY = "neo-dnd-theme";

function applyTheme(theme: string | null) {
  const root = document.documentElement;

  if (theme) {
    root.dataset.theme = theme;
    return;
  }

  delete root.dataset.theme;
}

export function ThemeProvider() {
  useEffect(() => {
    applyTheme(window.localStorage.getItem(THEME_STORAGE_KEY));

    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        applyTheme(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return null;
}

export { THEME_STORAGE_KEY, applyTheme };