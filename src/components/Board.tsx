import React, { useState, useRef, useEffect } from 'react';

import initialize from '../utils/initialize';

import './Board.scss';
import Square from './Square';

interface CheckData {
  index: number;
  number: string;
}

interface Props {
  difficulty: string;
  returnToMainMenu: (e: React.MouseEvent) => void;
}

function Board({ difficulty, returnToMainMenu }: Props) {
  const [board, setBoard] = useState(() => initialize(difficulty));
  const [gameOver, setGameOver] = useState(false);
  const boardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    resizeBoard();
  }, []);

  function resizeBoard() {
    if (boardRef.current) {
      const width = boardRef.current.clientWidth;
      boardRef.current.style.height = width + 'px';
    }
  }

  window.addEventListener('resize', resizeBoard);

  function handleNumber(value: string, index: number) {
    const update = [...board];
    update[index].number = value;
    setBoard(update);
    checkBoard();
    handleFocus(index);
    checkWin();
  }

  function handleDelete(index: number) {
    const update = [...board];
    update[index].number = '';
    setBoard(update);
    checkBoard();
  }

  function checkBoard() {
    let checks: CheckData[] = [];
    let errors: CheckData[] = [];

    // Check rows
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const index = i * 9 + j;
        if (board[index].number) checks.push({ index, number: board[index].number });
      }
      if (checks.length) {
        errors = [...errors, ...checkDuplicates(checks)];
      }

      checks = [];
    }

    // Check columns
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 81; j += 9) {
        const index = i + j;
        if (board[index].number) checks.push({ index, number: board[index].number });
      }
      if (checks.length) {
        errors = [...errors, ...checkDuplicates(checks)];
      }
      checks = [];
    }

    // Check boxes
    const boxes = [
      [0, 1, 2, 9, 10, 11, 18, 19, 20],
      [3, 4, 5, 12, 13, 14, 21, 22, 23],
      [6, 7, 8, 15, 16, 17, 24, 25, 26],
      [27, 28, 29, 36, 37, 38, 45, 46, 47],
      [30, 31, 32, 39, 40, 41, 48, 49, 50],
      [33, 34, 35, 42, 43, 44, 51, 52, 53],
      [54, 55, 56, 63, 64, 65, 72, 73, 74],
      [57, 58, 59, 66, 67, 68, 75, 76, 77],
      [60, 61, 62, 69, 70, 71, 78, 79, 80],
    ];

    for (let i = 0; i < boxes.length; i++) {
      for (let j = 0; j < boxes[i].length; j++) {
        const index = boxes[i][j];
        if (board[index].number) checks.push({ index, number: board[index].number });
      }
      if (checks.length) {
        errors = [...errors, ...checkDuplicates(checks)];
      }
      checks = [];
    }

    const set = new Set(errors.map((x) => x.index));

    const update = [...board];
    for (let i = 0; i < board.length; i++) {
      if (set.has(i)) {
        update[i].error = true;
      } else {
        update[i].error = false;
      }
    }
    setBoard(update);
  }

  function checkDuplicates(checks: CheckData[]) {
    let duplicates: CheckData[] = [];

    for (let i = 1; i < 10; i++) {
      const numbers = checks.filter((x) => x.number === i.toString());
      if (numbers.length < 2) continue;
      duplicates = [...duplicates, ...numbers];
    }

    if (!duplicates.length) return [];
    return duplicates;
  }

  function checkWin() {
    const check = board.every((square) => square.number !== '' && !square.error);

    if (check) {
      setGameOver(true);
      if (boardRef.current) boardRef.current.classList.add('GameOver');
    }
  }

  function handleFocus(index: number) {
    const number = board[index].number;
    if (!number) {
      handleBlur();
      return;
    }
    const update = [...board];
    for (let i = 0; i < board.length; i++) {
      if (board[i].number === number) {
        board[i].highlight = true;
      } else {
        board[i].highlight = false;
      }
    }
    setBoard(update);
  }

  function handleBlur() {
    const update = [...board];
    for (let i = 0; i < board.length; i++) {
      board[i].highlight = false;
    }
    setBoard(update);
  }

  return (
    <section className="game">
      <section ref={boardRef} className="Board">
        {board.map((square, index) => {
          return (
            <Square
              {...square}
              gameOver={gameOver}
              index={index}
              handleNumber={handleNumber}
              handleDelete={handleDelete}
              handleFocus={handleFocus}
              handleBlur={handleBlur}
              key={index}
            />
          );
        })}
      </section>
      <button onClick={returnToMainMenu}>Main menu</button>
    </section>
  );
}

export default Board;
