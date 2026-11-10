import { create } from 'zustand';

const INITIAL_FILTERS = {
  search: '',
  minPopulation: 0,
  sortKey: 'name',
  sortOrder: 'asc',
};

export const useDashboardStore = create((set) => ({
  // 1. Стан теми
  theme: 'light',
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  // 2. Стан фільтрів
  filters: INITIAL_FILTERS,
  setFilters: (newFilters) => set({ filters: newFilters }),
  resetFilters: () => set({ filters: INITIAL_FILTERS }),

  // 3. Список обраного (Favorites) — зберігаємо масив ID (ISO-кодів)
  favorites: [],
  toggleFavorite: (countryId) =>
    set((state) => {
      const exists = state.favorites.includes(countryId);
      return {
        favorites: exists
          ? state.favorites.filter((id) => id !== countryId)
          : [...state.favorites, countryId],
      };
    }),

  // 4. Тип графіка ('bar' | 'line' | 'area')
  chartType: 'bar',
  setChartType: (type) => set({ chartType: type }),
}));