import generate from './sudoku.js';

interface BoardData {
  editable: boolean;
  error: boolean;
  number: string;
}

function initialize(difficulty: string) {
  const board: BoardData[] = [];

  let clues = 0;
  if (difficulty === 'easy') clues = getRandomNumber(37, 48);
  if (difficulty === 'medium') clues = getRandomNumber(27, 36);
  if (difficulty === 'hard') clues = getRandomNumber(19, 26);

  const sudoku = generate(clues);

  for (let i = 0; i < sudoku.length; i++) {
    if (sudoku[i] === 0) {
      board.push({ number: '', editable: true, error: false });
    } else {
      const number = sudoku[i].toString();
      board.push({ number, editable: false, error: false });
    }
  }

  return board;
}

function getRandomNumber(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default initialize;
