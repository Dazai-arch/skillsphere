import { useState, useEffect } from 'react';

/**
 * Shared theme hook — reads/writes to localStorage + syncs with OS preference.
 * Sets data-theme on <html> so all CSS vars work instantly.
 */
export default function useTheme() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ss-theme');

    if (saved) {
      const dark = saved === 'dark';
      setIsDark(dark);
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    } else {
      const mq = window.matchMedia('(prefers-color-scheme: light)');
      const apply = (e) => {
        const light = e.matches;
        setIsDark(!light);
        document.documentElement.setAttribute('data-theme', light ? 'light' : 'dark');
      };
      apply(mq);
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('ss-theme', next ? 'dark' : 'light');
  };

  return { isDark, toggleTheme };
}