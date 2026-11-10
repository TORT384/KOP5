import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDashboardStore } from '../store/useDashboardStore';

export default function FilterPanel() {
  const theme = useDashboardStore((state) => state.theme);
  const isDark = theme === 'dark';

  const filters = useDashboardStore((state) => state.filters);
  const setFilters = useDashboardStore((state) => state.setFilters);
  const resetFilters = useDashboardStore((state) => state.resetFilters);

  const { control, reset, watch } = useForm({
    defaultValues: filters,
  });

  useEffect(() => {
    const subscription = watch((values) => {
      setFilters(values);
    });
    return () => subscription.unsubscribe();
  }, [watch, setFilters]);

  const handleReset = () => {
    resetFilters();
    reset({
      search: '',
      minPopulation: 0,
      sortKey: 'name',
      sortOrder: 'asc',
    });
  };

  const styles = {
    panel: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '24px',
    },
    group: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    label: {
      fontSize: '13px',
      opacity: 0.8,
    },
    input: {
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      backgroundColor: isDark ? '#333' : '#fff',
      color: isDark ? '#fff' : '#000',
    },
    resetBtn: {
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#ff4d4f',
      color: '#ffffff',
      cursor: 'pointer',
      fontWeight: 'bold',
      alignSelf: 'flex-end',
    },
  };

  return (
    <div style={styles.panel}>
      <div style={styles.group}>
        <label style={styles.label}>Пошук за назвою:</label>
        <Controller
          name="search"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="Введіть назву..."
              style={styles.input}
            />
          )}
        />
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Мін. населення:</label>
        <Controller
          name="minPopulation"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              step="1000000"
              min="0"
              onChange={(e) => field.onChange(Number(e.target.value))}
              style={styles.input}
            />
          )}
        />
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Сортувати за:</label>
        <Controller
          name="sortKey"
          control={control}
          render={({ field }) => (
            <select {...field} style={styles.input}>
              <option value="name">Назва</option>
              <option value="population">Населення</option>
              <option value="area">Площа</option>
            </select>
          )}
        />
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Порядок:</label>
        <Controller
          name="sortOrder"
          control={control}
          render={({ field }) => (
            <select {...field} style={styles.input}>
              <option value="asc">Зростання (↑)</option>
              <option value="desc">Спадання (↓)</option>
            </select>
          )}
        />
      </div>

      <button type="button" onClick={handleReset} style={styles.resetBtn}>
        Скинути фільтри
      </button>
    </div>
  );
}