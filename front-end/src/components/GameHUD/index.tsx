import styled from 'styled-components'

interface GameHUDProps {
  score: number
  lives: number
  onQuit?: () => void
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const Value = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`

const QuitButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    filter: brightness(0.9);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const strings = {
  score: 'SCORE',
  lives: 'LIVES',
  quit: 'SAIR',
}

export function GameHUD({ score, lives, onQuit }: GameHUDProps) {
  return (
    <Container>
      <Stat>
        <Label>{strings.score}</Label>
        <Value>{score}</Value>
      </Stat>
      <Stat>
        <Label>{strings.lives}</Label>
        <Value>{lives} ❤️</Value>
      </Stat>
      {onQuit && (
        <Stat>
          <QuitButton onClick={onQuit}>{strings.quit}</QuitButton>
        </Stat>
      )}
    </Container>
  )
}
