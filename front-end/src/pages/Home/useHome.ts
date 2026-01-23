import { useState } from 'react'
import { useGameControl } from '../../hooks/useGameControl'

export function useHome() {
  const [nickname, setNickname] = useState('')
  const { startNewGame, isLoading, error } = useGameControl()

  const handleStartGame = async () => {
    if (!nickname.trim()) {
      return
    }
    
    await startNewGame(nickname)
  }

  return {
    nickname,
    setNickname,
    handleStartGame,
    isLoading,
    error,
  }
}
