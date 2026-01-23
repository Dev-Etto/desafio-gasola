import { useContext } from 'react'
import { GameContext } from '@contexts/GameContext'

export function useGameSession() {
  return useContext(GameContext)
}
