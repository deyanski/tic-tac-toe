import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Square } from '../components/Square'

describe('Square', () => {
  it('renders empty when value is null', () => {
    render(<Square value={null} index={0} isWinning={false} disabled={false} onClick={vi.fn()} />)
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
    expect(btn.textContent).toBe('')
  })

  it('renders X when value is X', () => {
    render(<Square value="X" index={0} isWinning={false} disabled={false} onClick={vi.fn()} />)
    expect(screen.getByText('X')).toBeInTheDocument()
  })

  it('renders O when value is O', () => {
    render(<Square value="O" index={2} isWinning={false} disabled={false} onClick={vi.fn()} />)
    expect(screen.getByText('O')).toBeInTheDocument()
  })

  it('calls onClick with correct index when empty and enabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Square value={null} index={5} isWinning={false} disabled={false} onClick={handleClick} />)
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledWith(5)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Square value={null} index={0} isWinning={false} disabled={true} onClick={handleClick} />)
    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('does not call onClick when value is already set', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Square value="X" index={0} isWinning={false} disabled={false} onClick={handleClick} />)
    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('has accessible aria-label', () => {
    render(<Square value={null} index={3} isWinning={false} disabled={false} onClick={vi.fn()} />)
    expect(screen.getByLabelText('Cell 4, empty')).toBeInTheDocument()
  })
})
