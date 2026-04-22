import { describe, it, expect } from 'vitest'
import { calculateWinner, checkDraw, createEmptyBoard } from '../utils/gameLogic'
import type { Board } from '../types'

describe('calculateWinner', () => {
  it('returns null for an empty board', () => {
    expect(calculateWinner(createEmptyBoard())).toBeNull()
  })

  it('detects all 8 winning combinations for X', () => {
    const wins: Board[] = [
      ['X','X','X', null,null,null, null,null,null],
      [null,null,null, 'X','X','X', null,null,null],
      [null,null,null, null,null,null, 'X','X','X'],
      ['X',null,null, 'X',null,null, 'X',null,null],
      [null,'X',null, null,'X',null, null,'X',null],
      [null,null,'X', null,null,'X', null,null,'X'],
      ['X',null,null, null,'X',null, null,null,'X'],
      [null,null,'X', null,'X',null, 'X',null,null],
    ]
    wins.forEach((board) => {
      const result = calculateWinner(board)
      expect(result).not.toBeNull()
      expect(result?.winner).toBe('X')
    })
  })

  it('detects a win for O', () => {
    const board: Board = ['O','O','O', null,null,null, null,null,null]
    expect(calculateWinner(board)?.winner).toBe('O')
  })

  it('returns the correct winning line indices', () => {
    const board: Board = [null,null,null, null,null,null, 'X','X','X']
    expect(calculateWinner(board)?.line).toEqual([6, 7, 8])
  })

  it('returns null for a malformed board (length !== 9)', () => {
    expect(calculateWinner([] as unknown as Board)).toBeNull()
  })

  it('returns null for a full board with no winner (draw)', () => {
    const board: Board = ['X','O','X', 'X','O','O', 'O','X','X']
    expect(calculateWinner(board)).toBeNull()
  })
})

describe('checkDraw', () => {
  it('returns false when there is a winner', () => {
    const board: Board = ['X','X','X', null,null,null, null,null,null]
    const win = calculateWinner(board)
    expect(checkDraw(board, win)).toBe(false)
  })

  it('returns false when board is not yet full', () => {
    const board: Board = ['X','O','X', null,'O',null, null,null,null]
    expect(checkDraw(board, null)).toBe(false)
  })

  it('returns true when board is full and no winner', () => {
    const board: Board = ['X','O','X', 'X','O','O', 'O','X','X']
    expect(checkDraw(board, null)).toBe(true)
  })

  it('returns false for an empty board', () => {
    expect(checkDraw(createEmptyBoard(), null)).toBe(false)
  })
})
