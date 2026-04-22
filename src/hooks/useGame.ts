import { useState, useCallback } from 'react'
import type { Board, GameStatus, Player, WinResult } from '../types'
import { calculateWinner, checkDraw, createEmptyBoard } from '../utils/gameLogic'

interface UseGameReturn {
  board: Board
  currentPlayer: Player
  status: GameStatus
  winResult: WinResult | null
  scores: Record<Player, number>
  handleCellClick: (index: number) => void
  resetBoard: () => void
  resetAll: () => void
}

const INITIAL_SCORES: Record<Player, number> = { X: 0, O: 0 }

export function useGame(): UseGameReturn {
  const [board, setBoard] = useState<Board>(createEmptyBoard)
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [status, setStatus] = useState<GameStatus>('playing')
  const [winResult, setWinResult] = useState<WinResult | null>(null)
  const [scores, setScores] = useState<Record<Player, number>>(INITIAL_SCORES)

  const handleCellClick = useCallback(
    (index: number) => {
      // Guard: ignore if cell is already filled or game is over
      if (board[index] !== null || status !== 'playing') return

      const nextBoard = board.slice() as Board
      nextBoard[index] = currentPlayer

      const result = calculateWinner(nextBoard)

      if (result) {
        setBoard(nextBoard)
        setWinResult(result)
        setStatus('winner')
        setScores((prev) => ({
          ...prev,
          [result.winner]: prev[result.winner] + 1,
        }))
        return
      }

      if (checkDraw(nextBoard, result)) {
        setBoard(nextBoard)
        setStatus('draw')
        return
      }

      setBoard(nextBoard)
      setCurrentPlayer((p) => (p === 'X' ? 'O' : 'X'))
    },
    [board, currentPlayer, status],
  )

  // Resets board only — keeps scores
  const resetBoard = useCallback(() => {
    setBoard(createEmptyBoard())
    setCurrentPlayer('X')
    setStatus('playing')
    setWinResult(null)
  }, [])

  // Full reset — clears scores too
  const resetAll = useCallback(() => {
    setBoard(createEmptyBoard())
    setCurrentPlayer('X')
    setStatus('playing')
    setWinResult(null)
    setScores(INITIAL_SCORES)
  }, [])

  return { board, currentPlayer, status, winResult, scores, handleCellClick, resetBoard, resetAll }
}
