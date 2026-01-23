import { createContext } from 'react'

export interface GameContextData {
  username: string
  setUsername: (username: string) => void
  gameId: number | null
  setGameId: (id: number | null) => void
  score: number
  setScore: (score: number) => void
  sessionId: string | null
  setSessionId: (id: string | null) => void
}

export const GameContext = createContext<GameContextData>({} as GameContextData)
