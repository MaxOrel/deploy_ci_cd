import React from 'react';
import { getRandomPercent } from './api';

export default function App() {
  const [percent, setPercent] = React.useState(0);

  const handleButtonClick = () => {
    getRandomPercent()
      .then(res => {
        setPercent(parseInt(res, 10));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <h1>Генератор случайных процентов</h1>
      <p>
        <span>{percent}</span>
      </p>
      <button type="button" onClick={handleButtonClick}>Сгенерировать</button>
    </>
  );
}
