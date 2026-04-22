import type { Board, Player } from '../types'
import { calculateWinner, checkDraw } from './gameLogic'

const AI_PLAYER: Player = 'O'
const HUMAN_PLAYER: Player = 'X'

interface MinimaxResult {
  score: number
  index: number | null
}

/**
 * Returns the best move index for the AI (O), or null if no moves are available.
 *
 * Edge cases handled:
 * - Full board → returns null immediately
 * - Already won board → returns null immediately (caller should not invoke in this state)
 * - Single empty cell → returns it without recursion
 * - Win available → always taken before blocking (score ordering guarantees this)
 */
function minimax(board: Board, isMaximising: boolean, depth: number): MinimaxResult {
  const winner = calculateWinner(board)

  // Terminal states — score relative to AI (O = maximiser)
  if (winner?.winner === AI_PLAYER) return { score: 10 - depth, index: null }
  if (winner?.winner === HUMAN_PLAYER) return { score: depth - 10, index: null }
  if (checkDraw(board, winner)) return { score: 0, index: null }

  const emptyIndices = board
    .map((cell, i) => (cell === null ? i : null))
    .filter((i): i is number => i !== null)

  // No moves available (full board, no winner — should be caught by checkDraw, but guard anyway)
  if (emptyIndices.length === 0) return { score: 0, index: null }

  let best: MinimaxResult = {
    score: isMaximising ? -Infinity : Infinity,
    index: null,
  }

  for (const i of emptyIndices) {
    const next = board.slice() as Board
    next[i] = isMaximising ? AI_PLAYER : HUMAN_PLAYER

    const result = minimax(next, !isMaximising, depth + 1)

    if (isMaximising ? result.score > best.score : result.score < best.score) {
      best = { score: result.score, index: i }
    }
  }

  return best
}

/**
 * Returns the best move index for the AI on Hard difficulty (unbeatable).
 * Returns null if the board is full or already won.
 */
export function getBestMove(board: Board): number | null {
  // Guard: do not compute if game is already decided
  if (calculateWinner(board) !== null) return null

  const emptyIndices = board
    .map((cell, i) => (cell === null ? i : null))
    .filter((i): i is number => i !== null)

  if (emptyIndices.length === 0) return null

  return minimax(board, true, 0).index
}

/**
 * Returns a move index for the AI on Easy difficulty.
 * 60% of the time picks a random empty cell; 40% picks the optimal move.
 * If only one cell remains, always takes it (no real choice).
 */
export function getEasyMove(board: Board): number | null {
  const emptyIndices = board
    .map((cell, i) => (cell === null ? i : null))
    .filter((i): i is number => i !== null)

  if (emptyIndices.length === 0) return null
  // Single cell left — no choice regardless of difficulty
  if (emptyIndices.length === 1) return emptyIndices[0]

  // 60% random, 40% optimal
  if (Math.random() < 0.6) {
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
  }
  return getBestMove(board)
}
