import React, { useMemo } from 'react';
import DashboardView from '../components/DashboardView';
import useFetchCountries from '../hooks/useFetchCountries';
import useDebounce from '../hooks/useDebounce';
import { useDashboardStore } from '../store/useDashboardStore';

export default function DashboardContainer() {
  const { data: rawCountries, loading, error } = useFetchCountries();
  
  // Селектор фільтрів зі Zustand
  const filters = useDashboardStore((state) => state.filters);
  const debouncedFilters = useDebounce(filters, 400);

  const processedCountries = useMemo(() => {
    if (!rawCountries || rawCountries.length === 0) return [];

    const { search, minPopulation, sortKey, sortOrder } = debouncedFilters;

    return rawCountries
      .filter((c) => {
        const matchesName = c.name.toLowerCase().includes((search || '').toLowerCase().trim());
        const matchesPop = c.population >= (minPopulation || 0);
        return matchesName && matchesPop;
      })
      .sort((a, b) => {
        let aVal = a[sortKey];
        let bVal = b[sortKey];

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [rawCountries, debouncedFilters]);

  const kpis = useMemo(() => {
    if (processedCountries.length === 0) return [];

    const totalCountries = processedCountries.length;
    const totalPopulation = processedCountries.reduce((acc, c) => acc + c.population, 0);
    const avgArea = Math.round(
      processedCountries.reduce((acc, c) => acc + c.area, 0) / totalCountries
    );

    return [
      { id: 'kpi-1', title: 'Знайдено країн', value: totalCountries.toLocaleString() },
      { 
        id: 'kpi-2', 
        title: 'Загальне населення', 
        value: `${(totalPopulation / 1_000_000_000).toFixed(2)} млрд` 
      },
      { 
        id: 'kpi-3', 
        title: 'Середня площа', 
        value: `${avgArea.toLocaleString()} км²` 
      },
    ];
  }, [processedCountries]);

  return (
    <DashboardView
      isLoading={loading}
      error={error}
      kpis={kpis}
      countries={processedCountries}
    />
  );
}