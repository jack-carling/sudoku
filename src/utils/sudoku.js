/*

Sudoku generator based on this gist:
https://gist.github.com/dsasse07/3ff7ae0eff2a7b3efd276e3f10f59f91

*/

const BLANK_BOARD = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

let counter;
const numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function shuffle(array) {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const rowSafe = (puzzleArray, emptyCell, num) => {
  return puzzleArray[emptyCell.rowIndex].indexOf(num) === -1;
};
const colSafe = (puzzleArray, emptyCell, num) => {
  return !puzzleArray.some((row) => row[emptyCell.colIndex] === num);
};

const boxSafe = (puzzleArray, emptyCell, num) => {
  const boxStartRow = emptyCell.rowIndex - (emptyCell.rowIndex % 3);
  const boxStartCol = emptyCell.colIndex - (emptyCell.colIndex % 3);
  let safe = true;

  for (let boxRow of [0, 1, 2]) {
    for (let boxCol of [0, 1, 2]) {
      if (puzzleArray[boxStartRow + boxRow][boxStartCol + boxCol] === num) {
        safe = false;
      }
    }
  }
  return safe;
};

const safeToPlace = (puzzleArray, emptyCell, num) => {
  return (
    rowSafe(puzzleArray, emptyCell, num) && colSafe(puzzleArray, emptyCell, num) && boxSafe(puzzleArray, emptyCell, num)
  );
};

const nextEmptyCell = (puzzleArray) => {
  const emptyCell = { rowIndex: '', colIndex: '' };

  puzzleArray.forEach((row, rowIndex) => {
    if (emptyCell.colIndex !== '') return;
    let firstZero = row.find((col) => col === 0);
    if (firstZero === undefined) return;
    emptyCell.rowIndex = rowIndex;
    emptyCell.colIndex = row.indexOf(firstZero);
  });

  if (emptyCell.colIndex !== '') return emptyCell;
  return false;
};

const fillPuzzle = (startingBoard) => {
  const emptyCell = nextEmptyCell(startingBoard);
  if (!emptyCell) return startingBoard;

  for (let num of shuffle(numArray)) {
    counter++;
    if (counter > 20_000_000) throw new Error('Recursion Timeout');
    if (safeToPlace(startingBoard, emptyCell, num)) {
      startingBoard[emptyCell.rowIndex][emptyCell.colIndex] = num;
      if (fillPuzzle(startingBoard)) return startingBoard;
      startingBoard[emptyCell.rowIndex][emptyCell.colIndex] = 0;
    }
  }
  return false;
};

const newSolvedBoard = (_) => {
  const newBoard = BLANK_BOARD.map((row) => row.slice());
  fillPuzzle(newBoard);
  return newBoard;
};

const pokeHoles = (startingBoard, holes) => {
  const removedValues = [];

  while (removedValues.length < holes) {
    const val = Math.floor(Math.random() * 81);
    const randomRowIndex = Math.floor(val / 9);
    const randomColIndex = val % 9;

    if (!startingBoard[randomRowIndex]) continue;
    if (startingBoard[randomRowIndex][randomColIndex] === 0) continue;

    removedValues.push({
      rowIndex: randomRowIndex,
      colIndex: randomColIndex,
      val: startingBoard[randomRowIndex][randomColIndex],
    });
    startingBoard[randomRowIndex][randomColIndex] = 0;
    const proposedBoard = startingBoard.map((row) => row.slice());

    if (!fillPuzzle(proposedBoard)) {
      startingBoard[randomRowIndex][randomColIndex] = removedValues.pop().val;
    }
  }
  return [removedValues, startingBoard];
};

function newStartingBoard(holes) {
  try {
    counter = 0;
    let solvedBoard = newSolvedBoard();

    let [removedValues, startingBoard] = pokeHoles(
      solvedBoard.map((row) => row.slice()),
      holes
    );

    return [removedValues, startingBoard, solvedBoard];
  } catch (error) {
    return newStartingBoard(holes);
  }
}

function generate(clues) {
  const holes = 81 - clues;
  return newStartingBoard(holes)[1].flat();
}

export default generate;
