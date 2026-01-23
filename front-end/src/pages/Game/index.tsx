import styled from 'styled-components'
import { useGameLogic } from '@hooks/useGameLogic'
import { Keyboard } from '@components/Keyboard'
import { WordDisplay } from '@components/WordDisplay'
import { GameHUD } from '@components/GameHUD'
import { HangmanFigure } from '@components/HangmanFigure'
import { WinModal } from '@components/Modals/WinModal'
import { GameOverModal } from '@components/Modals/GameOverModal'
import { useGameControl } from '@hooks/useGameControl'
import { HintButton } from '@components/HintButton'
import { HintDisplay } from '@components/HintDisplay'
import { CategoryDisplay } from '@components/CategoryDisplay'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 100vh;
  justify-content: center;
`

const TopSection = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  align-items: flex-start;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  flex: 1;
  max-width: 500px;
`

const Message = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.warning};
  font-weight: bold;
  min-height: 1.5rem;
  text-align: center;
`

const HintSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
`

export function Game() {
  const { gameState, guessLetter, requestHint } = useGameLogic()
  const { startNewGame, quitGame } = useGameControl()
  const { wordMask, remainingLives, lettersGuessed, score, status, message, wordReveal, hintUsed, hint, category } = gameState
  
  const isPlaying = status === 'playing'
  const isWon = status === 'won'
  const isLost = status === 'lost'

  const handleNextWord = () => {
    startNewGame(undefined, true)
  }

  const handleRestart = () => {
    quitGame()
  }

  return (
    <Container>
      <GameHUD score={score} lives={remainingLives} onQuit={quitGame} />
      
      <TopSection>
        <LeftColumn>
          <HangmanFigure lives={remainingLives} />
        </LeftColumn>

        <RightColumn>
          <Message>{message}</Message>
          
          <CategoryDisplay category={category} />
          
          <WordDisplay wordMask={wordMask} />

          <HintSection>
            <HintButton 
              onRequestHint={requestHint}
              disabled={!isPlaying || hintUsed}
              hintUsed={hintUsed}
            />
            {hint && <HintDisplay hint={hint} visible={!!hint} />}
          </HintSection>
        </RightColumn>
      </TopSection>

      <Keyboard
        onGuess={guessLetter}
        guessedLetters={lettersGuessed}
        disabled={!isPlaying}
      />
      
      {isWon && (
        <WinModal
          score={score}
          word={wordReveal || wordMask}
          onNextWord={handleNextWord}
          onQuit={quitGame}
        />
      )}

      {isLost && (
        <GameOverModal
          score={score}
          word={wordReveal || '???'}
          onRestart={handleRestart}
        />
      )}
    </Container>
  )
}
