import React, { useState, useRef, useEffect } from 'react';

import './Board.scss';
import Square from './Square';

interface BoardData {
  number: string;
  editable: boolean;
  error: boolean;
}

function Board() {
  const initial: BoardData[] = [];
  for (let i = 0; i < 81; i++) {
    initial.push({ number: '', editable: true, error: false });
  }

  const [board, setBoard] = useState(initial);

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
    checkBoard(index);
  }

  function handleDelete(index: number) {
    const update = [...board];
    update[index].number = '';
    setBoard(update);
    checkBoard(index);
  }

  function checkBoard(index: number) {
    const row = Math.floor(index % 9);
    const col = Math.floor(index / 9);

    let checks: string[] = [];
    let duplicate: boolean;

    // Check row
    for (let i = col * 9; i < col * 9 + 9; i++) {
      if (board[i].number) checks.push(board[i].number);
    }

    duplicate = checkDuplicates(index, checks);
    if (duplicate) return;
    checks = [];

    // Check col
    for (let i = row; i < 81; i += 9) {
      if (board[i].number) checks.push(board[i].number);
    }

    duplicate = checkDuplicates(index, checks);
    if (duplicate) return;
    checks = [];

    // Check box
    let box = Math.floor(row / 3);
    if (col >= 3 && col <= 5) box += 3;
    if (col >= 6 && col <= 8) box += 6;

    const boxIndexes = [
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
  }

  function checkDuplicates(index: number, checks: string[]) {
    const duplicates = checks.filter((number) => board[index].number === number).length > 1;

    if (duplicates) {
      const update = [...board];
      update[index].error = true;
      setBoard(update);
      return true;
    } else {
      const update = [...board];
      update[index].error = false;
      setBoard(update);
      return false;
    }
  }

  return (
    <section ref={boardRef} className="Board">
      {board.map((square, index) => {
        return <Square {...square} index={index} handleNumber={handleNumber} handleDelete={handleDelete} key={index} />;
      })}
    </section>
  );
}

export default Board;
