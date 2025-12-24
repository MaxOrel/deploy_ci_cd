const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const getRandomPercent = async () => {
  const response = await fetch(`${baseUrl}/`);

  if (response.ok) {
    return response.text();
  }

  return Promise.reject('Ошибка при генерации процента!');
};

export const getHistory = async (limit: number = 10) => {
  const response = await fetch(`${baseUrl}/history?limit=${limit}`);

  if (response.ok) {
    return response.json();
  }

  return Promise.reject('Ошибка при загрузке истории!');
};

export const getStatistics = async () => {
  const response = await fetch(`${baseUrl}/statistics`);

  if (response.ok) {
    return response.json();
  }

  return Promise.reject('Ошибка при загрузке статистики!');
};

export const clearHistory = async () => {
  const response = await fetch(`${baseUrl}/history`, {
    method: 'DELETE',
  });

  if (response.ok) {
    return response.json();
  }

  return Promise.reject('Ошибка при очистке истории!');
};
