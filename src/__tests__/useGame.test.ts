import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGame } from '../hooks/useGame'

describe('useGame', () => {
  it('initialises with an empty board and X as first player', () => {
    const { result } = renderHook(() => useGame())
    expect(result.current.board.every((c) => c === null)).toBe(true)
    expect(result.current.currentPlayer).toBe('X')
    expect(result.current.status).toBe('playing')
    expect(result.current.scores).toEqual({ X: 0, O: 0 })
  })

  it('places a mark and switches player', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.handleCellClick(0))
    expect(result.current.board[0]).toBe('X')
    expect(result.current.currentPlayer).toBe('O')
  })

  it('ignores a click on an already-filled cell', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.handleCellClick(0))
    act(() => result.current.handleCellClick(0)) // click same cell again
    expect(result.current.board[0]).toBe('X')
    expect(result.current.currentPlayer).toBe('O')
  })

  it('detects a winner and stops accepting moves', () => {
    const { result } = renderHook(() => useGame())
    // X wins top row: 0,1,2
    act(() => result.current.handleCellClick(0)) // X
    act(() => result.current.handleCellClick(3)) // O
    act(() => result.current.handleCellClick(1)) // X
    act(() => result.current.handleCellClick(4)) // O
    act(() => result.current.handleCellClick(2)) // X wins
    expect(result.current.status).toBe('winner')
    expect(result.current.winResult?.winner).toBe('X')
    expect(result.current.scores.X).toBe(1)
    // Further clicks should be ignored
    act(() => result.current.handleCellClick(8))
    expect(result.current.board[8]).toBeNull()
  })

  it('detects a draw', () => {
    const { result } = renderHook(() => useGame())
    // Force a draw: X O X / X O O / O X X
    const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8]
    moves.forEach((i) => act(() => result.current.handleCellClick(i)))
    expect(result.current.status).toBe('draw')
  })

  it('resetBoard clears board but keeps scores', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.handleCellClick(0)) // X
    act(() => result.current.handleCellClick(3)) // O
    act(() => result.current.handleCellClick(1)) // X
    act(() => result.current.handleCellClick(4)) // O
    act(() => result.current.handleCellClick(2)) // X wins → score X=1
    act(() => result.current.resetBoard())
    expect(result.current.board.every((c) => c === null)).toBe(true)
    expect(result.current.status).toBe('playing')
    expect(result.current.scores.X).toBe(1) // score preserved
  })

  it('resetAll clears board and scores', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.handleCellClick(0))
    act(() => result.current.handleCellClick(3))
    act(() => result.current.handleCellClick(1))
    act(() => result.current.handleCellClick(4))
    act(() => result.current.handleCellClick(2)) // X wins
    act(() => result.current.resetAll())
    expect(result.current.scores).toEqual({ X: 0, O: 0 })
    expect(result.current.status).toBe('playing')
  })
})
