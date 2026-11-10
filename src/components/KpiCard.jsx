import React from 'react';
import { useDashboardStore } from '../store/useDashboardStore';

export default function KpiCard({ title, value }) {
  const theme = useDashboardStore((state) => state.theme);
  const isDark = theme === 'dark';

  const cardStyle = {
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
    color: isDark ? '#ffffff' : '#333333',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  };

  return (
    <div style={cardStyle}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.8 }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{value}</p>
    </div>
  );
}