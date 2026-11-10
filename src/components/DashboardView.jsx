import React from 'react';
import { useNavigate } from 'react-router-dom';
import KpiCard from './KpiCard';
import ThemeToggle from './ThemeToggle';
import FilterPanel from './FilterPanel';
import AnalyticsChart from './AnalyticsChart';
import { useDashboardStore } from '../store/useDashboardStore';

export default function DashboardView({
  isLoading = false,
  error = null,
  kpis = [],
  countries = [],
}) {
  const theme = useDashboardStore((state) => state.theme);
  const favorites = useDashboardStore((state) => state.favorites);
  const toggleFavorite = useDashboardStore((state) => state.toggleFavorite);

  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const styles = {
    container: {
      padding: '24px',
      fontFamily: 'sans-serif',
      minHeight: '100vh',
      backgroundColor: isDark ? '#1a1a1a' : '#f4f6f8',
      color: isDark ? '#ffffff' : '#333333',
      transition: 'all 0.3s ease',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    kpiGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    thTd: {
      padding: '12px 16px',
      textAlign: 'left',
      borderBottom: isDark ? '1px solid #444' : '1px solid #eee',
    },
    tr: {
      cursor: 'pointer',
      transition: 'background-color 0.15s ease',
    },
    favBtn: {
      background: 'none',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer',
    },
    statusBox: {
      padding: '32px',
      textAlign: 'center',
      fontSize: '18px',
      backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
      borderRadius: '8px',
      marginTop: '16px',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Країни — Панель керування</h1>
        <ThemeToggle />
      </header>

      <FilterPanel />

      <section style={styles.kpiGrid}>
        {isLoading ? (
          [1, 2, 3].map((id) => (
            <KpiCard key={id} title="Завантаження..." value="..." />
          ))
        ) : kpis.length > 0 ? (
          kpis.map((kpi) => (
            <KpiCard key={kpi.id || kpi.title} title={kpi.title} value={kpi.value} />
          ))
        ) : (
          <KpiCard title="Знайдено країн" value="0" />
        )}
      </section>

      {/* Віджет Графіка */}
      {!isLoading && !error && countries.length > 0 && (
        <AnalyticsChart countries={countries} />
      )}

      <main>
        {isLoading && (
          <div style={styles.statusBox}>
             Завантаження даних... Зачекайте, будь ласка.
          </div>
        )}

        {error && !isLoading && (
          <div style={{ ...styles.statusBox, color: '#ff6b6b' }}>
             Помилка завантаження: {error}
          </div>
        )}

        {!isLoading && !error && countries.length === 0 && (
          <div style={styles.statusBox}>
             За вказаними критеріями країн не знайдено.
          </div>
        )}

        {!isLoading && !error && countries.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr style={{ backgroundColor: isDark ? '#333' : '#f0f0f0' }}>
                <th style={styles.thTd}>★</th>
                <th style={styles.thTd}>Код</th>
                <th style={styles.thTd}>Країна</th>
                <th style={styles.thTd}>Столиця</th>
                <th style={styles.thTd}>Регіон</th>
                <th style={styles.thTd}>Населення</th>
                <th style={styles.thTd}>Площа (км²)</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((country) => {
                const isFav = favorites.includes(country.id);
                return (
                  <tr 
                    key={country.id} 
                    style={styles.tr}
                    onClick={() => navigate(`/country/${country.id}`)}
                  >
                    {/* Кнопка Обраного в списку */}
                    <td 
                      style={styles.thTd} 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(country.id);
                      }}
                    >
                      <button style={styles.favBtn}>
                        {isFav ? '⭐' : '☆'}
                      </button>
                    </td>
                    <td style={styles.thTd}><strong>{country.id}</strong></td>
                    <td style={styles.thTd}>{country.name}</td>
                    <td style={styles.thTd}>{country.capital}</td>
                    <td style={styles.thTd}>{country.region}</td>
                    <td style={styles.thTd}>{(country.population ?? 0).toLocaleString()}</td>
                    <td style={styles.thTd}>{(country.area ?? 0).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}