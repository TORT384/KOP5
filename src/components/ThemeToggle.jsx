import React from 'react';
import { useDashboardStore } from '../store/useDashboardStore';

export default function ThemeToggle() {
  const theme = useDashboardStore((state) => state.theme);
  const toggleTheme = useDashboardStore((state) => state.toggleTheme);

  return (
    <button 
      onClick={toggleTheme}
      style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' }}
    >
      Переключити тему ({theme === 'light' ? ' Dark' : ' Light'})
    </button>
  );
}