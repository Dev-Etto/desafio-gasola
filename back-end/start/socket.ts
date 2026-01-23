import Ws from '#services/ws'
import { Server, Socket } from 'socket.io'
import { guessLetterValidator } from '#validators/game_validator'
import GameResponseDto from '#dtos/game_response.dto'
import { safeExec } from '../app/utils/socket_utils.js'
import { SOCKET_EVENTS } from '../app/constants/socket_events.js'

interface JoinGamePayload {
  gameId: number
}

interface GuessPayload {
  gameId: number
  letter: string
}

Ws.ready((io: Server) => {
  io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
    console.log('New connection: ', socket.id)

    socket.on(SOCKET_EVENTS.JOIN_GAME, (data: JoinGamePayload) => {
      safeExec(socket, async () => {
        const { gameId } = data
        if (gameId) {
          socket.join(`game:${gameId}`)
          console.log(`Socket ${socket.id} joined game:${gameId}`)

          const GameService = await import('#services/game_service')
          const service = new GameService.default()
          const { game, wordMask } = await service.getGameState(gameId)

          const hint = game.hintUsed
            ? game.word.hint || 'No hint available for this word'
            : undefined

          const response = GameResponseDto.fromDomain({
            game,
            wordMask,
            hint,
          })

          socket.emit(SOCKET_EVENTS.GAME_UPDATE, response)
        }
      })
    })

    socket.on(SOCKET_EVENTS.GUESS, (data: GuessPayload) => {
      safeExec(socket, async () => {
        const { gameId, letter } = data

        const { letter: validLetter } = await guessLetterValidator.validate({ letter })

        const GameService = await import('#services/game_service')
        const service = new GameService.default()
        const { game, guessed, wordMask, isWin, isLoss, targetWord, message } =
          await service.processGuess(gameId, validLetter)

        const hint = game.hintUsed ? game.word.hint || 'No hint available for this word' : undefined

        const response = GameResponseDto.fromDomain({
          game,
          wordMask,
          message,
          guessed,
          isWin,
          isLoss,
          targetWord,
          hint,
        })

        io.to(`game:${gameId}`).emit(SOCKET_EVENTS.GAME_UPDATE, response)
      })
    })

    socket.on(SOCKET_EVENTS.REQUEST_HINT, (data: JoinGamePayload) => {
      safeExec(socket, async () => {
        const { gameId } = data

        const GameService = await import('#services/game_service')
        const service = new GameService.default()
        const { game, hint } = await service.requestHint(gameId)
        const { wordMask } = await service.getGameState(gameId)

        const response = GameResponseDto.fromDomain({
          game,
          wordMask,
          hint,
        })

        io.to(`game:${gameId}`).emit(SOCKET_EVENTS.GAME_UPDATE, response)
      })
    })

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log('Client disconnected', socket.id)
    })
  })
})
