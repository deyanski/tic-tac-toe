import { motion } from 'framer-motion'
import type { CellValue } from '../types'

interface SquareProps {
  value: CellValue
  index: number
  isWinning: boolean
  disabled: boolean
  onClick: (index: number) => void
}

export function Square({ value, index, isWinning, disabled, onClick }: SquareProps) {
  const handleClick = () => {
    if (!disabled && value === null) {
      onClick(index)
    }
  }

  return (
    <button
      className={[
        'flex items-center justify-center',
        'w-24 h-24 rounded-2xl text-5xl font-bold',
        'border-2 transition-colors duration-200',
        'focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2',
        isWinning
          ? 'border-yellow-400 bg-yellow-100 dark:bg-yellow-900/40'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800',
        !disabled && value === null
          ? 'hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer'
          : 'cursor-default',
      ].join(' ')}
      onClick={handleClick}
      disabled={disabled || value !== null}
      aria-label={`Cell ${index + 1}${value ? `, marked ${value}` : ', empty'}`}
    >
      {value && (
        <motion.span
          key={value}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className={value === 'X' ? 'text-violet-600 dark:text-violet-400' : 'text-rose-500 dark:text-rose-400'}
        >
          {value}
        </motion.span>
      )}
    </button>
  )
}
