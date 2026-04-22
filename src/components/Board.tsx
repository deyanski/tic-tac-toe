import type { Board, WinResult, GameStatus } from '../types'
import { Square } from './Square'

interface BoardProps {
  board: Board
  winResult: WinResult | null
  status: GameStatus
  onCellClick: (index: number) => void
}

export function Board({ board, winResult, status, onCellClick }: BoardProps) {
  const winningIndices = winResult ? new Set(winResult.line) : new Set<number>()
  const isGameOver = status !== 'playing'

  return (
    <div
      className="grid grid-cols-3 gap-3"
      role="grid"
      aria-label="Tic-Tac-Toe board"
    >
      {board.map((cell, i) => (
        <Square
          key={i}
          index={i}
          value={cell}
          isWinning={winningIndices.has(i)}
          disabled={isGameOver || cell !== null}
          onClick={onCellClick}
        />
      ))}
    </div>
  )
}
