import styled from 'styled-components'
import { useRanking } from '../../hooks/useRanking'
import { RankingTable } from '../../components/RankingTable'

interface RankingPageProps {
  onBack: () => void
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
`

const Button = styled.button`
  margin-top: 2rem;
  padding: 1rem 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.gray};
  color: ${({ theme }) => theme.colors.white};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.md};
  border: none;
  transition: filter 0.2s;

  &:hover {
    filter: brightness(0.9);
  }
`

const LoadingMessage = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.md};
`

const TableContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 1rem;
`

const strings = {
  title: '🏆 Ranking',
  loading: 'Carregando ranking...',
  back: 'VOLTAR',
}

export function Ranking({ onBack }: RankingPageProps) {
  const { rankings, isLoading, error } = useRanking()

  return (
    <Container>
      <Title>{strings.title}</Title>

      {isLoading && <LoadingMessage>{strings.loading}</LoadingMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {!isLoading && !error && (
        <TableContainer>
          <RankingTable rankings={rankings} />
        </TableContainer>
      )}

      <Button onClick={onBack}>{strings.back}</Button>
    </Container>
  )
}
