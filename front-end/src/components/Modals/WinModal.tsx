import styled from 'styled-components'
import { Modal } from '../../components/Modal'

interface WinModalProps {
  score: number
  word: string
  onNextWord: () => void
  onQuit?: () => void
}

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
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

const Button = styled.button`
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: bold;
  
  &:hover {
    filter: brightness(0.9);
  }
`

const SecondaryButton = styled(Button)`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  margin-left: 1rem;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`
const strings = {
  title: 'VOCÊ VENCEU! 🎉',
  text: 'A palavra era: ',
  score: 'Sua pontuação atual: ',
  nextWord: 'PRÓXIMA PALAVRA',
  quit: 'VOLTAR AO MENU',
}

export function WinModal({ score, word, onNextWord, onQuit }: WinModalProps) {
  return (
    <Modal>
      <Title>{strings.title}</Title>
      <Text>
        {strings.text} <Highlight>{word}</Highlight>
      </Text>
      <Text>
        {strings.score} <Highlight>{score}</Highlight>
      </Text>
      <ButtonContainer>
        <Button onClick={onNextWord}>{strings.nextWord}</Button>
        {onQuit && (
          <SecondaryButton onClick={onQuit}>{strings.quit}</SecondaryButton>
        )}
      </ButtonContainer>
    </Modal>
  )
}
