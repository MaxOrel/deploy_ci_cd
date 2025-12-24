import React from 'react';

interface HistoryItem {
  id: number;
  percent: number;
  createdAt: string;
}

interface HistoryProps {
  history: HistoryItem[];
  loading: boolean;
  onClear: () => void;
}

export const History: React.FC<HistoryProps> = ({ history, loading, onClear }) => {
  if (history.length === 0 && !loading) {
    return (
      <div className="empty-state">
        <p>История пуста. Сгенерируйте первый процент!</p>
      </div>
    );
  }

  if (history.length === 0) {
    return null;
  }

  return (
    <section className="history-section">
      <div className="history-header">
        <h2>📜 История генераций (последние 10)</h2>
        <button onClick={onClear} className="clear-button">
          🗑️ Очистить историю
        </button>
      </div>
      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item">
            <span className="history-percent">{item.percent}%</span>
            <span className="history-date">
              {new Date(item.createdAt).toLocaleString('ru-RU')}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
