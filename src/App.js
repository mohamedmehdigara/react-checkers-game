import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [board, setBoard] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(1);

  // Initialize the game board
  useEffect(() => {
    const initialBoard = createInitialBoard();
    setBoard(initialBoard);
  }, []);

  // Create the initial game board
  const createInitialBoard = () => {
    const initialBoard = Array(8).fill(null).map(() => Array(8).fill(null));

    // Add black pieces
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          initialBoard[row][col] = { player: 1, king: false };
        }
      }
    }

    // Add red pieces
    for (let row = 5; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          initialBoard[row][col] = { player: 2, king: false };
        }
      }
    }

    return initialBoard;
  };

  // Handle cell click
  const handleCellClick = (row, col, piece) => {
    if (piece && piece.player === currentPlayer) {
      setSelectedPiece({ row, col });
    } else if (selectedPiece) {
      movePiece(selectedPiece.row, selectedPiece.col, row, col);
    }
  };

  // Move the piece to the target position
  const movePiece = (startRow, startCol, targetRow, targetCol) => {
    const piece = board[startRow][startCol];

    if (isValidMove(piece, startRow, startCol, targetRow, targetCol)) {
      const updatedBoard = [...board];
      updatedBoard[targetRow][targetCol] = piece;
      updatedBoard[startRow][startCol] = null;

      // Check if the piece reaches the opposite end to become a king
      if (targetRow === 0 && piece.player === 1) {
        updatedBoard[targetRow][targetCol].king = true;
      } else if (targetRow === 7 && piece.player === 2) {
        updatedBoard[targetRow][targetCol].king = true;
      }

      // Capture opponent's piece if applicable
      if (Math.abs(targetRow - startRow) === 2) {
        const capturedRow = (startRow + targetRow) / 2;
        const capturedCol = (startCol + targetCol) / 2;
        updatedBoard[capturedRow][capturedCol] = null;
      }

      setBoard(updatedBoard);
      setSelectedPiece(null);
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  // Check if the move is valid
  const isValidMove = (piece, startRow, startCol, targetRow, targetCol) => {
    // Check if the target position is within the board bounds
    if (
      targetRow < 0 ||
      targetRow >= 8 ||
      targetCol < 0 ||
      targetCol >= 8
    ) {
      return false;
    }

    // Check if the target position is empty
    if (board[targetRow][targetCol] !== null) {
      return false;
    }

    // Game logic for validating the move
    // ...

    return true;
  };

  return (
    <div className="App">
      <h1>Checkers Game</h1>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell && (cell.king ? 'king' : 'occupied')}`}
                onClick={() => handleCellClick(rowIndex, colIndex, cell)}
              >
                {cell && <Piece player={cell.player} king={cell.king} />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Piece({ player, king }) {
  const pieceClass = player === 1 ? 'black' : 'red';
  const kingClass = king ? 'king' : '';

  return <div className={`piece ${pieceClass} ${kingClass}`} />;
}

export default App;
