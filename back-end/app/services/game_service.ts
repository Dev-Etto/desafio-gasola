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
import { GameStatus } from '#enums/game_status'

import { ERROR_MESSAGES, GAME_MESSAGES } from '../constants/messages.js'

export default class GameService {
  async createGame(username: string, sessionId: string) {
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
          sessionId: sessionId,
          status: GameStatus.PLAYING,
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
    const upperLetter = letter.toUpperCase()

    const game = await Game.find(gameId)
    if (!game) {
      throw new GameNotFoundException()
    }

    if (game.status !== GameStatus.PLAYING) {
      throw new InvalidGameActionException(ERROR_MESSAGES.GAME_ALREADY_OVER)
    }

    await game.load('word')
    const targetWord = game.word.word.toUpperCase()

    const guessed = safeParse<string[]>(game.lettersGuessed, [])

    if (guessed.includes(upperLetter)) {
      throw new InvalidGameActionException(ERROR_MESSAGES.LETTER_ALREADY_GUESSED)
    }

    guessed.push(upperLetter)

    const updates: Partial<Game> = {
      lettersGuessed: JSON.stringify(guessed),
    }

    if (!targetWord.includes(upperLetter)) {
      updates.remainingLives = game.remainingLives - 1
    }

    const isWin = targetWord.split('').every((char) => guessed.includes(char))
    const isLoss = (updates.remainingLives ?? game.remainingLives) <= 0

    if (isWin) {
      updates.status = GameStatus.WON
      const uniqueLetters = new Set(targetWord.replace(/\s/g, '').split('')).size
      updates.score = uniqueLetters * 10 + (updates.remainingLives ?? game.remainingLives) * 5
    }

    if (isLoss) {
      updates.status = GameStatus.LOST

      const sessionGames = await Game.query()
        .where('session_id', game.sessionId)
        .where('status', GameStatus.WON)

      const sessionScore = sessionGames.reduce((acc, g) => acc + g.score, 0)

      const user = await User.find(game.userId)
      if (user && sessionScore > user.highScore) {
        user.highScore = sessionScore
        await user.save()
      }
    }

    game.merge(updates)
    await game.save()

    const wordMask = targetWord
      .split('')
      .map((char) => (guessed.includes(char) ? char : '_'))
      .join(' ')

    const message = this.getGameMessage(isWin, isLoss)

    return {
      game,
      wordMask,
      guessed,
      isWin,
      isLoss,
      targetWord,
      message,
    }
  }

  getGameMessage(isWin: boolean, isLoss: boolean): string {
    if (isWin) {
      return GAME_MESSAGES.YOU_WON
    }

    if (isLoss) {
      return GAME_MESSAGES.GAME_OVER
    }

    return GAME_MESSAGES.KEEP_GUESSING
  }
}
