import { useEffect, useState } from 'react'
import { useSocket } from './useSocket'
import { useGameSession } from './useGameSession'
import { socket } from '../services/socket'

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

  const [gameState, setGameState] = useState<GameState>({
    wordMask: '',
    remainingLives: 6,
    lettersGuessed: [],
    status: 'playing',
    message: '',
    score: 0,
    hintUsed: false,
    hint: undefined,
  })

  useEffect(() => {
    if (!gameId) {
      setGameState({
        wordMask: '',
        remainingLives: 6,
        lettersGuessed: [],
        status: 'playing',
        message: '',
        score: 0,
        hintUsed: false,
        hint: undefined,
      })
      return
    }

    setGameState((prevState) => ({
      ...prevState,
      hintUsed: false,
      hint: undefined,
    }))

    socket.emit('join_game', { gameId })

    socket.on('game_update', (data: GameState) => {
      setGameState((prevState) => ({
        ...prevState,
        ...data,
      }))
      if (data.score) {
        setScore(data.score)
      }
    })

    return () => {
      socket.off('game_update')
    }
  }, [gameId, setScore])

  const guessLetter = (letter: string) => {
    if (!gameId) return
    socket.emit('guess', { gameId, letter })
  }

  const requestHint = () => {
    if (!gameId) return
    socket.emit('request_hint', { gameId })
  }

  return {
    gameState,
    setGameState,
    guessLetter,
    requestHint,
  }
}
