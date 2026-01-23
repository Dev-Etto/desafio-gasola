import styled from 'styled-components'
import { useHome } from './useHome'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 2rem;
`

const Title = styled.h1`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary};
`

const Input = styled.input`
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  width: 100%;
  max-width: 300px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`

const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  border: none;
  transition: filter 0.2s;

  &:hover {
    filter: brightness(0.9);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const SecondaryButton = styled(Button)`
  background: ${({ theme }) => theme.colors.gray};
`

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

interface HomeProps {
  onNavigateToRanking: () => void
}

const strings = {
  title: 'Gasola Hangman',
  placeholder: 'Digite seu nickname',
  loading: 'Carregando...',
  play: 'JOGAR',
  ranking: 'RANKING',
}

export function Home({ onNavigateToRanking }: HomeProps) {
  const { nickname, setNickname, handleStartGame, isLoading, error } = useHome()

  return (
    <Container>
      <Title>{strings.title}</Title>
      
      <Input
        placeholder={strings.placeholder}
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ButtonContainer>
        <Button onClick={handleStartGame} disabled={isLoading}>
          {isLoading ? strings.loading : strings.play}
        </Button>
        <SecondaryButton onClick={onNavigateToRanking}>
          {strings.ranking}
        </SecondaryButton>
      </ButtonContainer>
    </Container>
  )
}
