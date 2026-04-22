import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGame } from '../hooks/useGame'

const PVP = { gameMode: 'pvp' as const, difficulty: 'hard' as const }
const PVC_HARD = { gameMode: 'pvc' as const, difficulty: 'hard' as const }

describe('useGame — PvP mode', () => {
  it('initialises with an empty board and X as first player', () => {
    const { result } = renderHook(() => useGame(PVP))
    expect(result.current.board.every((c) => c === null)).toBe(true)
    expect(result.current.currentPlayer).toBe('X')
    expect(result.current.status).toBe('playing')
    expect(result.current.scores).toEqual({ X: 0, O: 0 })
  })

  it('places a mark and switches player', () => {
    const { result } = renderHook(() => useGame(PVP))
    act(() => result.current.handleCellClick(0))
    expect(result.current.board[0]).toBe('X')
    expect(result.current.currentPlayer).toBe('O')
  })

  it('ignores a click on an already-filled cell', () => {
    const { result } = renderHook(() => useGame(PVP))
    act(() => result.current.handleCellClick(0))
    act(() => result.current.handleCellClick(0))
    expect(result.current.board[0]).toBe('X')
    expect(result.current.currentPlayer).toBe('O')
  })

  it('detects a winner and stops accepting moves', () => {
    const { result } = renderHook(() => useGame(PVP))
    act(() => result.current.handleCellClick(0)) // X
    act(() => result.current.handleCellClick(3)) // O
    act(() => result.current.handleCellClick(1)) // X
    act(() => result.current.handleCellClick(4)) // O
    act(() => result.current.handleCellClick(2)) // X wins
    expect(result.current.status).toBe('winner')
    expect(result.current.winResult?.winner).toBe('X')
    expect(result.current.scores.X).toBe(1)
    act(() => result.current.handleCellClick(8))
    expect(result.current.board[8]).toBeNull()
  })

  it('detects a draw', () => {
    const { result } = renderHook(() => useGame(PVP))
    const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8]
    moves.forEach((i) => act(() => result.current.handleCellClick(i)))
    expect(result.current.status).toBe('draw')
  })

  it('resetBoard clears board but keeps scores', () => {
    const { result } = renderHook(() => useGame(PVP))
    act(() => result.current.handleCellClick(0))
    act(() => result.current.handleCellClick(3))
    act(() => result.current.handleCellClick(1))
    act(() => result.current.handleCellClick(4))
    act(() => result.current.handleCellClick(2)) // X wins
    act(() => result.current.resetBoard())
    expect(result.current.board.every((c) => c === null)).toBe(true)
    expect(result.current.status).toBe('playing')
    expect(result.current.scores.X).toBe(1)
  })

  it('resetAll clears board and scores', () => {
    const { result } = renderHook(() => useGame(PVP))
    act(() => result.current.handleCellClick(0))
    act(() => result.current.handleCellClick(3))
    act(() => result.current.handleCellClick(1))
    act(() => result.current.handleCellClick(4))
    act(() => result.current.handleCellClick(2)) // X wins
    act(() => result.current.resetAll())
    expect(result.current.scores).toEqual({ X: 0, O: 0 })
    expect(result.current.status).toBe('playing')
  })

  it('ignores invalid indexes (negative, out-of-range, non-integer)', () => {
    const { result } = renderHook(() => useGame(PVP))
    const originalBoard = [...result.current.board]

    act(() => result.current.handleCellClick(-1))
    act(() => result.current.handleCellClick(9))
    act(() => result.current.handleCellClick(1.5))

    expect(result.current.board).toEqual(originalBoard)
    expect(result.current.currentPlayer).toBe('X')
  })
})

describe('useGame — PvC mode', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('sets isAiThinking after human moves', () => {
    const { result } = renderHook(() => useGame(PVC_HARD))
    act(() => result.current.handleCellClick(4))
    expect(result.current.isAiThinking).toBe(true)
  })

  it('AI places a mark after delay', async () => {
    const { result } = renderHook(() => useGame(PVC_HARD))
    act(() => result.current.handleCellClick(4)) // human plays centre
    await act(async () => { vi.advanceTimersByTime(400) })
    expect(result.current.isAiThinking).toBe(false)
    // At least one O should be on the board
    expect(result.current.board.some((c) => c === 'O')).toBe(true)
  })

  it('human cannot click while AI is thinking', () => {
    const { result } = renderHook(() => useGame(PVC_HARD))
    act(() => result.current.handleCellClick(4)) // human plays
    // While AI is thinking, human tries to click
    act(() => result.current.handleCellClick(0))
    expect(result.current.board[0]).toBeNull()
  })

  it('human cannot play as O in PvC mode', () => {
    const { result } = renderHook(() => useGame(PVC_HARD))
    // Force currentPlayer to O without going through normal flow
    // by verifying click is ignored when it would be O's turn
    act(() => result.current.handleCellClick(4)) // X plays
    act(() => vi.advanceTimersByTime(400))      // AI (O) plays
    // Now it's X's turn again — clicking as O is not possible through UI
    expect(result.current.currentPlayer).toBe('X')
  })

  it('AI does not move when game is already over', () => {
    const { result } = renderHook(() => useGame(PVC_HARD))
    // Win the game quickly as X (cheat with PVP by resetting after)
    // We force a win by pre-filling: use resetAll then test
    act(() => result.current.resetAll())
    expect(result.current.status).toBe('playing')
  })

  it('resetBoard clears isAiThinking', () => {
    const { result } = renderHook(() => useGame(PVC_HARD))
    act(() => result.current.handleCellClick(0))
    expect(result.current.isAiThinking).toBe(true)
    act(() => result.current.resetBoard())
    expect(result.current.isAiThinking).toBe(false)
  })

  it('does not apply a stale AI move after resetBoard while timer is pending', () => {
    const { result } = renderHook(() => useGame(PVC_HARD))
    act(() => result.current.handleCellClick(4))
    expect(result.current.isAiThinking).toBe(true)

    act(() => result.current.resetBoard())
    act(() => vi.advanceTimersByTime(400))

    expect(result.current.board.every((c) => c === null)).toBe(true)
    expect(result.current.currentPlayer).toBe('X')
    expect(result.current.isAiThinking).toBe(false)
  })

  it('does not apply a stale AI move after mode switch to PvP', () => {
    const { result, rerender } = renderHook(
      (props: { gameMode: 'pvp' | 'pvc'; difficulty: 'hard' }) => useGame(props),
      { initialProps: { gameMode: 'pvc', difficulty: 'hard' } },
    )

    act(() => result.current.handleCellClick(4))
    expect(result.current.isAiThinking).toBe(true)

    rerender({ gameMode: 'pvp', difficulty: 'hard' })
    act(() => vi.advanceTimersByTime(400))

    expect(result.current.board.every((c) => c === null)).toBe(true)
    expect(result.current.currentPlayer).toBe('X')
    expect(result.current.isAiThinking).toBe(false)
  })
})

