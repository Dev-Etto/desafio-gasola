import Ws from '#services/ws'
import { Server, Socket } from 'socket.io'
import { safeExec } from '../app/utils/socket_utils.js'
import { guessLetterValidator } from '#validators/game_validator'
import GameResponseDto from '#dtos/game_response.dto'

interface JoinGamePayload {
  gameId: number
}

interface GuessPayload {
  gameId: number
  letter: string
}

Ws.ready((io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('New connection: ', socket.id)

    socket.on('join_game', (data: JoinGamePayload) => {
      safeExec(socket, async () => {
        const { gameId } = data
        if (gameId) {
          socket.join(`game:${gameId}`)
          console.log(`Socket ${socket.id} joined game:${gameId}`)
        }
      })
    })

    socket.on('guess', (data: GuessPayload) => {
      safeExec(socket, async () => {
        const { gameId, letter } = data

        const { letter: validLetter } = await guessLetterValidator.validate({ letter })

        const GameService = await import('#services/game_service')
        const service = new GameService.default()
        const { game, guessed, wordMask, isWin, isLoss, targetWord, message } =
          await service.processGuess(gameId, validLetter)

        const response = GameResponseDto.fromDomain({
          game,
          wordMask,
          message,
          guessed,
          isWin,
          isLoss,
          targetWord,
        })

        io.to(`game:${gameId}`).emit('game_update', response)
      })
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id)
    })
  })
})
