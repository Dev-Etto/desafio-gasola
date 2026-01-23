import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { safeApiCallWithState } from '../utils/api_utils'

export interface RankingItem {
  username: string
  highScore: number
}

export function useRanking() {
  const [rankings, setRankings] = useState<RankingItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchRankings = async () => {
    const data = await safeApiCallWithState(
      async () => {
        const response = await api.get<RankingItem[]>('/ranking')
        return response.data
      },
      setIsLoading,
      setError,
      'Erro ao carregar ranking.'
    )

    if (data) {
      setRankings(data)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRankings()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return {
    rankings,
    isLoading,
    error,
    refetch: fetchRankings,
  }
}
