import Game from '#models/game'
import User from '#models/user'
import Word from '#models/word'
import db from '@adonisjs/lucid/services/db'
import {
  GameNotFoundException,
  InvalidGameActionException,
  PuzzlesUnavailableException,
} from '#exceptions/game/exceptions'
import { safeParse } from '../utils/json_utils.js'

import { ERROR_MESSAGES } from '../constants/messages.js'

export default class GameService {
  async createGame(username: string) {
    return await db.transaction(async (trx) => {
      const user = await User.firstOrCreate({ username }, { username }, { client: trx })
      const word = await Word.query({ client: trx }).orderByRaw('RANDOM()').first()

      if (!word) {
        throw new PuzzlesUnavailableException(ERROR_MESSAGES.NO_WORDS_AVAILABLE)
      }

      const newGame = await Game.create(
        {
          userId: user.id,
          wordId: word.id,
          status: 'playing',
          remainingLives: 6,
          lettersGuessed: JSON.stringify([]),
          score: 0,
        },
        { client: trx }
      )

      await newGame.load('word')
      await newGame.word.load('category')

      return newGame
    })
  }

  async processGuess(gameId: number, letter: string) {
    if (!letter || typeof letter !== 'string' || letter.length !== 1 || !/[a-zA-Z]/.test(letter)) {
      throw new InvalidGameActionException(ERROR_MESSAGES.INVALID_LETTER)
    }

    const upperLetter = letter.toUpperCase()

    const game = await Game.find(gameId)
    if (!game) {
      throw new GameNotFoundException()
    }

    if (game.status !== 'playing') {
      throw new InvalidGameActionException(ERROR_MESSAGES.GAME_ALREADY_OVER)
    }

    await game.load('word')
    const targetWord = game.word.word.toUpperCase()

    const guessed = safeParse<string[]>(game.lettersGuessed, [])

    if (guessed.includes(upperLetter)) {
      throw new InvalidGameActionException(ERROR_MESSAGES.LETTER_ALREADY_GUESSED)
    }

    guessed.push(upperLetter)
    game.lettersGuessed = JSON.stringify(guessed)

    if (!targetWord.includes(upperLetter)) {
      game.remainingLives -= 1
    }

    const isWin = targetWord.split('').every((char) => guessed.includes(char))
    const isLoss = game.remainingLives <= 0

    if (isWin) {
      game.status = 'won'
      game.score = 100 + game.remainingLives * 10
    } else if (isLoss) {
      game.status = 'lost'
    }

    await game.save()

    const wordMask = targetWord
      .split('')
      .map((char) => (guessed.includes(char) ? char : '_'))
      .join(' ')

    return {
      game,
      wordMask,
      guessed,
      isWin,
      isLoss,
      targetWord,
    }
  }
}
