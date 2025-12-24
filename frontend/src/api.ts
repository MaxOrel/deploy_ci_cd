// Use environment variable or fallback to default
// REACT_APP_API_URL is injected at build time by react-scripts
const baseUrl = process.env.REACT_APP_API_URL || 'https://api.mentor.nomoredomainswork.ru/';

export const getRandomPercent = async () => {
  const response = await fetch(baseUrl);

  if (response.ok) {
    return response.text();
  }

  return Promise.reject('Ошибка!');
};
