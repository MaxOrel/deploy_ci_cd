const baseUrl = 'https://api.mentor.nomoredomains.monster/';

export const getRandomPercent = async () => {
  const response = await fetch(baseUrl);

  if (response.ok) {
    return response.text();
  }

  return Promise.reject('Ошибка!');
};
