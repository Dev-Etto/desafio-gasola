import { Exception } from '@adonisjs/core/exceptions'
import { ERROR_MESSAGES } from '../../constants/messages.js'

export class GameNotFoundException extends Exception {
  static status = 404
  static code = 'E_GAME_NOT_FOUND'

  constructor(message = ERROR_MESSAGES.GAME_NOT_FOUND) {
    super(message, { status: GameNotFoundException.status, code: GameNotFoundException.code })
  }
}

export class InvalidGameActionException extends Exception {
  static status = 400
  static code = 'E_INVALID_GAME_ACTION'

  constructor(message: string) {
    super(message, {
      status: InvalidGameActionException.status,
      code: InvalidGameActionException.code,
    })
  }
}

export class PuzzlesUnavailableException extends Exception {
  static status = 503
  static code = 'E_PUZZLES_UNAVAILABLE'

  constructor(message = ERROR_MESSAGES.NO_PUZZLES_AVAILABLE) {
    super(message, {
      status: PuzzlesUnavailableException.status,
      code: PuzzlesUnavailableException.code,
    })
  }
}
