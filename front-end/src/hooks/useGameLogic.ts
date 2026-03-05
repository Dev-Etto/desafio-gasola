import { useCallback, useEffect, useMemo, useState } from 'react'
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
  sessionScore?: number
  wordReveal?: string
  hintUsed: boolean
  hint?: string
  category?: string
  wordLength?: number
}

const INITIAL_GAME_STATE: GameState = {
  wordMask: '',
  remainingLives: 6,
  lettersGuessed: [],
  status: 'playing',
  message: '',
  score: 0,
  sessionScore: 0,
  hintUsed: false,
  hint: undefined,
}

export function useGameLogic() {
  const { gameId, setScore } = useGameSession()
  useSocket()

  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)

  const handleGameUpdate = useCallback(
    (data: GameState) => {
      setGameState((prevState) => ({
        ...prevState,
        ...data,
        hintUsed: data.hintUsed ?? false,
      }))

      if (typeof data.sessionScore === 'number') {
        setScore(data.sessionScore)
      }
    },
    [setScore]
  )

  useEffect(() => {
    if (!gameId) {
      return
    }

    socket.emit(SOCKET_EVENTS.JOIN_GAME, { gameId })
    setGameState(INITIAL_GAME_STATE)
    socket.on(SOCKET_EVENTS.GAME_UPDATE, handleGameUpdate)

    return () => {
      socket.off(SOCKET_EVENTS.GAME_UPDATE, handleGameUpdate)
    }
  }, [gameId, handleGameUpdate])

  const guessLetter = useCallback(
    (letter: string) => {
      if (!gameId) return
      socket.emit(SOCKET_EVENTS.GUESS, { gameId, letter })
    },
    [gameId]
  )

  const requestHint = useCallback(() => {
    if (!gameId) return
    socket.emit(SOCKET_EVENTS.REQUEST_HINT, { gameId })
  }, [gameId])

  return useMemo(
    () => ({
      gameState,
      setGameState,
      guessLetter,
      requestHint,
    }),
    [gameState, guessLetter, requestHint]
  )
}
