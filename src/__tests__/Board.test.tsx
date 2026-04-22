import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Board } from '../components/Board'
import { createEmptyBoard } from '../utils/gameLogic'
import type { Board as BoardType } from '../types'

describe('Board', () => {
  it('renders 9 cells', () => {
    render(<Board board={createEmptyBoard()} winResult={null} status="playing" onCellClick={vi.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(9)
  })

  it('displays marks from the board state', () => {
    const board: BoardType = ['X', 'O', null, null, null, null, null, null, null]
    render(<Board board={board} winResult={null} status="playing" onCellClick={vi.fn()} />)
    expect(screen.getByText('X')).toBeInTheDocument()
    expect(screen.getByText('O')).toBeInTheDocument()
  })

  it('calls onCellClick with the correct index', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Board board={createEmptyBoard()} winResult={null} status="playing" onCellClick={handleClick} />)
    const cells = screen.getAllByRole('button')
    await user.click(cells[4])
    expect(handleClick).toHaveBeenCalledWith(4)
  })

  it('disables all cells when game is over', () => {
    const board: BoardType = ['X','X','X', null,null,null, null,null,null]
    render(<Board board={board} winResult={{ winner: 'X', line: [0,1,2] }} status="winner" onCellClick={vi.fn()} />)
    screen.getAllByRole('button').forEach((btn) => {
      expect(btn).toBeDisabled()
    })
  })

  it('does not call onCellClick when clicking an occupied cell', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    const board: BoardType = ['X', null, null, null, null, null, null, null, null]
    render(<Board board={board} winResult={null} status="playing" onCellClick={handleClick} />)
    await user.click(screen.getAllByRole('button')[0])
    expect(handleClick).not.toHaveBeenCalled()
  })
})
