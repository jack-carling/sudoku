import React, { useState } from 'react';

import Board from './components/Board';

function App() {
  const [showStart, setShowStart] = useState(true);
  const [difficulty, setDifficulty] = useState('');

  function handleDifficulty(difficulty: string) {
    setDifficulty(difficulty);
    setShowStart(false);
  }
  function returnToMainMenu() {
    setShowStart(true);
  }

  return (
    <div className="App">
      {showStart && (
        <section className="App">
          <h1>Sudoku</h1>
          <p>
            Sudoku is a logic-based number-placement puzzle. In classic sudoku, the objective is to fill a 9×9 grid with
            digits so that each column, each row, and each of the nine 3×3 sub-grids that compose the grid (also called
            "boxes") contain all of the digits from 1 to 9.
          </p>
          <p>Select difficulty:</p>
          <button onClick={() => handleDifficulty('easy')}>Easy</button>
          <button onClick={() => handleDifficulty('medium')}>Medium</button>
          <button onClick={() => handleDifficulty('hard')}>Hard</button>
        </section>
      )}
      {!showStart && <Board difficulty={difficulty} returnToMainMenu={returnToMainMenu} />}
    </div>
  );
}

export default App;
