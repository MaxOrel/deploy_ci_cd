import React from 'react';

interface StatisticsData {
  total: number;
  average: number;
  min: number;
  max: number;
  median: number;
}

interface StatisticsProps {
  statistics: StatisticsData | null;
}

export const Statistics: React.FC<StatisticsProps> = ({ statistics }) => {
  if (!statistics || statistics.total === 0) {
    return null;
  }

  return (
    <section className="statistics-section">
      <h2>📊 Статистика</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Всего генераций</div>
          <div className="stat-value">{statistics.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Среднее</div>
          <div className="stat-value">{statistics.average}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Минимум</div>
          <div className="stat-value">{statistics.min}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Максимум</div>
          <div className="stat-value">{statistics.max}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Медиана</div>
          <div className="stat-value">{statistics.median}%</div>
        </div>
      </div>
    </section>
  );
};
