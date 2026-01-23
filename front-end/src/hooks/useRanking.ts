import { useState, useEffect } from 'react'
import { api } from '../services/api'

export interface RankingItem {
  username: string
  highScore: number
}

export function useRanking() {
  const [rankings, setRankings] = useState<RankingItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchRankings = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await api.get('/ranking')
      setRankings(response.data)
    } catch (err) {
      console.error('Error fetching rankings:', err)
      setError('Erro ao carregar ranking.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRankings()
  }, [])

  return {
    rankings,
    isLoading,
    error,
    refetch: fetchRankings,
  }
}
