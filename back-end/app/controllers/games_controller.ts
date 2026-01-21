import type { HttpContext } from '@adonisjs/core/http'
import GameService from '#services/game_service'
import { ERROR_MESSAGES, GAME_MESSAGES, DEFAULTS } from '../constants/messages.js'

export default class GamesController {
  async store({ request, response }: HttpContext) {
    const { username } = request.only(['username'])

    if (!username) {
      return response.badRequest({ message: ERROR_MESSAGES.USERNAME_REQUIRED })
    }

    const service = new GameService()

    const game = await service.createGame(username)

    const wordLength = game.word.word.length
    const categoryName = game.word.category ? game.word.category.name : DEFAULTS.UNKNOWN_CATEGORY

    return response.created({
      game_id: game.id,
      username: username,
      word_length: wordLength,
      category: categoryName,
      remaining_lives: game.remainingLives,
      letters_guessed: [],
      status: game.status,
    })
  }

  async guess({ params, request, response }: HttpContext) {
    const gameId = params.id
    const { letter } = request.only(['letter'])
    const service = new GameService()

    const { game, guessed, wordMask, isWin, isLoss, targetWord } = await service.processGuess(
      gameId,
      letter
    )

    const message = isWin
      ? GAME_MESSAGES.YOU_WON
      : isLoss
        ? GAME_MESSAGES.GAME_OVER
        : GAME_MESSAGES.KEEP_GUESSING

    return response.json({
      game_id: game.id,
      status: game.status,
      remaining_lives: game.remainingLives,
      letters_guessed: guessed,
      word_mask: wordMask,
      message,
      score: game.score,
      word_reveal: isWin || isLoss ? targetWord : undefined,
    })
  }
}
