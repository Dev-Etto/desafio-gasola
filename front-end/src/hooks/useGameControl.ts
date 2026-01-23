import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { api } from '../services/api'
import { useGameSession } from './useGameSession'
import { safeApiCallWithState } from '../utils/api_utils'

const strings = {
  usernameRequired: 'Username is required',
  errorStartingGame: 'Error starting the game',
}

export function useGameControl() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { setUsername, setGameId, setScore, setSessionId, sessionId: currentSessionId, username: currentUsername } = useGameSession()

  const startNewGame = async (nickname?: string, keepSession = false) => {
    const user = nickname || currentUsername
    const session = keepSession && currentSessionId ? currentSessionId : uuidv4()

    if (!user) {
      setError(strings.usernameRequired)
      return
    }

    const data = await safeApiCallWithState(
      async () => {
        const response = await api.post<{ gameId: number }>('/games', {
          username: user,
          sessionId: session,
        })
        return response.data
      },
      setIsLoading,
      setError,
      strings.errorStartingGame
    )

    if (data) {
      setUsername(user)
      setGameId(data.gameId)
      setSessionId(session)
      
      if (!keepSession) {
        setScore(0)
      }
    }
  }

  const quitGame = () => {
    setGameId(null)
    setSessionId(null)
    setScore(0)
    setUsername('')
  }

  return {
    startNewGame,
    quitGame,
    isLoading,
    error,
  }
}
