import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

// ============================================================
// THEME CONTEXT — dark mode, accent color, font size
// ============================================================

export type ThemeMode = "light" | "dark";
export type AccentColor = "indigo" | "emerald" | "rose" | "amber";
export type FontSize = "sm" | "md" | "lg";

interface ThemeContextType {
  theme: ThemeMode;
  accentColor: AccentColor;
  fontSize: FontSize;
  setTheme: (t: ThemeMode) => void;
  setAccentColor: (a: AccentColor) => void;
  setFontSize: (f: FontSize) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY_THEME = "suggestify_theme";
const STORAGE_KEY_ACCENT = "suggestify_accent";
const STORAGE_KEY_FONTSIZE = "suggestify_fontsize";

function applyToHtml(
  theme: ThemeMode,
  accent: AccentColor,
  fontSize: FontSize,
) {
  const html = document.documentElement;

  // Dark mode
  if (theme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }

  // Accent color
  html.classList.remove(
    "accent-indigo",
    "accent-emerald",
    "accent-rose",
    "accent-amber",
  );
  html.classList.add(`accent-${accent}`);

  // Font size
  html.classList.remove("font-size-sm", "font-size-md", "font-size-lg");
  html.classList.add(`font-size-${fontSize}`);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem(STORAGE_KEY_THEME) as ThemeMode) || "light";
  });
  const [accentColor, setAccentState] = useState<AccentColor>(() => {
    return (
      (localStorage.getItem(STORAGE_KEY_ACCENT) as AccentColor) || "indigo"
    );
  });
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem(STORAGE_KEY_FONTSIZE) as FontSize) || "md";
  });

  // Apply on mount + whenever values change
  useEffect(() => {
    applyToHtml(theme, accentColor, fontSize);
  }, [theme, accentColor, fontSize]);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY_THEME, t);
  };

  const setAccentColor = (a: AccentColor) => {
    setAccentState(a);
    localStorage.setItem(STORAGE_KEY_ACCENT, a);
  };

  const setFontSize = (f: FontSize) => {
    setFontSizeState(f);
    localStorage.setItem(STORAGE_KEY_FONTSIZE, f);
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider
      value={{
        theme,
        accentColor,
        fontSize,
        setTheme,
        setAccentColor,
        setFontSize,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
