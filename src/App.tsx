import { Board } from './components/Board'
import { GameInfo } from './components/GameInfo'
import { ThemeToggle } from './components/ThemeToggle'
import { useGame } from './hooks/useGame'
import { useTheme } from './hooks/useTheme'

function App() {
  const { board, currentPlayer, status, winResult, scores, handleCellClick, resetBoard, resetAll } = useGame()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 py-8">
        {/* Header */}
        <header className="flex items-center gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Tic-Tac-Toe
          </h1>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        {/* Game board */}
        <main>
          <Board
            board={board}
            winResult={winResult}
            status={status}
            onCellClick={handleCellClick}
          />
        </main>

        {/* Game info & controls */}
        <GameInfo
          currentPlayer={currentPlayer}
          status={status}
          winner={winResult?.winner ?? null}
          scores={scores}
          onReset={resetBoard}
          onResetAll={resetAll}
        />
      </div>
    </div>
  )
}

export default App

