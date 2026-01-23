import styled from 'styled-components'

interface HintButtonProps {
  onRequestHint: () => void
  disabled: boolean
  hintUsed: boolean
}

const Button = styled.button<{ $used: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, $used }) =>
    $used ? theme.colors.gray : theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.md};
  border: none;
  transition: all 0.2s;
  cursor: pointer;

  &:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`

const Icon = styled.span`
  font-size: 1.2rem;
`

const strings = {
  used: 'DICA USADA',
  request: 'PEDIR DICA',
}

export function HintButton({ onRequestHint, disabled, hintUsed }: HintButtonProps) {
  return (
    <Button onClick={onRequestHint} disabled={disabled} $used={hintUsed}>
      <Icon>💡</Icon>
      {hintUsed ? strings.used : strings.request}
    </Button>
  )
}
