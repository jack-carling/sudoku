import React, { useEffect, useRef } from 'react';

import './Square.scss';

interface Props {
  editable: boolean;
  error: boolean;
  highlight: boolean;
  index: number;
  number: string;
  gameOver: boolean;
  handleNumber: (input: string, index: number) => void;
  handleDelete: (index: number) => void;
  handleFocus: (index: number) => void;
  handleBlur: () => void;
}

function Square({
  editable,
  error,
  highlight,
  index,
  number,
  gameOver,
  handleNumber,
  handleDelete,
  handleFocus,
  handleBlur,
}: Props) {
  useEffect(() => {
    if (gameOver) {
      if (inputRef.current) inputRef.current.blur();
    }
  }, [gameOver]);

  const inputRef = useRef<HTMLInputElement>(null);

  function handleInput(e: React.KeyboardEvent<HTMLInputElement>) {
    const valid = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9'];

    if (e.code === 'Backspace') {
      e.currentTarget.value = '';
      handleDelete(index);
      return;
    }

    if (!valid.includes(e.code)) {
      e.preventDefault();
      return;
    }
    handleNumber(e.key, index);
    e.currentTarget.value = e.key;
  }

  return (
    <div
      className={`Square ${highlight ? 'highlight' : ''}`}
      onClick={() => {
        handleFocus(index);
      }}
    >
      {editable && (
        <input
          ref={inputRef}
          onBlur={handleBlur}
          className={error ? 'error' : ''}
          onKeyDown={handleInput}
          type="tel"
          maxLength={1}
        />
      )}
      {!editable && <span className={error ? 'error' : ''}>{number}</span>}
    </div>
  );
}

export default Square;
