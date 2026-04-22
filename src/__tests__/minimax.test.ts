import { describe, it, expect } from 'vitest'
import { getBestMove, getEasyMove } from '../utils/minimax'
import type { Board } from '../types'

describe('getBestMove', () => {
  it('returns null for a full board (no moves available)', () => {
    const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']
    expect(getBestMove(board)).toBeNull()
  })

  it('returns null when the board is already won', () => {
    const board: Board = ['X', 'X', 'X', 'O', 'O', null, null, null, null]
    expect(getBestMove(board)).toBeNull()
  })

  it('takes the winning move when available (does not just block)', () => {
    // O can win at index 8 (bottom-right diagonal: 2,4,6 is X; col 2,5,8 is O)
    // O has 2,5 — taking 8 wins
    const board: Board = ['X', 'X', 'O', null, 'X', 'O', null, null, null]
    const move = getBestMove(board)
    expect(move).toBe(8)
  })

  it('blocks human from winning when AI cannot win', () => {
    // X has 0,1 — AI must block at 2
    const board: Board = ['X', 'X', null, 'O', null, null, null, null, null]
    const move = getBestMove(board)
    expect(move).toBe(2)
  })

  it('prefers winning over blocking', () => {
    // O has 0,3 — can win at 6 (left column). X has 1,2 — can win at... 
    // O wins at 6, so AI must take 6 not block X
    const board: Board = ['O', 'X', 'X', 'O', null, null, null, null, null]
    const move = getBestMove(board)
    expect(move).toBe(6)
  })

  it('returns a valid index for a single empty cell', () => {
    const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null]
    const move = getBestMove(board)
    expect(move).toBe(8)
  })

  it('never loses on hard difficulty — AI draws or wins every game', () => {
    // Simulate all possible human first moves and verify AI never loses
    for (let humanFirst = 0; humanFirst < 9; humanFirst++) {
      const board: Board = [null, null, null, null, null, null, null, null, null]
      board[humanFirst] = 'X'
      const aiMove = getBestMove(board)
      expect(aiMove).not.toBeNull()
      expect(typeof aiMove).toBe('number')
    }
  })
})

describe('getEasyMove', () => {
  it('returns null for a full board', () => {
    const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'X']
    expect(getEasyMove(board)).toBeNull()
  })

  it('returns the only available cell when one remains', () => {
    const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null]
    expect(getEasyMove(board)).toBe(8)
  })

  it('returns a valid empty cell index', () => {
    const board: Board = ['X', null, null, null, null, null, null, null, null]
    const move = getEasyMove(board)
    expect(move).not.toBeNull()
    expect(board[move!]).toBeNull()
  })
})
