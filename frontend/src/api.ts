const baseUrl = 'http://localhost:4000/';

export const getRandomPercent = async () => {
  const response = await fetch(baseUrl);

  if (response.ok) {
    return response.text();
  }

  return Promise.reject('Ошибка!');
};
