import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick }) {
  return (
    <button 
      className="square" 
      onClick={onSquareClick}
      data-value={value}
    >
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = '●';
    } else {
      nextSquares[i] = '○';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = '获胜者: ' + winner;
  } else {
    status = '下一步: ' + (xIsNext ? '黑子' : '白子');
  }

  const renderSquare = (i) => {
    return (
      <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
    );
  };

  const renderBoard = () => {
    const board = [];
    for (let row = 0; row < 15; row++) {
      const boardRow = [];
      for (let col = 0; col < 15; col++) {
        boardRow.push(renderSquare(row * 15 + col));
      }
      board.push(
        <div key={row} className="board-row">
          {boardRow}
        </div>
      );
    }
    return board;
  };

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">{renderBoard()}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(225).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(225).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = '回到第 ' + move + ' 步';
    } else {
      description = '重新开始';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        <button className="reset-button" onClick={resetGame}>
          再来一局
        </button>
      </div>
      <div className="game-info">
        <details>
          <summary>历史步骤</summary>
          <ol>{moves}</ol>
        </details>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const size = 15;
  
  const checkLine = (startRow, startCol, deltaRow, deltaCol) => {
    const startPiece = squares[startRow * size + startCol];
    if (!startPiece) return null;
    
    for (let i = 1; i < 5; i++) {
      const row = startRow + deltaRow * i;
      const col = startCol + deltaCol * i;
      if (
        row < 0 || row >= size || 
        col < 0 || col >= size ||
        squares[row * size + col] !== startPiece
      ) {
        return null;
      }
    }
    return startPiece;
  };

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
      ];
      
      for (const [deltaRow, deltaCol] of directions) {
        const winner = checkLine(row, col, deltaRow, deltaCol);
        if (winner) return winner;
      }
    }
  }
  return null;
}
