import Ws from '#services/ws'
import { Server, Socket } from 'socket.io'
import { safeExec } from '../app/utils/socket_utils.js'
import { guessLetterValidator } from '#validators/game_validator'

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

        const response = {
          gameId: game.id,
          status: game.status,
          remainingLives: game.remainingLives,
          lettersGuessed: guessed,
          wordMask: wordMask,
          message,
          score: game.score,
          wordReveal: isWin || isLoss ? targetWord : undefined,
        }

        io.to(`game:${gameId}`).emit('game_update', response)
      })
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id)
    })
  })
})
