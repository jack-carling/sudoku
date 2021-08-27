import React, { useRef, useEffect } from 'react';

import './Board.scss';
import Square from './Square';

interface BoardData {
  number: string;
  editable: boolean;
}

function Board() {
  const board: BoardData[] = [];
  for (let i = 0; i < 81; i++) {
    board.push({ number: '', editable: true });
  }

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

  return (
    <section ref={boardRef} className="Board">
      {board.map((square, index) => {
        return <Square key={index} />;
      })}
    </section>
  );
}

export default Board;
