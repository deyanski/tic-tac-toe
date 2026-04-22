import { useState, useCallback, useEffect, useRef } from 'react'
import type { Board, GameMode, Difficulty, GameStatus, Player, WinResult } from '../types'
import { calculateWinner, checkDraw, createEmptyBoard } from '../utils/gameLogic'
import { getBestMove, getEasyMove } from '../utils/minimax'

interface UseGameOptions {
  gameMode: GameMode
  difficulty: Difficulty
}

interface UseGameReturn {
  board: Board
  currentPlayer: Player
  status: GameStatus
  winResult: WinResult | null
  scores: Record<Player, number>
  isAiThinking: boolean
  handleCellClick: (index: number) => void
  resetBoard: () => void
  resetAll: () => void
}

const INITIAL_SCORES: Record<Player, number> = { X: 0, O: 0 }
const AI_THINK_DELAY_MS = 400

function applyMove(board: Board, index: number, player: Player): {
  nextBoard: Board
  winResult: WinResult | null
  isDraw: boolean
} {
  const nextBoard = board.slice() as Board
  nextBoard[index] = player
  const winResult = calculateWinner(nextBoard)
  const isDraw = checkDraw(nextBoard, winResult)
  return { nextBoard, winResult, isDraw }
}

export function useGame({ gameMode, difficulty }: UseGameOptions): UseGameReturn {
  const [board, setBoard] = useState<Board>(createEmptyBoard)
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [status, setStatus] = useState<GameStatus>('playing')
  const [winResult, setWinResult] = useState<WinResult | null>(null)
  const [scores, setScores] = useState<Record<Player, number>>(INITIAL_SCORES)
  const [isAiThinking, setIsAiThinking] = useState(false)

  // Ref to cancel AI timeout on unmount or mode change to prevent
  // state updates on an unmounted or stale component
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset board (not scores) when mode or difficulty changes to avoid
  // mid-game inconsistency (e.g. switching from PvP to PvC mid-game)
  useEffect(() => {
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current)
    setBoard(createEmptyBoard())
    setCurrentPlayer('X')
    setStatus('playing')
    setWinResult(null)
    setIsAiThinking(false)
  }, [gameMode, difficulty])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current)
    }
  }, [])

  // Trigger AI move when it is O's turn in PvC mode
  useEffect(() => {
    if (gameMode !== 'pvc') return
    if (currentPlayer !== 'O') return
    if (status !== 'playing') return

    setIsAiThinking(true)

    aiTimeoutRef.current = setTimeout(() => {
      const moveIndex = difficulty === 'hard' ? getBestMove(board) : getEasyMove(board)

      // Guard: AI found no valid move (board full or already won — should not happen, but be safe)
      if (moveIndex === null) {
        setIsAiThinking(false)
        return
      }

      const { nextBoard, winResult: result, isDraw } = applyMove(board, moveIndex, 'O')

      setIsAiThinking(false)
      setBoard(nextBoard)

      if (result) {
        setWinResult(result)
        setStatus('winner')
        setScores((prev) => ({ ...prev, [result.winner]: prev[result.winner] + 1 }))
      } else if (isDraw) {
        setStatus('draw')
      } else {
        setCurrentPlayer('X')
      }
    }, AI_THINK_DELAY_MS)
  }, [board, currentPlayer, status, gameMode, difficulty])

  const handleCellClick = useCallback(
    (index: number) => {
      // Guard: ignore if cell is filled, game is over, or AI is thinking
      if (board[index] !== null || status !== 'playing' || isAiThinking) return
      // Guard: in PvC mode, only human (X) can click
      if (gameMode === 'pvc' && currentPlayer !== 'X') return

      const { nextBoard, winResult: result, isDraw } = applyMove(board, index, currentPlayer)

      setBoard(nextBoard)

      if (result) {
        setWinResult(result)
        setStatus('winner')
        setScores((prev) => ({ ...prev, [result.winner]: prev[result.winner] + 1 }))
      } else if (isDraw) {
        setStatus('draw')
      } else {
        setCurrentPlayer((p) => (p === 'X' ? 'O' : 'X'))
      }
    },
    [board, currentPlayer, status, isAiThinking, gameMode],
  )

  const resetBoard = useCallback(() => {
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current)
    setBoard(createEmptyBoard())
    setCurrentPlayer('X')
    setStatus('playing')
    setWinResult(null)
    setIsAiThinking(false)
  }, [])

  const resetAll = useCallback(() => {
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current)
    setBoard(createEmptyBoard())
    setCurrentPlayer('X')
    setStatus('playing')
    setWinResult(null)
    setScores(INITIAL_SCORES)
    setIsAiThinking(false)
  }, [])

  return { board, currentPlayer, status, winResult, scores, isAiThinking, handleCellClick, resetBoard, resetAll }
}

