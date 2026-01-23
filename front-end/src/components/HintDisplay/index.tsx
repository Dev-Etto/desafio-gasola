import styled, { keyframes } from 'styled-components'

interface HintDisplayProps {
  hint?: string
  visible: boolean
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const Container = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary}20, ${({ theme }) => theme.colors.primary}20);
  border-left: 4px solid ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  animation: ${fadeIn} 0.3s ease-out;
  max-width: 600px;
  margin: 0 auto;
`

const Icon = styled.span`
  font-size: 1.5rem;
  flex-shrink: 0;
`

const Text = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: 1.5;
`

const Label = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
  margin-right: 0.5rem;
`

export function HintDisplay({ hint, visible }: HintDisplayProps) {
  if (!visible || !hint) return null

  return (
    <Container $visible={visible}>
      <Icon>💡</Icon>
      <Text>
        <Label>Dica:</Label>
        {hint}
      </Text>
    </Container>
  )
}
