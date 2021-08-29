import React from 'react';

import './Square.scss';

interface Props {
  error: boolean;
  index: number;
  handleNumber: (input: string, index: number) => void;
  handleDelete: (index: number) => void;
}

function Square({ error, index, handleNumber, handleDelete }: Props) {
  function handleInput(e: React.KeyboardEvent<HTMLInputElement>) {
    const valid = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9'];

    if (!valid.includes(e.code)) {
      e.preventDefault();
      return;
    }
    handleNumber(e.key, index);
    e.currentTarget.value = e.key;
  }
  function handleRemoveInput(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === 'Backspace') handleDelete(index);
  }

  return (
    <div className="Square">
      <input
        className={error ? 'error' : ''}
        onKeyPress={handleInput}
        onKeyUp={handleRemoveInput}
        type="tel"
        maxLength={1}
      />
    </div>
  );
}

export default Square;
