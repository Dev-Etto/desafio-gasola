import type { HttpContext } from '@adonisjs/core/http'
import GameService from '#services/game_service'
import { DEFAULTS } from '../constants/messages.js'
import { createGameValidator, guessLetterValidator } from '#validators/game_validator'

export default class GamesController {
  async store({ request, response }: HttpContext) {
    const { username } = await request.validateUsing(createGameValidator)

    const service = new GameService()

    const game = await service.createGame(username)

    const wordLength = game.word.word.length
    const categoryName = game.word.category ? game.word.category.name : DEFAULTS.UNKNOWN_CATEGORY

    return response.created({
      gameId: game.id,
      username: username,
      wordLength: wordLength,
      category: categoryName,
      remainingLives: game.remainingLives,
      lettersGuessed: [],
      status: game.status,
    })
  }

  async guess({ params, request, response }: HttpContext) {
    const gameId = params.id
    const { letter } = await request.validateUsing(guessLetterValidator)
    const service = new GameService()

    const { game, guessed, wordMask, isWin, isLoss, targetWord, message } =
      await service.processGuess(gameId, letter)

    return response.json({
      gameId: game.id,
      status: game.status,
      remainingLives: game.remainingLives,
      lettersGuessed: guessed,
      wordMask: wordMask,
      message,
      score: game.score,
      wordReveal: isWin || isLoss ? targetWord : undefined,
    })
  }
}
