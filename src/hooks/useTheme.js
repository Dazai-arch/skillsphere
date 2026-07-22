import { useState, useEffect } from 'react';

/**
 * Shared theme hook — reads/writes to localStorage + syncs with OS preference.
 * Sets data-theme on <html> so all CSS vars work instantly.
 */
export default function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('ss-theme');
    if (saved) return saved === 'dark';
    // Fallback to system preference if no manual selection exists
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // default
  });

  useEffect(() => {
    const themeStr = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeStr);
    localStorage.setItem('ss-theme', themeStr);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return { isDark, toggleTheme };
}