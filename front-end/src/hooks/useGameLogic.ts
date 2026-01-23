import { useEffect, useState } from 'react'
import { useSocket } from './useSocket'
import { useGameSession } from './useGameSession'
import { socket } from '../services/socket'
import { SOCKET_EVENTS } from '../constants/socket_events'

export interface GameState {
  wordMask: string
  remainingLives: number
  lettersGuessed: string[]
  status: string
  message: string
  score: number
  wordReveal?: string
  hintUsed: boolean
  hint?: string
  category?: string
  wordLength?: number
}

export function useGameLogic() {
  const { gameId, setScore } = useGameSession()
  useSocket()

  const initialState: GameState = {
    wordMask: '',
    remainingLives: 6,
    lettersGuessed: [],
    status: 'playing',
    message: '',
    score: 0,
    hintUsed: false,
    hint: undefined,
  }

  const [gameState, setGameState] = useState<GameState>(initialState)

  useEffect(() => {
    if (!gameId) {
      return
    }

    socket.emit(SOCKET_EVENTS.JOIN_GAME, { gameId })

    const handleGameUpdate = (data: GameState) => {
      setGameState((prevState) => ({
        ...prevState,
        ...data,
        hintUsed: data.hintUsed ?? false,
      }))
      if (data.score) {
        setScore(data.score)
      }
    }

    socket.on(SOCKET_EVENTS.GAME_UPDATE, handleGameUpdate)

    return () => {
      socket.off(SOCKET_EVENTS.GAME_UPDATE, handleGameUpdate)
    }
  }, [gameId, setScore])

  const guessLetter = (letter: string) => {
    if (!gameId) return
    socket.emit(SOCKET_EVENTS.GUESS, { gameId, letter })
  }

  const requestHint = () => {
    if (!gameId) return
    socket.emit(SOCKET_EVENTS.REQUEST_HINT, { gameId })
  }

  return {
    gameState,
    setGameState,
    guessLetter,
    requestHint,
  }
}
