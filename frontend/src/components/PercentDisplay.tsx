import React from 'react';

interface PercentDisplayProps {
  percent: number | null;
  loading: boolean;
  error: string | null;
  onGenerate: () => void;
}

export const PercentDisplay: React.FC<PercentDisplayProps> = ({
  percent,
  loading,
  error,
  onGenerate,
}) => {
  return (
    <section className="generator-section">
      <div className="percent-display">
        {percent !== null ? (
          <span className="percent-value">{percent}%</span>
        ) : (
          <span className="percent-placeholder">-</span>
        )}
      </div>
      <button
        type="button"
        onClick={onGenerate}
        disabled={loading}
        className="generate-button"
      >
        {loading ? 'Генерируем...' : '🎯 Сгенерировать процент'}
      </button>
      {error && <div className="error">{error}</div>}
    </section>
  );
};
