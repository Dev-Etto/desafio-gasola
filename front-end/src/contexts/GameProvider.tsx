import { useState, type ReactNode } from 'react'
import { GameContext } from './GameContext'

export function GameProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState('')
  const [gameId, setGameId] = useState<number | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [score, setScore] = useState(0)

  return (
    <GameContext.Provider
      value={{
        username,
        setUsername,
        gameId,
        setGameId,
        score,
        setScore,
        sessionId,
        setSessionId,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}
