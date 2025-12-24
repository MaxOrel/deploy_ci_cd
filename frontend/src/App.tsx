import React, { useState } from 'react';
import { PercentDisplay } from './components/PercentDisplay';
import { Statistics } from './components/Statistics';
import { History } from './components/History';
import { ConfirmModal } from './components/ConfirmModal';
import { usePercent } from './hooks/usePercent';
import { useHistory } from './hooks/useHistory';
import { useStatistics } from './hooks/useStatistics';
import './App.css';

export default function App() {
  const { percent, loading, error, generate } = usePercent();
  const { history, load: loadHistory, clear: clearHistory } = useHistory();
  const { statistics, load: loadStatistics } = useStatistics();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerate = async () => {
    try {
      await generate();
      await loadHistory();
      await loadStatistics();
    } catch (e) {
      // Ошибка уже обработана в хуке
    }
  };

  const handleClearHistoryClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmClear = async () => {
    setIsModalOpen(false);
    try {
      await clearHistory();
      await loadStatistics();
    } catch (e) {
      // Ошибка уже обработана в хуке
    }
  };

  const handleCancelClear = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎲 Генератор случайных процентов</h1>
        <p className="subtitle">Демо приложение для вебинара по контейнеризации</p>
      </header>

      <main className="main">
        <PercentDisplay
          percent={percent}
          loading={loading}
          error={error}
          onGenerate={handleGenerate}
        />

        <Statistics statistics={statistics} />

        <History
          history={history}
          loading={loading}
          onClear={handleClearHistoryClick}
        />
      </main>

      <footer className="footer">
        <p>Создано для вебинара по Docker | Backend: NestJS | Frontend: React</p>
      </footer>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Подтверждение"
        message="Вы уверены, что хотите очистить всю историю генераций?"
        onConfirm={handleConfirmClear}
        onCancel={handleCancelClear}
      />
    </div>
  );
}
