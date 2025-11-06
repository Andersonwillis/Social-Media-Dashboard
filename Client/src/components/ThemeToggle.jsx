import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'smd-theme'; // 'auto' | 'dark' | 'light'

function applyTheme(mode) {
  const body = document.body;
  body.classList.remove('theme-light','theme-dark','theme-auto','theme-dark-active');
  body.classList.add(`theme-${mode}`);
  if (mode === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.add('theme-dark-active');
  }
}

export default function ThemeToggle() {
  const [mode, setMode] = useState(localStorage.getItem(STORAGE_KEY) || 'auto');

  useEffect(() => {
    applyTheme(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const handler = () => (localStorage.getItem(STORAGE_KEY) || 'auto') === 'auto' && applyTheme('auto');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isDark = mode === 'dark' || (mode === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  const cycle = () => setMode(mode === 'auto' ? 'dark' : mode === 'dark' ? 'light' : 'auto');

  return (
    <button
      id="theme-toggle"
      className="switch"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={cycle}
    />
  );
}