export type Player = 'X' | 'O'
export type CellValue = Player | null
export type Board = [
  CellValue, CellValue, CellValue,
  CellValue, CellValue, CellValue,
  CellValue, CellValue, CellValue,
]
export type GameStatus = 'playing' | 'winner' | 'draw'
export type GameMode = 'pvp' | 'pvc'
export type Difficulty = 'easy' | 'hard'

export interface WinResult {
  winner: Player
  line: [number, number, number]
}

export interface GameState {
  board: Board
  currentPlayer: Player
  status: GameStatus
  winResult: WinResult | null
  scores: Record<Player, number>
}
