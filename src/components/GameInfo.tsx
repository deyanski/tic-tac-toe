import { motion, AnimatePresence } from 'framer-motion'
import type { GameStatus, Player } from '../types'

interface GameInfoProps {
  currentPlayer: Player
  status: GameStatus
  winner: Player | null
  scores: Record<Player, number>
  onReset: () => void
  onResetAll: () => void
}

export function GameInfo({ currentPlayer, status, winner, scores, onReset, onResetAll }: GameInfoProps) {
  const statusMessage =
    status === 'winner'
      ? `Player ${winner} wins!`
      : status === 'draw'
        ? "It's a draw!"
        : `Player ${currentPlayer}'s turn`

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
      {/* Score board */}
      <div className="flex w-full justify-around text-center">
        {(['X', 'O'] as Player[]).map((p) => (
          <div key={p} className="flex flex-col items-center">
            <span
              className={`text-3xl font-bold ${p === 'X' ? 'text-violet-600 dark:text-violet-400' : 'text-rose-500 dark:text-rose-400'}`}
            >
              {p}
            </span>
            <span className="text-2xl font-semibold text-slate-700 dark:text-slate-200">
              {scores[p]}
            </span>
          </div>
        ))}
      </div>

      {/* Status banner */}
      <AnimatePresence mode="wait">
        <motion.p
          key={statusMessage}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="text-lg font-medium text-slate-700 dark:text-slate-200 h-7"
        >
          {statusMessage}
        </motion.p>
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          New Round
        </button>
        <button
          onClick={onResetAll}
          className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Reset All
        </button>
      </div>
    </div>
  )
}
