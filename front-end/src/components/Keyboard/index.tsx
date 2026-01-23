import styled from 'styled-components'

interface KeyboardProps {
  onGuess: (letter: string) => void
  guessedLetters: string[]
  disabled: boolean
}

const KeyboardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-width: 600px;
  justify-content: center;
  padding: 1rem;
`

const Key = styled.button<{ $isUsed: boolean }>`
  width: 40px;
  height: 50px;
  background: ${({ theme, $isUsed }) =>
    $isUsed ? theme.colors.surface : theme.colors.primary};
  color: ${({ theme, $isUsed }) =>
    $isUsed ? theme.colors.textSecondary : theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.md};
  
  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export function Keyboard({ onGuess, guessedLetters, disabled }: KeyboardProps) {
  return (
    <KeyboardContainer>
      {ALPHABET.map((letter) => {
        const isUsed = guessedLetters.includes(letter)
        return (
          <Key
            key={letter}
            onClick={() => onGuess(letter)}
            disabled={disabled || isUsed}
            $isUsed={isUsed}
          >
            {letter}
          </Key>
        )
      })}
    </KeyboardContainer>
  )
}
