import { motion, AnimatePresence } from 'framer-motion'
import type { GameStatus, Player, GameMode, Difficulty } from '../types'

interface GameInfoProps {
  currentPlayer: Player
  status: GameStatus
  winner: Player | null
  scores: Record<Player, number>
  isAiThinking: boolean
  gameMode: GameMode
  difficulty: Difficulty
  onReset: () => void
  onResetAll: () => void
  onGameModeChange: (mode: GameMode) => void
  onDifficultyChange: (difficulty: Difficulty) => void
}

export function GameInfo({
  currentPlayer,
  status,
  winner,
  scores,
  isAiThinking,
  gameMode,
  difficulty,
  onReset,
  onResetAll,
  onGameModeChange,
  onDifficultyChange,
}: GameInfoProps) {
  const statusMessage =
    status === 'winner'
      ? winner === 'O' && gameMode === 'pvc'
        ? 'Computer wins!'
        : `Player ${winner} wins!`
      : status === 'draw'
        ? "It's a draw!"
        : isAiThinking
          ? 'Computer is thinking...'
          : gameMode === 'pvc' && currentPlayer === 'O'
            ? 'Computer is thinking...'
            : `Player ${currentPlayer}'s turn`

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
      {/* Mode selector */}
      <div className="flex w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        {(['pvp', 'pvc'] as GameMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onGameModeChange(mode)}
            className={`flex-1 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
              gameMode === mode
                ? 'bg-violet-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {mode === 'pvp' ? '2 Players' : 'vs Computer'}
          </button>
        ))}
      </div>

      {/* Difficulty selector — only shown in PvC mode */}
      {gameMode === 'pvc' && (
        <div className="flex w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          {(['easy', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => onDifficultyChange(d)}
              className={`flex-1 py-1.5 text-sm font-medium transition-colors capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                difficulty === d
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* Score board */}
      <div className="flex w-full justify-around text-center">
        {(['X', 'O'] as Player[]).map((p) => (
          <div key={p} className="flex flex-col items-center">
            <span
              className={`text-3xl font-bold ${p === 'X' ? 'text-violet-600 dark:text-violet-400' : 'text-rose-500 dark:text-rose-400'}`}
            >
              {p === 'O' && gameMode === 'pvc' ? 'CPU' : p}
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
