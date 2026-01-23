import Game from '#models/game'
import { GameStatus } from '#enums/game_status'
import { safeParse } from '../utils/json_utils.js'

export interface GameResponseProps {
  game: Game
  wordMask?: string
  message?: string
  guessed?: string[]
  isWin?: boolean
  isLoss?: boolean
  targetWord?: string
  hint?: string
}

export default class GameResponseDto {
  constructor(
    public gameId: number,
    public status: GameStatus,
    public remainingLives: number,
    public lettersGuessed: string[],
    public score: number,
    public hintUsed: boolean,
    public wordMask?: string,
    public message?: string,
    public wordReveal?: string,
    public category?: string,
    public wordLength?: number,
    public hint?: string
  ) {}

  static fromDomain({
    game,
    wordMask,
    message,
    guessed,
    isWin,
    isLoss,
    targetWord,
    hint,
  }: GameResponseProps): GameResponseDto {
    const isGameOver =
      isWin || isLoss || game.status === GameStatus.WON || game.status === GameStatus.LOST

    const parsedGuessed = guessed ?? safeParse<string[]>(game.lettersGuessed, [])

    return new GameResponseDto(
      game.id,
      game.status,
      game.remainingLives,
      parsedGuessed,
      game.score,
      game.hintUsed,
      wordMask,
      message,
      isGameOver ? targetWord : undefined,
      game.word?.category?.name,
      game.word?.word?.length,
      hint
    )
  }
}
