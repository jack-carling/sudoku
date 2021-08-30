interface BoardData {
  editable: boolean;
  error: boolean;
  number: string;
}

function initialize(difficulty: string) {
  const board: BoardData[] = [];
  const indexes: number[] = [];
  for (let i = 0; i < 81; i++) {
    board.push({ number: '', editable: true, error: false });
    indexes.push(i);
  }
  let i = 0;
  let clues = 0;
  if (difficulty === 'easy') clues = getRandomNumber(37, 48);
  if (difficulty === 'medium') clues = getRandomNumber(27, 36);
  if (difficulty === 'hard') clues = getRandomNumber(19, 26);

  do {
    const random = Math.floor(Math.random() * indexes.length);

    // Handle clues
    board[random].number = setBoard(random, board);
    board[random].editable = false;

    indexes.splice(random, 1);
    i++;
  } while (i < clues);

  return board;
}

function getRandomNumber(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function setBoard(index: number, board: BoardData[]) {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let duplicate = true;

  do {
    const random = Math.floor(Math.random() * numbers.length);
    // Check for duplicates or else valid
    duplicate = checkDuplicate(index, board, numbers[random]);

    if (!duplicate) return numbers[random];
    numbers.splice(random, 1);
  } while (duplicate);

  return '?';
}

function checkDuplicate(index: number, board: BoardData[], number: string) {
  const row = Math.floor(index % 9);
  const col = Math.floor(index / 9);

  let checks: string[] = [];
  let duplicates: boolean;

  // Check row
  checks.push(number);
  for (let i = col * 9; i < col * 9 + 9; i++) {
    if (board[i].number) checks.push(board[i].number);
  }

  duplicates = checks.filter((x) => x === number).length > 1;

  if (duplicates) return true;
  checks = [];

  // Check column
  checks.push(number);
  for (let i = row; i < 81; i += 9) {
    if (board[i].number) checks.push(board[i].number);
  }

  duplicates = checks.filter((x) => x === number).length > 1;

  if (duplicates) return true;
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

  checks.push(number);
  for (let i = 0; i < boxIndexes[box].length; i++) {
    const index = boxIndexes[box][i];
    if (board[index].number) checks.push(board[index].number);
  }

  duplicates = checks.filter((x) => x === number).length > 1;

  if (duplicates) return true;
  return false;
}

export default initialize;
