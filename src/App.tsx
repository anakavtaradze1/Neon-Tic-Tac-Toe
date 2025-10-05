import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const checkWinnerForTesting = (squares: any[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const checkWinner = useCallback((squares: any[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        setWinningLine(lines[i]);
        return squares[a];
      }
    }
    return null;
  }, []);

  const checkDraw = (squares: any[]) => {
    return squares.every((square) => square !== null);
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || !isXTurn) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsXTurn(false);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      return;
    }

    if (checkDraw(newBoard)) {
      setWinner("Draw");
      return;
    }
  };

  useEffect(() => {
    if (!isXTurn && !winner) {
      const timer = setTimeout(() => {
        const emptySquares = board
          .map((square, index) => (square === null ? index : null))
          .filter((val) => val !== null) as number[];
        if (emptySquares.length === 0) return;

        let botMove = -1;

        for (let i = 0; i < emptySquares.length; i++) {
          const testBoard = [...board];
          testBoard[emptySquares[i]] = "O";
          if (checkWinnerForTesting(testBoard) === "O") {
            botMove = emptySquares[i];
            break;
          }
        }

        if (botMove === -1) {
          for (let i = 0; i < emptySquares.length; i++) {
            const testBoard = [...board];
            testBoard[emptySquares[i]] = "X";
            if (checkWinnerForTesting(testBoard) === "X") {
              botMove = emptySquares[i];
              break;
            }
          }
        }

        if (botMove === -1) {
          botMove =
            emptySquares[Math.floor(Math.random() * emptySquares.length)];
        }

        const newBoard = [...board];
        newBoard[botMove] = "O";
        setBoard(newBoard);
        setIsXTurn(true);

        const gameWinner = checkWinner(newBoard);
        if (gameWinner) {
          setWinner(gameWinner);
          return;
        }

        if (checkDraw(newBoard)) {
          setWinner("Draw");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isXTurn, winner, board, checkWinner]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setWinner(null);
    setWinningLine(null);
  };

  const Square = ({
    value,
    onClick,
    index,
    isWinning,
  }: {
    value: string;
    onClick: () => void;
    index: number;
    isWinning: boolean;
  }) => (
    <button
      className={`square ${isWinning ? "winning" : ""} ${
        value ? "filled" : ""
      }`}
      onClick={onClick}
    >
      {value}
    </button>
  );

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <div className="game-info">
        {winner === "Draw"
          ? "It's a Draw!"
          : winner
          ? `Winner: ${winner}`
          : `${isXTurn ? "Your turn (X)" : "Bot thinking..."}`}
      </div>
      <div className="board">
        {board.map((square, index) => (
          <Square
            key={index}
            value={square}
            onClick={() => handleClick(index)}
            index={index}
            isWinning={winningLine?.includes(index) || false}
          />
        ))}
      </div>
      <button className="reset-button" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
}

export default App;
