import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useDashboardStore } from '../store/useDashboardStore';

export default function AnalyticsChart({ countries = [] }) {
  const theme = useDashboardStore((state) => state.theme);
  const chartType = useDashboardStore((state) => state.chartType);
  const setChartType = useDashboardStore((state) => state.setChartType);

  const isDark = theme === 'dark';

  // Готуємо TOP-10 країн за населенням із відфільтрованого списку
  const chartData = countries.slice(0, 10).map((c) => ({
    name: c.id,
    population: Math.round(c.population / 1_000_000), // в мільйонах
  }));

  const styles = {
    wrapper: {
      backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    btnGroup: {
      display: 'flex',
      gap: '8px',
    },
    btn: (active) => ({
      padding: '6px 12px',
      borderRadius: '4px',
      border: '1px solid #007bff',
      backgroundColor: active ? '#007bff' : 'transparent',
      color: active ? '#ffffff' : isDark ? '#ffffff' : '#333333',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'all 0.2s',
    }),
  };

  const renderChart = () => {
    if (chartData.length === 0) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>Немає даних для графіка</div>;
    }

    const color = isDark ? '#8884d8' : '#007bff';

    switch (chartType) {
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#ccc'} />
            <XAxis dataKey="name" stroke={isDark ? '#fff' : '#333'} />
            <YAxis stroke={isDark ? '#fff' : '#333'} unit="M" />
            <Tooltip contentStyle={{ backgroundColor: isDark ? '#333' : '#fff' }} />
            <Line type="monotone" dataKey="population" name="Населення (млн)" stroke={color} strokeWidth={3} />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#ccc'} />
            <XAxis dataKey="name" stroke={isDark ? '#fff' : '#333'} />
            <YAxis stroke={isDark ? '#fff' : '#333'} unit="M" />
            <Tooltip contentStyle={{ backgroundColor: isDark ? '#333' : '#fff' }} />
            <Area type="monotone" dataKey="population" name="Населення (млн)" fill={color} stroke={color} />
          </AreaChart>
        );

      case 'bar':
      default:
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#ccc'} />
            <XAxis dataKey="name" stroke={isDark ? '#fff' : '#333'} />
            <YAxis stroke={isDark ? '#fff' : '#333'} unit="M" />
            <Tooltip contentStyle={{ backgroundColor: isDark ? '#333' : '#fff' }} />
            <Bar dataKey="population" name="Населення (млн)" fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h3 style={{ margin: 0 }}> Аналітика населення (ТОП-10 у вибірці)</h3>
        
        {/* Перемикач типів графіків */}
        <div style={styles.btnGroup}>
          <button style={styles.btn(chartType === 'bar')} onClick={() => setChartType('bar')}>
             Стовпчиковий
          </button>
          <button style={styles.btn(chartType === 'line')} onClick={() => setChartType('line')}>
             Лінійний
          </button>
          <button style={styles.btn(chartType === 'area')} onClick={() => setChartType('area')}>
             Обласна
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}