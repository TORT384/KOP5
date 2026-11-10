import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetchCountries from '../hooks/useFetchCountries';
import ThemeToggle from '../components/ThemeToggle';
import { useDashboardStore } from '../store/useDashboardStore';

export default function CountryDetailsPage() {
  const { code } = useParams();
  const navigate = useNavigate();

  const theme = useDashboardStore((state) => state.theme);
  const favorites = useDashboardStore((state) => state.favorites);
  const toggleFavorite = useDashboardStore((state) => state.toggleFavorite);

  const { data: countries, loading, error } = useFetchCountries();
  const isDark = theme === 'dark';

  const styles = {
    container: {
      padding: '24px',
      fontFamily: 'sans-serif',
      minHeight: '100vh',
      backgroundColor: isDark ? '#1a1a1a' : '#f4f6f8',
      color: isDark ? '#ffffff' : '#333333',
    },
    card: {
      backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
      padding: '32px',
      borderRadius: '8px',
      marginTop: '20px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    backBtn: {
      padding: '8px 16px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    favBtn: {
      padding: '8px 16px',
      marginLeft: '12px',
      borderRadius: '4px',
      border: '1px solid #ffb703',
      backgroundColor: 'transparent',
      color: isDark ? '#fff' : '#333',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    detailRow: {
      margin: '12px 0',
      fontSize: '16px',
    }
  };

  if (loading) return <div style={styles.container}> Завантаження деталей...</div>;
  if (error) return <div style={styles.container}> Помилка: {error}</div>;

  const country = countries.find(
    (c) => String(c.id).toLowerCase() === String(code).toLowerCase()
  );

  if (!country) {
    return (
      <div style={styles.container}>
        <button onClick={() => navigate('/')} style={styles.backBtn}>
          ← Назад до списку
        </button>
        <div style={styles.card}>
          <h2> Країну з кодом "{code}" не знайдено.</h2>
        </div>
      </div>
    );
  }

  const isFav = favorites.includes(country.id);
  const density = country.area > 0 ? (country.population / country.area).toFixed(1) : 'Н/Д';

  return (
    <div style={styles.container}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button onClick={() => navigate('/')} style={styles.backBtn}>
            ← Назад до списку
          </button>
          
          {/* Додавання в Обране зі сторінки деталей */}
          <button onClick={() => toggleFavorite(country.id)} style={styles.favBtn}>
            {isFav ? ' В обраному' : '☆ Додати в обране'}
          </button>
        </div>
        <ThemeToggle />
      </header>

      <div style={styles.card}>
        <h1>{country.name} ({country.id})</h1>
        <hr style={{ borderColor: isDark ? '#444' : '#eee' }} />

        <div style={styles.detailRow}><strong>Столиця:</strong> {country.capital}</div>
        <div style={styles.detailRow}><strong>Регіон:</strong> {country.region}</div>
        <div style={styles.detailRow}><strong>Населення:</strong> {country.population.toLocaleString()} осіб</div>
        <div style={styles.detailRow}><strong>Площа:</strong> {country.area.toLocaleString()} км²</div>
        <div style={styles.detailRow}>
          <strong>Густота населення:</strong> {density} осіб/км²
        </div>
        <div style={styles.detailRow}>
          <strong>Статус даних:</strong> Верифіковано API
        </div>
      </div>
    </div>
  );
}