import type { Board, WinResult } from '../types'

const WIN_LINES: [number, number, number][] = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left col
  [1, 4, 7], // middle col
  [2, 5, 8], // right col
  [0, 4, 8], // diagonal
  [2, 4, 6], // anti-diagonal
]

/**
 * Returns the winner and winning line indices, or null if there is no winner.
 * Guards against malformed boards (length !== 9) by returning null.
 */
export function calculateWinner(board: Board): WinResult | null {
  if (board.length !== 9) return null

  for (const [a, b, c] of WIN_LINES) {
    const va = board[a]
    const vb = board[b]
    const vc = board[c]
    if (va && va === vb && va === vc) {
      return { winner: va, line: [a, b, c] }
    }
  }
  return null
}

/**
 * Returns true only when all cells are filled AND there is no winner.
 * Always call calculateWinner first and pass its result here.
 */
export function checkDraw(board: Board, winResult: WinResult | null): boolean {
  if (winResult !== null) return false
  return board.every((cell) => cell !== null)
}

export function createEmptyBoard(): Board {
  return [null, null, null, null, null, null, null, null, null]
}
