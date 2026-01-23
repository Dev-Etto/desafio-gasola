import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { api } from '../services/api'
import { useGameSession } from './useGameSession'

export function useGameControl() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { setUsername, setGameId, setScore, setSessionId, sessionId: currentSessionId, username: currentUsername } = useGameSession()

  const startNewGame = async (nickname?: string, keepSession = false) => {
    setIsLoading(true)
    setError('')

    try {
      const user = nickname || currentUsername
      const session = keepSession && currentSessionId ? currentSessionId : uuidv4()

      if (!user) throw new Error('Username is required')

      const response = await api.post('/games', {
        username: user,
        sessionId: session,
      })

      const { gameId } = response.data

      setUsername(user)
      setGameId(gameId)
      setSessionId(session)
      
      if (!keepSession) {
        setScore(0)
      }

    } catch (err) {
      console.error(err)
      setError('Erro ao iniciar o jogo.')
      throw err 
    } finally {
      setIsLoading(false)
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
