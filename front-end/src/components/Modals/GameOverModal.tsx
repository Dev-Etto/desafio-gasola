import styled from 'styled-components'
import { Modal } from '../../components/Modal'
import { RankingTable } from '../../components/RankingTable'
import { useRanking } from '../../hooks/useRanking'
import { useGameSession } from '../../hooks/useGameSession'
import { useEffect, useMemo } from 'react'

interface GameOverModalProps {
  score: number
  word: string
  onRestart: () => void
}

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  margin-bottom: 1rem;
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin: 0.5rem 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
`

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
`

const NewRecordBadge = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: bold;
  margin: 1rem 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
`

const RankingSection = styled.div`
  margin-top: 2rem;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
`

const RankingTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: 1rem;
  text-align: center;
`

const Button = styled.button`
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.colors.gray};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: bold;
  
  &:hover {
    filter: brightness(0.9);
  }
`

const strings = {
  gameOver: 'GAME OVER 💀',
  word: 'A palavra era:',
  finalScore: 'Pontuação Final:',
  newRecord: '🎉 NOVO RECORDE! 🎉',
  rankingTitle: '🏆 Top 10 Ranking',
  restart: 'MENU INICIAL',
}

export function GameOverModal({ score, word, onRestart }: GameOverModalProps) {
  const { rankings, refetch } = useRanking()
  const { username } = useGameSession()

  useEffect(() => {
    refetch()
  }, [refetch])

  const isNewRecord = useMemo(() => {
    if (rankings.length > 0 && username) {
      const userRanking = rankings.find(r => r.username === username)
      return userRanking ? score > userRanking.highScore : false
    }
    return false
  }, [rankings, username, score])

  return (
    <Modal>
      <Title>{strings.gameOver}</Title>
      <Text>
        {strings.word} <Highlight>{word}</Highlight>
      </Text>
      <Text>
        {strings.finalScore} <Highlight>{score}</Highlight>
      </Text>
      
      {isNewRecord && (
        <NewRecordBadge>{strings.newRecord}</NewRecordBadge>
      )}

      <RankingSection>
        <RankingTitle>{strings.rankingTitle}</RankingTitle>
        <RankingTable rankings={rankings.slice(0, 10)} highlightUsername={username} />
      </RankingSection>

      <Button onClick={onRestart}>{strings.restart}</Button>
    </Modal>
  )
}
